/* eslint-disable */

import { ethers } from "ethers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

import {
  StakingContract,
  sCalmTokenContract,
  CalmTokenContract,
  pCalmTokenContract,
  pCalmTokenSalesContract,
  UCCTokenContract,
  flatUCCTokenSalesContract,
  UCCMultisendContract,
} from "../../calmAbi";
import { getAddresses, POLYGON_MAINNET } from "../../constants";
import { Networks } from "../../constants/blockchain";
import { messages } from "../../constants/messages";
import { getMarketPrice, getTokenPrice, setAll, sleep } from "../../helpers";
import allBonds from "../../helpers/bond";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { warning, success, info, error } from "../../store/slices/messages-slice";

import { RootState } from "../store";

import { fetchAccountSuccess, getBalances } from "./account-slice";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";

interface ILoadAppDetails {
  networkID: number;
  provider: JsonRpcProvider;
  address: string;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  //@ts-ignore
  async ({ networkID, provider, address }: ILoadAppDetails) => {
    const daiPrice = getTokenPrice("DAI");
    const addresses = getAddresses(networkID);

    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
    const currentBlock = await provider.getBlockNumber();

    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    const sCalmContract = new ethers.Contract(addresses.SCALM_ADDRESS, sCalmTokenContract, provider);
    const calmContract = new ethers.Contract(addresses.CALM_ADDRESS, CalmTokenContract, provider);

    const pCalmContract = new ethers.Contract(addresses.PCALM_ADDRESS, pCalmTokenContract, provider);
    const pCalmSalesContract = new ethers.Contract(addresses.PCALM_SALES_ADDRESS, pCalmTokenSalesContract, provider);

    const uccContract = new ethers.Contract(addresses.UCC_ADDRESS, UCCTokenContract, provider);
    const uccSalesContract = new ethers.Contract(addresses.UCC_SALES_ADDRESS, flatUCCTokenSalesContract, provider);

    const marketPrice = await getMarketPrice(networkID, provider);

    const totalSupply = (await uccContract.totalSupply()) / Math.pow(10, 9);
    const salesContractUccBalance = await uccContract.balanceOf(POLYGON_MAINNET.UCC_SALES_ADDRESS);
    const formattedSalesContractUccBalance = ethers.utils.formatUnits(salesContractUccBalance, "gwei");
    const numUCCSold = 10000000 - Number(formattedSalesContractUccBalance);
    const initialCirculatingSupply = 770536;

    const circSupply = numUCCSold + initialCirculatingSupply;

    const stakingTVL = circSupply * marketPrice;
    const marketCap = (initialCirculatingSupply + numUCCSold) * marketPrice;

    const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider));
    const tokenBalances = await Promise.all(tokenBalPromises);
    const treasuryBalance = tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1, 0);

    const tokenAmountsPromises = allBonds.map(bond => bond.getTokenAmount(networkID, provider));
    const tokenAmounts = await Promise.all(tokenAmountsPromises);
    const rfvTreasury = tokenAmounts.reduce((tokenAmount0, tokenAmount1) => tokenAmount0 + tokenAmount1, 0);

    const calmBondsAmountsPromises = allBonds.map(bond => bond.getCalmAmount(networkID, provider));
    const calmBondsAmounts = await Promise.all(calmBondsAmountsPromises);
    const calmAmount = calmBondsAmounts.reduce((calmAmount0, calmAmount1) => calmAmount0 + calmAmount1, 0);

    // calmSupply is totalSupply - calmAmount - 30,000 assigned to the team
    const calmSupply = totalSupply - calmAmount;

    const rfv = rfvTreasury / calmSupply;

    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await sCalmContract.circulatingSupply();

    const stakingRebase = stakingReward / circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    const currentIndex = await stakingContract.index();
    const nextRebase = epoch.endTime;

    const treasuryRunway = rfvTreasury / circSupply;
    const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

    const uccPrice = await uccSalesContract.UCCPrice();

    const uccPurchaseLimit = await uccSalesContract.UCCPurchaseLimit();

    return {
      currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")) / 4.5,
      totalSupply,
      marketCap,
      currentBlock,
      circSupply,
      fiveDayRate,
      treasuryBalance,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketPrice,
      currentBlockTime,
      nextRebase,
      rfv,
      runway,
      uccPrice,
      uccPurchaseLimit,
    };
  },
);

interface IChangeStake {
  action: string;
  value: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: Networks;
  beneficiaryAddresses?: string[];
}

export const buyUCC = createAsyncThunk("preSale/buyUCC", async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
  if (!provider) {
    dispatch(warning({ text: messages.please_connect_wallet }));
    return;
  }
  const addresses = getAddresses(networkID);
  const signer = provider.getSigner();

  const uccPreSaleContract = new ethers.Contract(addresses.UCC_SALES_ADDRESS, flatUCCTokenSalesContract, signer);

  let buyTx;

  try {
    const gasPrice = await getGasPrice(provider);

    if (action === "buy") {
      const valueInWei = ethers.utils.parseUnits(value, "gwei");

      const pCalmPrice = await uccPreSaleContract.UCCPrice();
      const priceToPay = Number(valueInWei) * Number(pCalmPrice / Math.pow(10, 9));

      const finalPriceToPay = Math.round(priceToPay);

      buyTx = await uccPreSaleContract.buyUCC(finalPriceToPay.toString(), { gasPrice });
    } else {
      // stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true, { gasPrice });
    }
    const pendingTxnType = action === "buy" ? "buying" : "swapping";
    dispatch(fetchPendingTxns({ txnHash: buyTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
    await buyTx.wait();
    dispatch(success({ text: messages.tx_successfully_send }));
  } catch (err: any) {
    return metamaskErrorWrap(err, dispatch);
  } finally {
    if (buyTx) {
      dispatch(clearPendingTxn(buyTx.hash));
    }
  }
  dispatch(info({ text: messages.your_balance_update_soon }));
  await sleep(10);
  await dispatch(getBalances({ address, networkID, provider }));
  dispatch(info({ text: messages.your_balance_updated }));
  return;
});

export const giveoutUCC = createAsyncThunk("multisend/giveoutUCC", async ({ action, value, provider, address, networkID, beneficiaryAddresses }: IChangeStake, { dispatch }) => {
  if (!provider) {
    dispatch(warning({ text: messages.please_connect_wallet }));
    return;
  }
  const addresses = getAddresses(networkID);
  const signer = provider.getSigner();

  const uccGiveoutContract = new ethers.Contract(addresses.UCC_MULTISEND_ADDRESS, UCCMultisendContract, signer);

  let givoutTx;

  try {
    const gasPrice = await getGasPrice(provider);

    if (action === "giveout") {
      const valueInWei = ethers.utils.parseUnits(value, "gwei");
      givoutTx = await uccGiveoutContract.multiTransferTokenEqual_71p(addresses.UCC_ADDRESS, beneficiaryAddresses, valueInWei, { gasPrice });
    } else {
      // stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true, { gasPrice });
    }
    const pendingTxnType = action === "giveout" ? "giveout" : "not giveout";
    dispatch(fetchPendingTxns({ txnHash: givoutTx.hash, text: "Giving Out UCC", type: pendingTxnType }));
    await givoutTx.wait();
    dispatch(success({ text: messages.tx_successfully_send }));
  } catch (err: any) {
    return metamaskErrorWrap(err, dispatch);
  } finally {
    if (givoutTx) {
      dispatch(clearPendingTxn(givoutTx.hash));
    }
  }
  dispatch(info({ text: messages.your_balance_update_soon }));
  await sleep(10);
  await dispatch(getBalances({ address, networkID, provider }));
  dispatch(info({ text: messages.your_balance_updated }));
  return;
});

const initialState = {
  loading: true,
};

export interface IAppSlice {
  loading: boolean;
  stakingTVL: number;
  marketPrice: number;
  marketCap: number;
  circSupply: number;
  currentIndex: string;
  currentBlock: number;
  currentBlockTime: number;
  fiveDayRate: number;
  treasuryBalance: number;
  stakingAPY: number;
  stakingRebase: number;
  networkID: number;
  nextRebase: number;
  totalSupply: number;
  rfv: number;
  runway: number;
  uccPrice: number;
  uccPurchaseLimit: number;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);

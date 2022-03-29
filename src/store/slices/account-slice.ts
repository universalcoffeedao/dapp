import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { CalmTokenContract, pCalmTokenContract, sCalmTokenContract, StableReserveContract, UCCTokenContract, wsCalmContract } from "../../calmAbi/";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { IToken } from "../../helpers/tokens";

interface IGetBalances {
  address: string;
  networkID: Networks;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
  balances: {
    scalm: string;
    calm: string;
    wscalm: string;
    dai: string;
    salesProceedDai: string;
  };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
  const addresses = getAddresses(networkID);

  const sCalmContract = new ethers.Contract(addresses.SCALM_ADDRESS, sCalmTokenContract, provider);
  const sCalmBalance = await sCalmContract.balanceOf(address);
  const calmContract = new ethers.Contract(addresses.CALM_ADDRESS, CalmTokenContract, provider);
  const calmBalance = await calmContract.balanceOf(address);
  const wsCALMContract = new ethers.Contract(addresses.WSCALM_ADDRESS, wsCalmContract, provider);
  const wsCALMBalance = await wsCALMContract.balanceOf(address);
  const daiContract = new ethers.Contract(addresses.MATIC_DAI_ADDRESS, StableReserveContract, provider);
  const daiBalance = await daiContract.balanceOf(address);

  const salesProceedDaiBalance = await daiContract.balanceOf("0x24270C9f39dDfDFBB6B137D969E1770c7F9fbD03");

  return {
    balances: {
      scalm: ethers.utils.formatUnits(sCalmBalance, "gwei"),
      calm: ethers.utils.formatUnits(calmBalance, "gwei"),
      wscalm: ethers.utils.formatEther(wsCALMBalance),
      dai: ethers.utils.formatUnits(daiBalance, "gwei"),
      salesProceedDai: ethers.utils.formatUnits(salesProceedDaiBalance, "gwei"),
    },
  };
});

interface ILoadAccountDetails {
  address: string;
  networkID: Networks;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
  balances: {
    calm: string;
    scalm: string;
    wscalm: string;
    dai: string;
    pcalm: string;
    ucc: string;
    salesProceedDai: string;
  };
  staking: {
    calm: number;
    scalm: number;
  };
  wrapping: {
    scalm: number;
  };
  pCalm: {
    dai: number;
  };
  ucc: {
    dai: number;
  };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
  let calmBalance = 0;
  let scalmBalance = 0;

  let wscalmBalance = 0;
  let daiBalance = 0;
  let scalmWscalmAllowance = 0;

  let stakeAllowance = 0;
  let unstakeAllowance = 0;

  let daiAllowance = 0;
  let pcalmBalance = 0;

  let uccDaiAllowance = 0;
  let uccBalance = 0;
  let salesProceedDaiBalance = 0;

  const addresses = getAddresses(networkID);

  if (addresses.CALM_ADDRESS) {
    const calmContract = new ethers.Contract(addresses.CALM_ADDRESS, CalmTokenContract, provider);
    calmBalance = await calmContract.balanceOf(address);
    stakeAllowance = await calmContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
  }

  if (addresses.SCALM_ADDRESS) {
    const scalmContract = new ethers.Contract(addresses.SCALM_ADDRESS, sCalmTokenContract, provider);
    scalmBalance = await scalmContract.balanceOf(address);
    unstakeAllowance = await scalmContract.allowance(address, addresses.STAKING_ADDRESS);

    if (addresses.WSCALM_ADDRESS) {
      scalmWscalmAllowance = await scalmContract.allowance(address, addresses.WSCALM_ADDRESS);
    }
  }

  if (addresses.WSCALM_ADDRESS) {
    const wscalmContract = new ethers.Contract(addresses.WSCALM_ADDRESS, wsCalmContract, provider);
    wscalmBalance = await wscalmContract.balanceOf(address);
  }

  if (addresses.MATIC_DAI_ADDRESS) {
    const daiContract = new ethers.Contract(addresses.MATIC_DAI_ADDRESS, wsCalmContract, provider);
    daiBalance = await daiContract.balanceOf(address);
  }

  if (addresses.PCALM_ADDRESS) {
    const daiContract = new ethers.Contract(addresses.MATIC_DAI_ADDRESS, wsCalmContract, provider);
    daiAllowance = await daiContract.allowance(address, addresses.PCALM_SALES_ADDRESS);

    const pCalmContract = new ethers.Contract(addresses.PCALM_ADDRESS, pCalmTokenContract, provider);

    pcalmBalance = await pCalmContract.balanceOf(address);
    salesProceedDaiBalance = await daiContract.balanceOf("0x24270C9f39dDfDFBB6B137D969E1770c7F9fbD03");
  }

  if (addresses.UCC_ADDRESS) {
    const daiContract2 = new ethers.Contract(addresses.MATIC_DAI_ADDRESS, wsCalmContract, provider);
    uccDaiAllowance = await daiContract2.allowance(address, addresses.UCC_SALES_ADDRESS);
    const uccContract = new ethers.Contract(addresses.UCC_ADDRESS, UCCTokenContract, provider);

    uccBalance = await uccContract.balanceOf(address);
  }

  return {
    balances: {
      scalm: ethers.utils.formatUnits(scalmBalance, "gwei"),
      calm: ethers.utils.formatUnits(calmBalance, "gwei"),
      wscalm: ethers.utils.formatEther(wscalmBalance),
      dai: ethers.utils.formatUnits(daiBalance, "gwei"),
      pcalm: ethers.utils.formatUnits(pcalmBalance, "ether"),
      ucc: ethers.utils.formatUnits(uccBalance, "gwei"),
      salesProceedDai: ethers.utils.formatUnits(salesProceedDaiBalance, "gwei"),
    },
    staking: {
      calm: Number(stakeAllowance),
      scalm: Number(unstakeAllowance),
    },
    wrapping: {
      scalm: Number(scalmWscalmAllowance),
    },
    pCalm: {
      dai: Number(daiAllowance),
    },
    ucc: {
      dai: Number(uccDaiAllowance),
    },
  };
});

interface ICalcUserBondDetails {
  address: string;
  bond: Bond;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  networkID: Networks;
}

export interface IUserBondDetails {
  allowance: number;
  balance: number;
  avaxBalance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: number; //Payout formatted in gwei.
}

export const calculateUserBondDetails = createAsyncThunk("account/calculateUserBondDetails", async ({ address, bond, networkID, provider }: ICalcUserBondDetails) => {
  if (!address) {
    return new Promise<any>(resevle => {
      resevle({
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: 0,
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
        avaxBalance: 0,
      });
    });
  }

  const bondContract = bond.getContractForBond(networkID, provider);
  const reserveContract = bond.getContractForReserve(networkID, provider);

  let interestDue, pendingPayout, bondMaturationBlock;

  const bondDetails = await bondContract.bondInfo(address);
  interestDue = bondDetails.payout / Math.pow(10, 9);
  bondMaturationBlock = Number(bondDetails.vesting) + Number(bondDetails.lastTime);
  pendingPayout = await bondContract.pendingPayoutFor(address);

  let allowance,
    balance = "0";

  allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
  balance = await reserveContract.balanceOf(address);
  const balanceVal = ethers.utils.formatEther(balance);

  const avaxBalance = await provider.getSigner().getBalance();
  const avaxVal = ethers.utils.formatEther(avaxBalance);

  const pendingPayoutVal = ethers.utils.formatUnits(pendingPayout, "gwei");

  return {
    bond: bond.name,
    displayName: bond.displayName,
    bondIconSvg: bond.bondIconSvg,
    isLP: bond.isLP,
    allowance: Number(allowance),
    balance: Number(balanceVal),
    avaxBalance: Number(avaxVal),
    interestDue,
    bondMaturationBlock,
    pendingPayout: Number(pendingPayoutVal),
  };
});

interface ICalcUserTokenDetails {
  address: string;
  token: IToken;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  networkID: Networks;
}

export interface IUserTokenDetails {
  allowance: number;
  balance: number;
  isAvax?: boolean;
}

export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
  if (!address) {
    return new Promise<any>(resevle => {
      resevle({
        token: "",
        address: "",
        img: "",
        allowance: 0,
        balance: 0,
      });
    });
  }

  // if (token.isAvax) {
  //     const avaxBalance = await provider.getSigner().getBalance();
  //     const avaxVal = ethers.utils.formatEther(avaxBalance);

  //     return {
  //         token: token.name,
  //         tokenIcon: token.img,
  //         balance: Number(avaxVal),
  //         isAvax: true,
  //     };
  // }

  const addresses = getAddresses(networkID);
  const tokenContract = new ethers.Contract(token.address, StableReserveContract, provider);

  let allowance,
    balance = "0";

  // allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
  balance = await tokenContract.balanceOf(address);

  const balanceVal = Number(balance) / Math.pow(10, token.decimals);

  return {
    token: token.name,
    address: token.address,
    img: token.img,
    allowance: Number(allowance),
    balance: Number(balanceVal),
  };
});

export interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    scalm: string;
    calm: string;
    wscalm: string;
    dai: string;
    pcalm: string;
    ucc: string;
    salesProceedDai: string;
  };
  loading: boolean;
  staking: {
    calm: number;
    scalm: number;
  };
  wrapping: {
    scalm: number;
  };
  tokens: { [key: string]: IUserTokenDetails };
  pCalm: {
    dai: number;
  };
  ucc: {
    dai: number;
  };
}

const initialState: IAccountSlice = {
  loading: true,
  bonds: {},
  balances: { scalm: "", calm: "", wscalm: "", dai: "", pcalm: "", ucc: "", salesProceedDai: "" },
  staking: { calm: 0, scalm: 0 },
  wrapping: { scalm: 0 },
  tokens: {},
  pCalm: {
    dai: 0,
  },
  ucc: {
    dai: 0,
  },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserTokenDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const token = action.payload.token;
        state.tokens[token] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);

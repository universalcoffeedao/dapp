import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingHelperContract, CalmTokenContract, pCalmTokenContract, sCalmTokenContract, StakingContract, StableReserveContract } from "../../calmAbi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";

interface IChangeApproval {
  token: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: Networks;
}

export const changeApproval = createAsyncThunk("presale/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
  if (!provider) {
    dispatch(warning({ text: messages.please_connect_wallet }));
    return;
  }
  const addresses = getAddresses(networkID);

  const signer = provider.getSigner();
  const calmContract = new ethers.Contract(addresses.CALM_ADDRESS, CalmTokenContract, signer);
  const sCalmContract = new ethers.Contract(addresses.SCALM_ADDRESS, sCalmTokenContract, signer);
  const daiContract = new ethers.Contract(addresses.MATIC_DAI_ADDRESS, StableReserveContract, signer);
  const pCalmContract = new ethers.Contract(addresses.PCALM_ADDRESS, pCalmTokenContract, signer);

  let approveTx;
  try {
    const gasPrice = await getGasPrice(provider);

    if (token === "ucc") {
      approveTx = await daiContract.approve(addresses.UCC_SALES_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
    }

    const text = "Approve " + (token === "ucc" && "PreSale");
    const pendingTxnType = token === "ucc" ? "approve_staking" : "approve_unstaking";

    dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
    await approveTx.wait();
    dispatch(success({ text: messages.tx_successfully_send_approve }));
  } catch (err: any) {
    return metamaskErrorWrap(err, dispatch);
  } finally {
    if (approveTx) {
      dispatch(clearPendingTxn(approveTx.hash));
    }
  }

  await sleep(2);

  const stakeAllowance = await calmContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
  const unstakeAllowance = await sCalmContract.allowance(address, addresses.STAKING_ADDRESS);

  const uccAllowance = await daiContract.allowance(address, addresses.UCC_SALES_ADDRESS);

  return dispatch(
    fetchAccountSuccess({
      UCC: {
        ucc: Number(uccAllowance),
      },
    }),
  );
});

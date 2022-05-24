import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { CalmTokenContract, sCalmTokenContract, UCCMultisendContract, StableReserveContract, UCCTokenContract } from "../../calmAbi";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getAllowances, getBalances } from "./account-slice";
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

export const changeApproval = createAsyncThunk("multisend/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
  if (!provider) {
    dispatch(warning({ text: messages.please_connect_wallet }));
    return;
  }
  const addresses = getAddresses(networkID);

  const signer = provider.getSigner();

  const uccContract = new ethers.Contract(addresses.UCC_ADDRESS, UCCTokenContract, signer);

  console.log(uccContract);
  let approveTx;

  try {
    const gasPrice = await getGasPrice(provider);

    if (token === "ucc") {
      approveTx = await uccContract.approve(addresses.UCC_MULTISEND_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
    }
    const text = "Approve " + (token === "ucc" && "Giving Out");
    const pendingTxnType = token === "ucc" ? "approve_givingout" : "approve_unstaking";
    dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
    await approveTx.wait().then(() => {
      dispatch(success({ text: messages.tx_successfully_send_approve }));
    });
  } catch (err: any) {
    return metamaskErrorWrap(err, dispatch);
  } finally {
    if (approveTx) {
      dispatch(clearPendingTxn(approveTx.hash));
    }
  }

  await sleep(10);

  const multisendUccAllowance = await uccContract.allowance(address, addresses.UCC_MULTISEND_ADDRESS);

  dispatch(
    fetchAccountSuccess({
      multisend: {
        ucc: Number(multisendUccAllowance),
      },
    }),
  );
  dispatch(getAllowances({ address, networkID, provider }));
  dispatch(info({ text: messages.your_balance_updated }));
  return;
});

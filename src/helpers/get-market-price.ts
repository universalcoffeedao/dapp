import { ethers } from "ethers";
import { LpReserveContract } from "../calmAbi";
import { daiCalm } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
  const daiCalmAddress = daiCalm.getAddressForReserve(networkID);

  const pairContract = new ethers.Contract(daiCalmAddress, LpReserveContract, provider);

  const reserves = await pairContract.getReserves();

  const marketPrice = reserves[1] / reserves[0];
  return marketPrice;
}

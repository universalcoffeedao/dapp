import { Networks } from "../../constants/blockchain";

export enum BondType {
  StableAsset,
  LP,
}

export interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

export interface NetworkAddresses {
  // [Networks.RINKEBY]: BondAddresses;
  [Networks.POLYGON]: BondAddresses;
  // [Networks.BSC_TESTNET]: BondAddresses;
  // [Networks.BSC_MAINNET]: BondAddresses;
}

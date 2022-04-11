import { Networks } from "./blockchain";

const RINKEBY_TESTNET = {
  DAO_ADDRESS: "0x0c861D609E6B93264acf3A23DCF6e565B094f1d4",
  CALM_ADDRESS: "0x8E97A36b3Be374521e64B1a34F57eDFf2858197c",
  RINKEBY_DAI_ADDRESS: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
  TREASURY_ADDRESS: "0xF7f2D108255A2c1b192CF8D980Aa385EF32d0de0",
  CALM_BONDING_CALC_ADDRESS: "0x32A2b5129456879e47020855C7ff350F5897fba6",
  STAKING_ADDRESS: "0x8fba5869cB616521E4326D6214C1610B3Dab3d35",
  SCALM_ADDRESS: "0x965C5680D012dcB76540a6A98578F2b89FB00966",
  STAKING_HELPER_ADDRESS: "0xd5db5C85F85e4C07134CD5F8D7bf4402e2fcE1e4",
  WSCALM_ADDRESS: "0xCDD3579DccCf91099E50684800F408FB41a50f7d",
  PCALM_ADDRESS: "0x51f5F83333CCF3cFe5eDc4cAA9461f25c6Bf2F9C",
  PCALM_SALES_ADDRESS: "0x768EE4CF0bEcF3b0C78213cB9B99B13FD01AC655",
};

export const POLYGON_MAINNET = {
  UCC_ADDRESS: "0x35C3c8096CDe3c13a565b68d17b9Bf1f9836B9eB",
  UCC_SALES_ADDRESS: "0x0Cf3Cb07F445e94709afe504235C6ae00D589503",
  DAO_ADDRESS: "0xdD6fe4D0B4BcEeD43210797f5C098D1ed0297F2d",
  CALM_ADDRESS: "0x6874C13aC1b8F2f4FC1a69E38c390CE022396A4e",
  MATIC_DAI_ADDRESS: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  TREASURY_ADDRESS: "0x69F756f317cAEecBa4537AFA75e1966257664cF1",
  CALM_BONDING_CALC_ADDRESS: "0x60A4aAAeD1DEc295EC149c1c541EC5128B261F08",
  STAKING_ADDRESS: "0x823b7790794a320a40F51C1f1B6b0Dbd0d0a0017",
  SCALM_ADDRESS: "0xfc9E8561A76041363f32C2da517c633Cfe99833f",
  STAKING_HELPER_ADDRESS: "0xF78B4CE9932B418EE450f08c9D81615b738904e3",
  WSCALM_ADDRESS: "0xC32cFB95b8f25705D3a3064663bE7B056729413d",
  PCALM_ADDRESS: "0xf62Ef547743E7544af63Cd723a9a7d2F22e3eDe2",
  PCALM_SALES_ADDRESS: "0x6528Bda40234eDFfE110230A55CbD0C0e70bC949",
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.POLYGON) return POLYGON_MAINNET;

  throw Error("Network don't support");
};

import DaiIcon from "../assets/tokens/DAI.e.png";
import CalmIcon from "../assets/logo.png";

export interface IToken {
  name: string;
  address: string;
  img: string;
  isAvax?: boolean;
  decimals: number;
}

// const bnb: IToken = {
//     name: "BNB",
//     address: "0x264c1383EA520f73dd837F915ef3a732e204a493",
//     img: BnbIcon,
//     decimals: 18,
// };

// const dai: IToken = {
//     name: "DAI.e",
//     address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
//     img: DaiEIcon,
//     decimals: 18,
// };

export const polygonDai: IToken = {
  name: "PolygonDai",
  address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  img: DaiIcon,
  decimals: 18,
};

const calm: IToken = {
  name: "CALM",
  address: "0x6874C13aC1b8F2f4FC1a69E38c390CE022396A4e",
  img: CalmIcon,
  decimals: 9,
};

// const usdc: IToken = {
//     name: "USDC.e",
//     address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
//     img: UsdcEIcon,
//     decimals: 6,
// };

// const usdt: IToken = {
//     name: "USDT.e",
//     address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
//     img: UsdtEIcon,
//     decimals: 6,
// };

export default [polygonDai, calm];

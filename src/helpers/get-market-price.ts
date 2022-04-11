import { ethers } from "ethers";

import { Networks } from "../constants/blockchain";

import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { abi as FACTORY_ABI } from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
  const factoryV3 = new ethers.Contract("0x1F98431c8aD98523631AE4a59f267346ea31F984", FACTORY_ABI, provider);
  const poolAddress = await factoryV3.getPool("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "0x35C3c8096CDe3c13a565b68d17b9Bf1f9836B9eB", 3000);

  const pool1 = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);
  const poolBalance = await pool1.slot0();
  const sqrtPriceX96 = poolBalance[0];
  const marketPrice: number = (sqrtPriceX96 * sqrtPriceX96 * 10 ** 9) / 10 ** 18 / 2 ** 192;
  return marketPrice;
}

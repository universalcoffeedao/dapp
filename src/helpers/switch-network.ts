import { Networks, NetworkHexadecimal } from "../constants/blockchain";

const switchRequest = () => {
  return window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: NetworkHexadecimal.POLYGON }],
  });
};

const addChainRequest = () => {
  return window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: NetworkHexadecimal.POLYGON,
        chainName: "Polygon Mainnet",
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
      },
    ],
  });
};

export const switchNetwork = async () => {
  if (window.ethereum) {
    try {
      await switchRequest();
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await addChainRequest();
          await switchRequest();
        } catch (addError) {
          console.log(error);
        }
      }
      console.log(error);
    }
  }
};

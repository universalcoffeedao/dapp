export const getMainnetURI = (): string => {
  // This is RPC URL
  // s"https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
  return `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`;
};

const Moralis = require("moralis/node");

const serverUrl = "https://zn6jdb0pgvlp.usemoralis.com:2053/server";
const appId = "vjPjs8AX0jdKgkaGvvpgINYWRUUyECpBLEgnjmFO";

const web3API = async () => {
  await Moralis.start({ serverUrl, appId });

  const price = await Moralis.Web3API.token.getTokenPrice({
    address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    chain: "bsc",
  });
  console.log(price);
};

web3API();

export {};

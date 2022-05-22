// @ts-ignore

import { VercelRequest, VercelResponse } from "@vercel/node";

import * as dotenv from "dotenv";
import * as express from "express";
import { strHasLength } from "../src/utils/strings";

const Moralis = require("moralis/node");

const serverUrl = "https://zn6jdb0pgvlp.usemoralis.com:2053/server";
const appId = "vjPjs8AX0jdKgkaGvvpgINYWRUUyECpBLEgnjmFO";

dotenv.config({ path: `${__dirname}/../.env` });

const router = express.Router();

router.get("/api/hello", (req: VercelRequest, res: VercelResponse, next) => {
  res.json("World");
});

router.post("/api/get-nft-holders", async (req: VercelRequest, res: VercelResponse, next) => {
  try {
    await Moralis.start({ serverUrl, appId });

    const nftContractAddress = req.body.nftAddress;

    console.log("NFT Address: ", nftContractAddress);

    let cursor: any = null;

    let options = {
      address: nftContractAddress,
      chain: "eth",
      cursor,
    };

    let nftOwners = await Moralis.Web3API.token.getNFTOwners(options);

    cursor = nftOwners.cursor;
    let nftOwnersAddresses: string[] = nftOwners.result.map(res => res.owner_of);

    while (strHasLength(cursor)) {
      console.log("cursor: ", cursor);
      options = {
        address: nftContractAddress,
        chain: "eth",
        cursor,
      };
      nftOwners = await Moralis.Web3API.token.getNFTOwners(options);
      cursor = nftOwners?.cursor ?? "";

      const singlePageOwnersAddress = nftOwners.result.map(res => res.owner_of);
      nftOwnersAddresses = nftOwnersAddresses.concat(singlePageOwnersAddress);
    }

    res.send({ nftOwnersAddresses });
  } catch (e) {
    res.status(500).send({
      error: "Error retrieving your NFT holder addresses",
    });
  }
});

export default router;

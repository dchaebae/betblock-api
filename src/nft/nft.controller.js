import { Router } from "express";
import {
  invokeDallE,
  addImageToIPFS
} from './nft.service.js'
// import { testImg } from './testimage.js'
import dotenv from 'dotenv'

dotenv.config();

const nftController = Router();

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  // prevent anyone from just calling our very public API :)
  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    res.status(401).json({error: 'Need API Key'});
    return;
  }

  next();
}

// invoke DALLE to make NFT image
nftController.get("/generateImage", apiKeyMiddleware, async (req, res, next) => {
  const words = req.query.words;
  const tokenId = req.query?.tokenId;

  let output = await invokeDallE(words)
  // let output = testImg
  let binaryData = Buffer.from(output, 'base64');
  const imageCid = await addImageToIPFS(binaryData).catch((error) => {
    res.status(500).json({error: error.message});
  })

  await addMetadataToIPFS(imageCid, tokenId).then((response) => {
    res.send({words: words, cid: response});
  }).catch(error => {
    res.status(500).json({error: error.message})
  })
});

// validate the key, primarily for testing purposes
nftController.get("/validateKey", apiKeyMiddleware, async (req, res, next) => {
  res.send({message: 'This key is valid!'})
});

export default nftController;

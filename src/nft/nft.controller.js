import { Router } from "express";
import {
  invokeDallE,
  addImageToIPFS
} from './nft.service.js'
import { testImg } from './testimage.js'
import dotenv from 'dotenv'

dotenv.config();

const nftController = Router();

nftController.get("/generateImage", async (req, res, next) => {
  const words = req.query.words;
  let output = await invokeDallE(words)
  // let output = testImg
  let binaryData = Buffer.from(output, 'base64');
  await addImageToIPFS(binaryData).then((response) => {
    res.send({words: words, environment: process.env.NODE_ENV, data: response});
  }).catch((error) => {
    res.status(500).send(error.message);  
  })

  next()
});

export default nftController;

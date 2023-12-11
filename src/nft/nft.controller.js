import { Router } from "express";
import {
  invokeDallE,
  addImageToIPFS,
  addMetadataToIPFS,
  mintNFT
} from './nft.service.js'
// import { testImg } from './testimage.js'
import {CID} from 'multiformats/cid'
import dotenv from 'dotenv'

dotenv.config();

const nftController = Router();

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  // prevent anyone from just calling our very public API :)
  // if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
  //   res.status(401).json({error: 'Need API Key'});
  //   return;
  // }

  next();
}

// invoke DALLE to make NFT image
nftController.get("/generateImage", apiKeyMiddleware, async (req, res, next) => {
  const words = req.query.words;
  const tokenId = req.query?.tokenId;

  // let imageCID = CID.parse('QmQ8kVmrQgSy9VY7jfNqHwrkdbHeqZUQg6EUGFGSJ6eLEQ')
  // let sampleOutput = {
  //     // cid: 'bafybeifefa7kwlpv33s3egvxbqhde3ece3dz74cpaqgckf3j6fledm7zqa',
  //     // name: 'betblock bio 0',
  //     // description: 'betblock bio - newbie level: excited puppy jumping up and down',
  //     image: 'ipfs://' + imageCID.toV1().bytes()
  //   };
  // let sampleOutput = {
  //   image: 'ipfs://bafybeifefa7kwlpv33s3egvxbqhde3ece3dz74cpaqgckf3j6fledm7zqa'
  // }  
  // res.end(JSON.stringify(sampleOutput))

  let output = await invokeDallE(words).catch((error) => {
    res.status(400).json({error: error.message})
  })

  // let output = testImg
  let binaryData = Buffer.from(output, 'base64');
  const imageCid = await addImageToIPFS(binaryData).catch((error) => {
    res.status(500).json({error: error.message});
  })

  const metadataCID = await addMetadataToIPFS(imageCid, tokenId, words).catch(error => {
    res.status(500).json({error: error.message})
  })
  await mintNFT(metadataCID, tokenId)
});

// validate the key, primarily for testing purposes
nftController.get("/validateKey", apiKeyMiddleware, async (req, res, next) => {
  res.send({message: 'This key is valid!'})
});

export default nftController;

import OpenAI from 'openai'
import dotenv from 'dotenv'
import {create} from 'ipfs-http-client'
import fs from 'fs'
import {mintAddress, mintABI} from './contractDetails.js'
import {publicFujiClient, internalFujiClient} from './ViemClients.js'
import {CID} from 'multiformats/cid'

dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
const ipfs = create({url: 'http://localhost:5001/api/v0'})
var env = process.env.NODE_ENV || 'development'

export const invokeDallE = async (words) => {
	const image = await openai.images.generate({
		//model: env === 'production' ? 'dall-e-3' : 'dall-e-2',
		model: 'dall-e-3',
		prompt: words,
		n: 1,
		response_format: 'b64_json',
		//size: env === 'production' ? '1024x1024' : '256x256'
		size: '1024x1024'
	});

	return image.data[0].b64_json
}

// add generated image to IPFS
export const addImageToIPFS = async (binaryData) => {
	try {
		const result = await ipfs.add(binaryData);
		const ipfsHash = result.cid.toString();
		
		const cid = CID.parse(ipfsHash)
		console.log('Image added to IPFS. IPFS Hash: ', cid.toV1().toString());

		return cid.toV1().toString();
	}
	catch (error) {
		console.error('Error adding image to IPFS: ', error.message);
		throw error;
	}
	return
}

// add metadata to IPFS
export const addMetadataToIPFS = async (cid, tokenId, words) => {
	try {
		let timestamp = parseInt((+new Date) / 1000)
		let name = 'betblock bio ' + tokenId;
		let description = 'betblock bio - newbie level: ' + words
		let metadata = {
			name: name,
			external_url: 'https://betblock.fi',
			image: 'ipfs://' + cid,
			description: description,
			createdAt: timestamp,
		}
		const result = await ipfs.add(JSON.stringify(metadata))
		const ipfsHash = result.cid.toString();
		const cidObject = CID.parse(ipfsHash)
		console.log('Metadata to image added to IPFS. IPFS Hash: ', cidObject.toV1().toString())
		return cidObject.toV1().toString();
	}
	catch (error) {
		console.error('Error adding metadata to IPFS: ', error.message)
		throw error
	}
	return
}

// mint NFT given token URI, tokenId
export const mintNFT = async (uriCID, tokenId) => {
	let uri = 'ifps://' + uriCID;
	try {
		await publicFujiClient.simulateContract({
			address: mintAddress,
			abi: mintABI,
			functionName: 'mintBioToken',
			args: [uri, parseInt(tokenId)]
		}).then((res) => {
			internalFujiClient.writeContract(res.request);
		}).catch((err) => {});
	}
	catch (error) {
		console.error('Error adding metadata to IPFS: ', error.message)
		throw error
	}
	return
}
import OpenAI from 'openai'
import dotenv from 'dotenv'
import {create} from 'ipfs-http-client'
import fs from 'fs'

dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
const ipfs = create({url: 'http://localhost:5001/api/v0'})
var env = process.env.NODE_ENV || 'development'

export const invokeDallE = async (words) => {
	const image = await openai.images.generate({
		//model: env === 'production' ? 'dall-e-3' : 'dall-e-2',
		model: 'dall-e-2',
		prompt: words,
		n: 1,
		response_format: 'b64_json',
		//size: env === 'production' ? '1024x1024' : '256x256'
		size: '256x256'
	});

	return image.data[0].b64_json
}

// add generated image to IPFS
export const addImageToIPFS = async (binaryData) => {
	try {
		const result = await ipfs.add(binaryData);
		const ipfsHash = result.cid.toString();
		console.log('Image added to IPFS. IPFS Hash: ', ipfsHash);
		return ipfsHash;
	}
	catch (error) {
		console.error('Error adding image to IPFS: ', error.message);
		throw error;
	}
	return
}

// add metadata to IPFS
export const addMetadataToIPFS = async (cid, tokenId) => {
	try {
		let timestamp = parseInt((+new Date) / 1000)
		let metadata = {
			name: 'betblock bio ' + tokenId,
			external_url: 'https://betblock.fi',
			image: 'ipfs://' + cid,
			description: 'betblock bio - newbie level',
			createdAt: timestamp,
			updatedAt: timestamp
		}
		const result = await ipfs.add(JSON.stringify(metadata))
		const ipfsHash = result.cid.toString();
		console.log('Metadata to image added to IPFS. IPFS Hash: ', ipfsHash)
		return ipfsHash;
	}
	catch (error) {
		console.error('Error adding metadata to IPFS: ', error.message)
		throw error
	}
	return
}
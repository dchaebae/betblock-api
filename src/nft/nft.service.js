import OpenAI from 'openai'
import dotenv from 'dotenv'
import {create} from 'ipfs-http-client'
import fs from 'fs'

dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
const ipfs = create('http://localhost:5001')
var env = process.env.NODE_ENV || 'development'

export const invokeDallE = async (words) => {
	const image = await openai.images.generate({
		model: env === 'production' ? 'dall-e-3' : 'dall-e-2',
		prompt: words,
		n: 1,
		response_format: 'b64_json',
		size: env === 'production' ? '1024x1024' : '256x256'
	});

	return image.data[0].b64_json
}

export const addImageToIPFS = async (binaryData) => {

	try {
		const response = await ipfs.add(binaryData);
		const ipfsHash = result.cid.toString();
		console.log('Image added to IPFS. IPFS Hash: ', ipfsHash);
		return ipfsHash;
	}
	catch (err) {
		console.error('Error adding image to IPFS: ', error.message);
		throw error;
	}
	return
}
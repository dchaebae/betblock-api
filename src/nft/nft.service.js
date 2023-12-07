import OpenAI from 'openai'
import dotenv from 'dotenv'
import {create} from 'ipfs-http-client'
import fs from 'fs'
// import FormData from 'form-data'
// import axios from 'axios'

dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
const ipfs = create({url: 'http://localhost:5001/api/v0'})
var env = process.env.NODE_ENV || 'development'
//var JWT = process.env.PINATA_API_KEY

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
// 	const formData = new FormData();
//   formData.append('file', binaryData, 'image.png')
//   
//   const pinataMetadata = JSON.stringify({
//     name: 'Generated Image',
//   });
//   formData.append('pinataMetadata', pinataMetadata);
//   
//   const pinataOptions = JSON.stringify({
//     cidVersion: 0,
//   })
//   formData.append('pinataOptions', pinataOptions);
// 
//   try{
//     const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
//       maxBodyLength: "Infinity",
//       headers: {
//         'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//         'Authorization': `Bearer ${JWT}`
//       }
//     });
//     console.log(res.data);
//   } catch (error) {
//     console.log(error);
//   }
	try {
		const result = await ipfs.add(binaryData);
		const ipfsHash = result.cid.toString();
		console.log('Image added to IPFS. IPFS Hash: ', ipfsHash);
		await ipfs.pin.add(ipfsHash); // explicitly pin with my ipfs
		return '';
	}
	catch (error) {
		console.error('Error adding image to IPFS: ', error.message);
		throw error;
	}
	return
}

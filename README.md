# betblock API
Welcome to the API! Here, we write the logic to receive requests from smart contracts via Chainlink Functions and mint AI-generated NFTs. This is a NodeJS server that wraps OpenAI's DALL-E. The EC2 instance that this server is deployed on has an IPFS server running, which allows our API to add IPFS files and create a CID (v1) that the NFT smart contract can reference.

The mint logic: the React application will invoke smart contract function to mint their unique NFT. This sends a ping to our API via Chainlink Functions, which sends the word tokens & tokenId. OpenAI API is invoked to generate the image and added to IPFS. The resulting CID is then used to mint the NFT.

import {createPublicClient, http, createWalletClient, custom} from 'viem'
import { avalancheFuji, mainnet } from 'viem/chains'
import dotenv from 'dotenv'

dotenv.config();

export const publicMainnetClient = createPublicClient({
	chain: mainnet,
	transport: http(),
})

export const publicFujiClient = createPublicClient({
	chain: avalancheFuji,
	transport: http()
});

export const walletFujiClient = createWalletClient({
	chain: avalancheFuji,
	transport: custom(window.ethereum)
})

export. const internalFujiClient = createWalletClient({
	account: process.env.INTERNAL_WALLET_PRIVATE_KEY,
	chain: avalancheFuji,
	transport: http()
})
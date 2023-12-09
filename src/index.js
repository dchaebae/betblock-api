import express from "express";
import nftController from "./nft/nft.controller.js";
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Betblock API!");
});

app.listen(port, () => {
  console.log(`[server]: ⚡️ Server is running at http://localhost:${port}`);
});

// Setup routes
app.use(nftController);

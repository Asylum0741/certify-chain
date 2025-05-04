const { ethers } = require("ethers");
const contractABI = require("../abi/CertificateNFT.json").abi;

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  signer
);

module.exports = contract;

const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const Certificate = require("../models/certificate");
const abi = require("../abi/CertificateNFT.json");

const provider = new ethers.JsonRpcProvider(process.env.NETWORK_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi.abi,
  wallet
);

router.post("/", async (req, res) => {
  const { issuerName, certificateId, studentId, studentName } = req.body;

  try {
    const tx = await contract.mintCertificate(
      issuerName,
      certificateId,
      studentId,
      studentName
    );
    const receipt = await tx.wait();

    const event = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e) => e && e.name === "CertificateMinted");

    if (!event) return res.status(500).json({ error: "No event found" });

    const {
      certificateHash,
      issuer,
      issuerName,
      certificateId,
      studentId,
      studentName,
      timestamp,
    } = event.args;

    const newCert = new Certificate({
      certificateHash,
      issuer,
      issuerName,
      certificateId,
      studentId,
      studentName,
      timestamp: Number(timestamp),
    });

    await newCert.save();
    res.status(200).json({
      message: "✅ Certificate minted",
      certificateHash,
      timestamp: Number(timestamp),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Minting failed" });
  }
});

module.exports = router;

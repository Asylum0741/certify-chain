const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const abi = require("../abi/CertificateNFT.json");

const provider = new ethers.JsonRpcProvider(process.env.NETWORK_URL);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi.abi,
  provider
);

router.post("/", async (req, res) => {
  const { certificateHash } = req.body;

  try {
    const cert = await contract.verifyCertificate(certificateHash);
    res.status(200).json({
      message: "✅ Certificate verified",
      issuer: cert.issuer,
      issuerName: cert.issuerName,
      certificateId: cert.certificateId,
      studentId: cert.studentId,
      studentName: cert.studentName,
      timestamp: Number(cert.timestamp),
    });
  } catch (err) {
    console.error(err);
    res
      .status(404)
      .json({ message: "❌ Certificate not found or invalid hash" });
  }
});

module.exports = router;

// --- VERIFY API ---
router.get("/verify/:certHash", async (req, res) => {
  const { certHash } = req.params;

  try {
    const certData = await contract.verifyCertificate(certHash);

    if (!certData || certData.timestamp.toNumber() === 0) {
      return res.status(404).json({ message: "❌ Certificate not found" });
    }

    res.status(200).json({
      message: "✅ Certificate Verified",
      data: {
        issuer: certData.issuer,
        issuerName: certData.issuerName,
        certificateId: certData.certificateId,
        studentId: certData.studentId,
        studentName: certData.studentName,
        timestamp: certData.timestamp.toNumber(),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Error verifying", error: err.message });
  }
});

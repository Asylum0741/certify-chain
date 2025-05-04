const contract = require("../utils/web3");
const Certificate = require("../models/certificate");

exports.mintCertificate = async (req, res) => {
  try {
    const { issuerName, certificateId, studentId, studentName } = req.body;

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

    if (!event) return res.status(500).json({ message: "❌ Event not found" });

    const {
      certificateHash,
      issuer,
      issuerName: iName,
      certificateId: cId,
      studentId: sId,
      studentName: sName,
      timestamp,
    } = event.args;

    await Certificate.create({
      certificateHash,
      issuer,
      issuerName: iName,
      certificateId: cId,
      studentId: sId,
      studentName: sName,
      timestamp: Number(timestamp),
    });

    res.status(200).json({
      message: "✅ Certificate minted",
      certificateHash,
    });
  } catch (err) {
    console.error("Mint error:", err);
    res.status(500).json({ message: "Minting failed", error: err.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateHash } = req.body;

    const result = await contract.verifyCertificate(certificateHash);
    const [
      issuer,
      issuerName,
      certificateId,
      studentId,
      studentName,
      timestamp,
    ] = result;

    if (Number(timestamp) === 0) {
      return res.status(404).json({ message: "❌ Certificate not found" });
    }

    res.status(200).json({
      message: "✅ Certificate is valid",
      certificate: {
        certificateHash,
        issuer,
        issuerName,
        certificateId,
        studentId,
        studentName,
        timestamp: Number(timestamp),
      },
    });
  } catch (err) {
    console.error("Verification error:", err);
    res
      .status(500)
      .json({ message: "Verification failed", error: err.message });
  }
};

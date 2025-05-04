const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentFile = path.join(
    __dirname,
    "..",
    "ignition",
    "deployments",
    "chain-31337",
    "deployed_addresses.json"
  );

  if (!fs.existsSync(deploymentFile)) {
    throw new Error(
      "❌ Deployment file not found. Make sure the contract is deployed."
    );
  }

  const deployedAddresses = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress =
    deployedAddresses["CertificateNFTModule#CertificateNFT"];
  console.log("✅ Using deployed contract at:", contractAddress);

  const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
  const contract = await CertificateNFT.attach(contractAddress);

  const certificateHash =
    "0xb5e84741e90b28db80a5100bacef70caa2745e6536bf7be90026a8bd3cbec";
  console.log("🔍 Verifying certificate for hash:", certificateHash);

  try {
    const cert = await contract.verifyCertificate(certificateHash);

    const [
      issuer,
      issuerName,
      certificateId,
      studentId,
      studentName,
      timestampBigInt,
    ] = cert;
    const timestamp = Number(timestampBigInt); // 🔧 Convert BigInt to Number

    if (!timestamp || timestamp === 0) {
      console.log("❌ Certificate not found.");
      return;
    }

    console.log("✅ Certificate Found!");
    console.log("🏢 Issuer:", issuer);
    console.log("🧾 Issuer Name:", issuerName);
    console.log("🪪 Certificate ID:", certificateId);
    console.log("🎓 Student ID:", studentId);
    console.log("👤 Student Name:", studentName);
    console.log("🕒 Timestamp:", new Date(timestamp * 1000).toLocaleString());
  } catch (err) {
    console.error("❌ Error verifying certificate:", err.message);
  }
}

main().catch((error) => {
  console.error("❌ Script error:", error.message);
  process.exit(1);
});

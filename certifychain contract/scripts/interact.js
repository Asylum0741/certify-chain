const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentPath = path.join(
    __dirname,
    "..",
    "ignition",
    "deployments",
    "chain-31337", // update if needed
    "deployed_addresses.json"
  );

  if (!fs.existsSync(deploymentPath)) {
    throw new Error("❌ Deployment file not found. Run the deployment first.");
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  const contractAddress = deployment["CertificateNFTModule#CertificateNFT"];

  if (!contractAddress) {
    throw new Error("❌ Contract address not found in deployment file.");
  }

  console.log("✅ Using deployed contract at:", contractAddress);

  const CertificateNFT = await hre.ethers.getContractAt(
    "CertificateNFT",
    contractAddress
  );

  // Mint a certificate
  const tx = await CertificateNFT.mintCertificate(
    "csmit", // issuerName
    "cert001", // certificateId
    "asffd32", // studentId
    "Prem" // studentName
  );

  console.log("⏳ Waiting for transaction confirmation...");
  const receipt = await tx.wait();

  console.log("✅ Certificate minted successfully!");
  console.log("📄 Transaction Hash:", receipt.transactionHash);

  console.log("📦 All Event Logs:");
  console.dir(receipt.events, { depth: null });

  // Try parsing event by name
  const iface = CertificateNFT.interface;
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed.name === "CertificateMinted") {
        const args = parsed.args;
        console.log("🎉 CertificateMinted Event:");
        console.log("🔑 Certificate Hash:", args.certificateHash);
        console.log("🏢 Issuer:", args.issuer);
        console.log("🧾 Issuer Name:", args.issuerName);
        console.log("🪪 Certificate ID:", args.certificateId);
        console.log("🎓 Student ID:", args.studentId);
        console.log("👤 Student Name:", args.studentName);
        console.log("🕒 Timestamp:", args.timestamp.toString());
        return;
      }
    } catch (err) {
      // Not the event we're looking for, skip
    }
  }

  console.warn("⚠️ No CertificateMinted event found.");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CertificateNFTModule", (m) => {
  const certificateContract = m.contract("CertificateNFT");
  return { certificateContract };
});

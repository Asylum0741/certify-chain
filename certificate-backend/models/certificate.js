const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  certificateHash: String,
  issuer: String,
  issuerName: String,
  certificateId: String,
  studentId: String,
  studentName: String,
  timestamp: Number,
});

module.exports = mongoose.model("Certificate", certificateSchema);

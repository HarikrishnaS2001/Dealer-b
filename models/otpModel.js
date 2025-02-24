const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // Email or phone
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Expires in 5 minutes
});

// Create the OTP model
const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;

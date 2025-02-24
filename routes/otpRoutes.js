const express = require("express");
const sendOtpToEmail = require("../otpservices/Emailotp.js");
const sendOtpToPhone = require("../otpservices/Phoneotp.js");
const Otp = require("../models/otpModel.js");
const sendOtpToMobile = require("../otpservices/Phoneotp.js");

const OTPRouter = express.Router();

// dealsRouter.post("/user", userFunctions.addUser);
OTPRouter.post("/sendotp", async (req, res) => {
  console.log("inside sendotp route", req.body);

  const mode = req.body.mode;

  console.log("mode-", mode);

  try {
    let result;

    if (mode === "phone") {
      result = await sendOtpToMobile(req.body.phone);
    } else if (mode === "email") {
      result = await sendOtpToEmail(req.body.email);
    } else {
      return res.status(400).json({ success: false, message: "Invalid mode" });
    }

    console.log('post first if');

    if (result.success) {
      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
    } else {
      return res.status(400).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error("Error in /sendotp:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

OTPRouter.post("/verify-otp", async (req, res) => {
  const { mode, otp, email, phone } = req.body;
  const identifier = mode === "email" ? email : phone;

  try {
    // Find OTP in the database
    const record = await Otp.findOne({ identifier, otp });

    if (record) {
      // OTP verified, remove it from the database
      await Otp.deleteOne({ _id: record._id });
      return res.status(200).json({ success: true, message: "OTP verified" });
    }
    res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = OTPRouter;

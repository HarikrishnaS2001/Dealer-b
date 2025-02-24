const nodemailer = require("nodemailer");
const Otp = require('../models/otpModel');

async function sendOtpToEmail(email) {
  console.log("inside email otp");

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "123014026@sastra.ac.in", // Your email address
        pass: "olpx fpft lgsq varo", // Replace with your App Password
      },
    });

    // Email content
    const mailOptions = {
      from: "123014026@sastra.ac.in",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    const newOtp = new Otp({ identifier: email , otp });
    const result = await newOtp.save();
    // console.log("Test OTP saved:", result);


    // console.log(`OTP sent successfully to ${email}: ${otp}`);
    return { success: true, otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: error.message };
  }
}

module.exports = sendOtpToEmail;

const twilio = require("twilio");
const Otp = require('../models/otpModel');

const accountSid = "ACe1a9333f07966af5e720db273a284600"; // Replace with your Twilio Account SID
const authToken = "b6ebaa4c329c4478cbd8254cbf02527c";   // Replace with your Twilio Auth Token
const twilioPhoneNumber = '+1 320 373 6103'; // Replace with the actual Twilio phone number

const client = twilio(accountSid, authToken);

// Function to send OTP to mobile
async function sendOtpToMobile(phoneNumber) {
    console.log('inside mobile otp')
  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);


    // Send SMS via Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      from: twilioPhoneNumber,
      to: '+91' + phoneNumber, // Recipient's phone number
    });
    console.log('otp sent')

    const newOtp = new Otp({ identifier: phoneNumber , otp });
    const result = await newOtp.save();
    // console.log("Test OTP saved:", result);

    // console.log(`OTP sent successfully to ${phoneNumber}: ${otp}`);
     return{ statusCode: 200, success: true, otp };
  } catch (error) {
    // console.error("Error sending OTP:", error);
    return { statusCode: 400, success: false, error: "Failed to send OTP" };
  }
}

module.exports = sendOtpToMobile;

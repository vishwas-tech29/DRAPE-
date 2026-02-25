const twilio = require('twilio');
const logger = require('../config/logger');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendOTP = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your DRAPE verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`,
    });

    logger.info(`OTP sent to ${phoneNumber}: ${message.sid}`);
    return true;
  } catch (error) {
    logger.error(`SMS sending failed: ${error.message}`);
    return false;
  }
};

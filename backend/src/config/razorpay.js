// backend/src/config/razorpay.js

const Razorpay = require("razorpay");
const env = require("./env.js");



const razorpay = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
});

razorpay.getRazorpay = () => {
  return razorpay;
};

module.exports = razorpay;
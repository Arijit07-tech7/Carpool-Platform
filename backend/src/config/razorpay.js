// backend/src/config/razorpay.js

import Razorpay from "razorpay";
import env from "./env.js";



const razorpay = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
});

export const getRazorpay = () => {
  return razorpay;
};

export default razorpay;
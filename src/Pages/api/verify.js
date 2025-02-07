import Razorpay from "razorpay";
import crypto from 'crypto';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { orderCreationId, razorpayPaymentId, razorpaySignature } = req.body;
  
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest('hex');
  
      if (digest === razorpaySignature) {
        res.status(200).json({ success: true, message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { amount, currency } = req.body;
  
      try {
        const options = {
          amount: amount * 100,
          currency: currency,
          receipt: `receipt_${new Date().getTime()}`,
        };
  
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ orderId: order.id });
      } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        res.status(500).json({ error: 'Failed to create order' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
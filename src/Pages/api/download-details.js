import Razorpay from "razorpay";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Fetch payments related to the user
    const payments = await razorpay.payments.all({ customer_id: userId });

    // Fetch form submissions from the database (assuming a function getFormDetails exists)
    const formDetails = await getFormDetails(userId);

    return res.status(200).json({ payments, formDetails });
  } catch (error) {
    console.error("Error fetching details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

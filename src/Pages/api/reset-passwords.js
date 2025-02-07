import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { userId } = req.body;
  try {
    await clerkClient.users.sendResetPasswordEmail(userId);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ error: "Error sending reset password email" });
  }
}

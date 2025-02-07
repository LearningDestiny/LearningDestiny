import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { userId, referral } = req.body;
      if (!userId || !referral) {
        return res.status(400).json({ error: "User ID and referral are required" });
      }

      // Store referral in Clerk user metadata
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: { referral },
      });

      return res.status(200).json({ message: "Referral added successfully" });
    }

    if (req.method === "DELETE") {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Remove referral from Clerk user metadata
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: { referral: null },
      });

      return res.status(200).json({ message: "Referral deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error managing referrals:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

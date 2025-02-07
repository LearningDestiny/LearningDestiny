import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { userId } = req.body;
  try {
    await clerkClient.users.updateUser(userId, { banned: true });
    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deactivating user" });
  }
}

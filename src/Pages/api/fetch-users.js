import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    const users = await clerkClient.users.getUserList();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
}

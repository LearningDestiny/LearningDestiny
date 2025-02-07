import { clerkClient } from "@clerk/nextjs/server";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId, fileName } = req.query;
    if (!userId || !fileName) {
      return res.status(400).json({ error: "User ID and file name are required" });
    }

    // Fetch user from Clerk to verify existence
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // File path in the `public/uploads` directory
    const filePath = path.join(process.cwd(), "public/resumes", fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/octet-stream");
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

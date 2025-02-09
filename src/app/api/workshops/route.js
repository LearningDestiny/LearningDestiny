import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // Read workshops.json from the public folder
    const filePath = path.join(process.cwd(), "public/data/workshops.json");
    const data = await fs.readFile(filePath, "utf-8");
    const workshops = JSON.parse(data);

    return NextResponse.json(workshops, { status: 200 });
  } catch (error) {
    console.error("Error fetching workshops data:", error);
    return NextResponse.json({ message: "Failed to load workshops" }, { status: 500 });
  }
}

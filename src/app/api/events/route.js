import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/data/events.json");
    const data = await fs.readFile(filePath, "utf-8");
    const events = JSON.parse(data);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to load events" }, { status: 500 });
  }
}

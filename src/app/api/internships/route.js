import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/data/internships.json");
    const data = await fs.readFile(filePath, "utf-8");
    const internships = JSON.parse(data);

    return NextResponse.json(internships, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to load internships" }, { status: 500 });
  }
}

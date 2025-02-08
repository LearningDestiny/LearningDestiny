import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // Read courses.json from the public folder
    const filePath = path.join(process.cwd(), "public/data/courses.json");
    const data = await fs.readFile(filePath, "utf-8");
    const courses = JSON.parse(data);

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to load courses" }, { status: 500 });
  }
}

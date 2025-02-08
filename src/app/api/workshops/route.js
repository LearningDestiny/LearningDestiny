import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch workshops.json from the public folder using BASE URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/workshops.json`);
    if (!response.ok) throw new Error("Failed to fetch workshops");

    const workshops = await response.json();
    return NextResponse.json(workshops, { status: 200 });
  } catch (error) {
    console.error("Error fetching workshops data:", error);
    return NextResponse.json({ message: "Failed to load workshops" }, { status: 500 });
  }
}

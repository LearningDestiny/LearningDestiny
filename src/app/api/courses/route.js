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

// Add a new course
export async function POST(req) {
  try {
    const newCourse = await req.json();
    const data = await fs.readFile(filePath, "utf-8");
    const courses = JSON.parse(data);

    newCourse.id = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    courses.push(newCourse);

    await fs.writeFile(filePath, JSON.stringify(courses, null, 2), "utf-8");
    return NextResponse.json({ message: "Course added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to add course" }, { status: 500 });
  }
}

// Update an existing course
export async function PUT(req) {
  try {
    const { id, ...updatedCourse } = await req.json();
    const data = await fs.readFile(filePath, "utf-8");
    let courses = JSON.parse(data);

    const courseIndex = courses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    courses[courseIndex] = { ...courses[courseIndex], ...updatedCourse };
    await fs.writeFile(filePath, JSON.stringify(courses, null, 2), "utf-8");

    return NextResponse.json({ message: "Course updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update course" }, { status: 500 });
  }
}

// Delete a course
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let courses = JSON.parse(data);
    const newCourses = courses.filter(course => course.id !== id);

    if (courses.length === newCourses.length) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(newCourses, null, 2), "utf-8");
    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete course" }, { status: 500 });
  }
}
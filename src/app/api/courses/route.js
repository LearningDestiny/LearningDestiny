import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public/data/courses.json");

// GET: Fetch all courses
export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const courses = JSON.parse(data);
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error loading courses:", error);
    return NextResponse.json({ message: "Failed to load courses" }, { status: 500 });
  }
}

// POST: Add a new course with optional image upload
export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const price = formData.get("price");
    const description = formData.get("description");
    const duration = formData.get("duration");
    const instructor = formData.get("instructor");
    const image = formData.get("image"); // Image file

    if (!title || !price || !duration || !instructor) {
      return NextResponse.json({ message: "Title, price, duration, and instructor are required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const courses = JSON.parse(data);

    const newCourse = {
      id: courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1,
      title,
      price,
      description,
      duration,
      instructor,
      image: "" // Default empty image
    };

    // Handle image upload
    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const imagePath = `/images/${Date.now()}_${image.name}`;
      await fs.writeFile(path.join(process.cwd(), "public" + imagePath), imageBuffer);
      newCourse.image = imagePath;
    }

    courses.push(newCourse);
    await fs.writeFile(filePath, JSON.stringify(courses, null, 2), "utf-8");

    return NextResponse.json({ message: "Course added successfully", image: newCourse.image }, { status: 201 });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json({ message: "Failed to add course" }, { status: 500 });
  }
}

// PUT: Update an existing course with optional image update
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get("id")); // Get course ID
    const title = formData.get("title");
    const price = formData.get("price");
    const description = formData.get("description");
    const duration = formData.get("duration");
    const instructor = formData.get("instructor");
    const image = formData.get("image"); // New image file

    if (!id) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let courses = JSON.parse(data);

    const courseIndex = courses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // Handle image upload
    let newImagePath = courses[courseIndex].image; // Keep existing image
    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      newImagePath = `/images/${Date.now()}_${image.name}`;
      await fs.writeFile(path.join(process.cwd(), "public" + newImagePath), imageBuffer);
    }

    // Update course details
    courses[courseIndex] = {
      ...courses[courseIndex],
      title,
      price,
      description,
      duration,
      instructor,
      image: newImagePath // Update image path
    };

    await fs.writeFile(filePath, JSON.stringify(courses, null, 2), "utf-8");

    return NextResponse.json({ message: "Course updated successfully", image: newImagePath }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ message: "Failed to update course" }, { status: 500 });
  }
}

// DELETE: Remove a course
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
    console.error("Error deleting course:", error);
    return NextResponse.json({ message: "Failed to delete course" }, { status: 500 });
  }
}

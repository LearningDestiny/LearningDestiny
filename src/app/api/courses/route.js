import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_APPLICATION_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_APPLICATION_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

const bucketName = process.env.GOOGLE_STORAGE_BUCKET_NAME;
const jsonFileName = "courses.json";

// Helper function to fetch courses.json from Google Cloud Storage
async function getCoursesData() {
  try {
    const file = storage.bucket(bucketName).file(jsonFileName);
    const [exists] = await file.exists();
    
    if (!exists) {
      return []; // Return empty array if file doesn't exist
    }

    const [data] = await file.download();
    return JSON.parse(data.toString());
  } catch (error) {
    console.error("Error fetching courses.json:", error);
    return [];
  }
}

// Helper function to save courses.json to Google Cloud Storage
async function saveCoursesData(courses) {
  try {
    const file = storage.bucket(bucketName).file(jsonFileName);
    await file.save(JSON.stringify(courses, null, 2), { contentType: "application/json" });
  } catch (error) {
    console.error("Error saving courses.json:", error);
  }
}

// GET: Fetch all courses
export async function GET() {
  try {
    const courses = await getCoursesData();
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error loading courses:", error);
    return NextResponse.json({ message: "Failed to load courses" }, { status: 500 });
  }
}

// POST: Add a new course
export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const price = formData.get("price");
    const description = formData.get("description");
    const duration = formData.get("duration");
    const instructor = formData.get("instructor");
    const image = formData.get("image");

    if (!title || !price || !duration || !instructor) {
      return NextResponse.json({ message: "Title, price, duration, and instructor are required" }, { status: 400 });
    }

    let courses = await getCoursesData();

    let imageUrl = "";
    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const imageFileName = `images/${Date.now()}_${image.name}`;
      const file = storage.bucket(bucketName).file(imageFileName);
      
      await file.save(imageBuffer, { contentType: image.type });
      imageUrl = `https://storage.googleapis.com/${bucketName}/${imageFileName}`;
    }

    const newCourse = {
      id: courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1,
      title,
      price,
      description,
      duration,
      instructor,
      image: imageUrl,
    };

    courses.push(newCourse);
    await saveCoursesData(courses);

    return NextResponse.json({ message: "Course added successfully", image: imageUrl }, { status: 201 });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json({ message: "Failed to add course", error: error.toString() }, { status: 500 });
  }
}

// PUT: Update an existing course
export async function PUT(req) {
  try {
    let formData;
    const contentType = req.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
      formData = await req.formData();
    } else if (contentType?.includes("application/json")) {
      const jsonBody = await req.json();
      formData = new Map(Object.entries(jsonBody));
    } else {
      return NextResponse.json({ message: "Invalid Content-Type" }, { status: 400 });
    }

    const id = Number(formData.get("id"));
    if (!id) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    let courses = await getCoursesData();
    const courseIndex = courses.findIndex(course => course.id === id);

    if (courseIndex === -1) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // Update only fields that are provided
    const updatedCourse = {
      ...courses[courseIndex],
      title: formData.get("title") || courses[courseIndex].title,
      price: formData.get("price") || courses[courseIndex].price,
      description: formData.get("description") || courses[courseIndex].description,
      duration: formData.get("duration") || courses[courseIndex].duration,
      instructor: formData.get("instructor") || courses[courseIndex].instructor,
    };

    const image = formData.get("image");
    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const imageFileName = `images/${Date.now()}_${image.name}`;
      const file = storage.bucket(bucketName).file(imageFileName);
      
      await file.save(imageBuffer, { contentType: image.type });
      updatedCourse.image = `https://storage.googleapis.com/${bucketName}/${imageFileName}`;
    }

    courses[courseIndex] = updatedCourse;
    await saveCoursesData(courses);

    return NextResponse.json({ message: "Course updated successfully", image: updatedCourse.image }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ message: "Failed to update course", error: error.toString() }, { status: 500 });
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

    let courses = await getCoursesData();
    const newCourses = courses.filter(course => course.id !== id);

    if (courses.length === newCourses.length) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    await saveCoursesData(newCourses);
    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ message: "Failed to delete course", error: error.toString() }, { status: 500 });
  }
}

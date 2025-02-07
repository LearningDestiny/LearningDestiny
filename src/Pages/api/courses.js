// src/pages/api/courses.js

// Import the courses data
import { courses } from "../../Data";

// Define the API handler function
export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // Respond with the courses data
        res.status(200).json(courses);
        break;

      // You can add more cases for POST, PUT, DELETE if you need to modify data later

      default:
        // Handle unsupported methods
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
}

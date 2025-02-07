import fs from 'fs/promises';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src', 'data');
const eventsFilePath = path.join(dataDirectory, 'events.json');

async function ensureDirectoryExists(directory) {
  try {
    await fs.access(directory);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(directory, { recursive: true });
    } else {
      throw error;
    }
  }
}

async function readEventsFile() {
  try {
    await ensureDirectoryExists(dataDirectory);
    const data = await fs.readFile(eventsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it with initial data
      const initialData = [
        {
          "id": 1,
          "title": "AI and Machine Learning Summit 2024",
          "organizer": "Tech Corp",
          "date": "November 15, 2024",
          "location": "New York City, NY",
          "price": "Free",
          "imageUrl": "https://www.rrce.org/blog/wp-content/uploads/2022/11/Artifical-Intelligence.-Machine-Learning-at-RRCE.png",
          "description": "A one-day summit to explore the latest trends and innovations in AI and Machine Learning.",
          "agenda": [
            {
              "time": "10:00 AM - 11:00 AM",
              "session": "Keynote: The Future of AI",
              "speaker": "Dr. Jane Doe"
            },
            {
              "time": "11:30 AM - 1:00 PM",
              "session": "Workshop: Building Machine Learning Models",
              "speaker": "John Smith"
            },
            {
              "time": "2:00 PM - 3:30 PM",
              "session": "Panel Discussion: Ethics in AI",
              "speaker": "Various Industry Leaders"
            }
          ],
          "highlights": [
            "Networking Opportunities",
            "Hands-on Workshops",
            "Expert Panel Discussions"
          ]
        },
        {
          "id": 2,
          "title": "Web Development Bootcamp",
          "organizer": "Code Academy",
          "date": "December 5, 2024",
          "location": "Online",
          "price": "1,999 Rs",
          "imageUrl": "https://media.geeksforgeeks.org/wp-content/uploads/20231205165904/web-development-image.webp",
          "description": "A 3-day bootcamp to master the fundamentals of web development.",
          "agenda": [
            {
              "time": "Day 1: 9:00 AM - 5:00 PM",
              "session": "Introduction to HTML & CSS",
              "speaker": "Alice Johnson"
            },
            {
              "time": "Day 2: 9:00 AM - 5:00 PM",
              "session": "JavaScript for Beginners",
              "speaker": "Bob Williams"
            },
            {
              "time": "Day 3: 9:00 AM - 5:00 PM",
              "session": "Building and Deploying a Website",
              "speaker": "Charlie Brown"
            }
          ],
          "highlights": [
            "Live Coding Sessions",
            "Real-World Projects",
            "Interactive Q&A"
          ]
        }
      ];
      await fs.writeFile(eventsFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    console.error('Error reading events file:', error);
    throw error;
  }
}

async function writeEventsFile(events) {
  try {
    await ensureDirectoryExists(dataDirectory);
    await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error writing events file:', error);
    throw new Error('Error writing events data');
  }
}

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const events = await readEventsFile();
        res.status(200).json(events);
        break;

      case 'POST':
        console.log('Received POST request');
        console.log('Request body:', req.body);

        let newEvents = req.body;
        if (!Array.isArray(newEvents)) {
          newEvents = [newEvents];
        }

        console.log('Processed new events:', newEvents);

        const existingEvents = await readEventsFile();
        const updatedEvents = [...existingEvents, ...newEvents];

        console.log('Updated events array:', updatedEvents);

        await writeEventsFile(updatedEvents);
        res.status(201).json(newEvents);
        break;

      case 'PUT':
        const updatedEvent = req.body;
        const eventsToUpdate = await readEventsFile();
        const updateIndex = eventsToUpdate.findIndex((e) => e.id === parseInt(req.query.id));

        if (updateIndex !== -1) {
          eventsToUpdate[updateIndex] = updatedEvent;
          await writeEventsFile(eventsToUpdate);
          res.status(200).json(updatedEvent);
        } else {
          res.status(404).json({ message: 'Event not found' });
        }
        break;

      case 'DELETE':
        const { id } = req.query;

        if (!id) {
          res.status(400).json({ message: 'Invalid event ID' });
          break;
        }

        const eventsToFilter = await readEventsFile();
        const filteredEvents = eventsToFilter.filter((e) => e.id !== parseInt(id));

        if (eventsToFilter.length !== filteredEvents.length) {
          await writeEventsFile(filteredEvents);
          res.status(200).json({ message: 'Event deleted successfully' });
        } else {
          res.status(404).json({ message: 'Event not found' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
}
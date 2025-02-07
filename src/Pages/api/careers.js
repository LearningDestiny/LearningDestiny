import { promises as fs } from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src', 'data');
const careersFilePath = path.join(dataDirectory, 'careers.json');

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

async function readCareersFile() {
  try {
    await ensureDirectoryExists(dataDirectory);
    const data = await fs.readFile(careersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it with initial data
      const initialData = [
        {
          "id": 1,
          "title": "Software Engineer",
          "location": "Hyderabad",
          "experience": "1+ years",
          "date": "26/01/2025"
        },
        {
          "id": 2,
          "title": "Web Designer",
          "location": "Bangalore",
          "experience": "2 - 3 years",
          "date": "26/01/2025",
        },
        {
          "id": 3,
          "title": "Product Manager",
          "location": "Chennai",
          "experience": "4 - 8 years",
          "date": "26/01/2025",
        },
        {
          "id": 4,
          "title": "Data Scientist",
          "location": "Remote",
          "experience": "7+ years",
          "date": "27/01/2025",
        },
        {
          "id": 5,
          "title": "Tech Lead",
          "location": "Hyderabad",
          "experience": "5 - 6 years",
          "date": "28/01/2025"
        },
      ];
      await fs.writeFile(careersFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    console.error('Error reading careers file:', error);
    throw error;
  }
}

async function writeCareersFile(careers) {
  try {
    await ensureDirectoryExists(dataDirectory);
    await fs.writeFile(careersFilePath, JSON.stringify(careers, null, 2));
  } catch (error) {
    console.error('Error writing careers file:', error);
    throw new Error('Error writing careers data');
  }
}

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const careers = await readCareersFile();
        res.status(200).json(careers);
        break;

      case 'POST':
        let newCareers = req.body;
        if (!Array.isArray(newCareers)) {
          newCareers = [newCareers];
        }

        const existingCareers = await readCareersFile();
        const updatedCareers = [...existingCareers, ...newCareers];

        await writeCareersFile(updatedCareers);
        res.status(201).json(newCareers);
        break;

      case 'PUT':
        const updatedCareer = req.body;
        const careersToUpdate = await readCareersFile();
        const updateIndex = careersToUpdate.findIndex((c) => c.id === parseInt(req.query.id));

        if (updateIndex !== -1) {
          careersToUpdate[updateIndex] = updatedCareer;
          await writeCareersFile(careersToUpdate);
          res.status(200).json(updatedCareer);
        } else {
          res.status(404).json({ message: 'Career not found' });
        }
        break;

      case 'DELETE':
        const { id } = req.query;

        if (!id) {
          res.status(400).json({ message: 'Invalid career ID' });
          break;
        }

        const careersToFilter = await readCareersFile();
        const filteredCareers = careersToFilter.filter((c) => c.id !== parseInt(id));

        if (careersToFilter.length !== filteredCareers.length) {
          await writeCareersFile(filteredCareers);
          res.status(200).json({ message: 'Career deleted successfully' });
        } else {
          res.status(404).json({ message: 'Career not found' });
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
import { promises as fs } from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src', 'data');
const graduateRolesFilePath = path.join(dataDirectory, 'graduate-roles.json');

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

async function readGraduateRolesFile() {
  try {
    await ensureDirectoryExists(dataDirectory);
    const data = await fs.readFile(graduateRolesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const initialData = [
        {
          "id": 1,
          "title": "Junior Developer",
          "location": "Bangalore",
          "description": "Kickstart your career in software development with hands-on experience.",
          "requirements": [
            "Bachelor's degree in Computer Science or related field",
            "Basic understanding of programming languages such as JavaScript and Python",
            "Eagerness to learn and grow"
          ]
        },
        {
          "id": 2,
          "title": "Marketing Associate",
          "location": "Mumbai",
          "description": "Gain exposure to digital marketing and brand strategies.",
          "requirements": [
            "Bachelor's degree in Marketing or related field",
            "Basic understanding of digital marketing principles",
            "Eagerness to learn and grow"
          ]
        },
        {
          "id": 3,
          "title": "Data Analyst Trainee",
          "location": "Hyderabad",
          "description": "Learn data analysis skills and work on real projects.",
          "requirements": [
            "Bachelor's degree in Data Science, Statistics, or related field",
            "Basic understanding of data analysis tools and techniques",
            "Eagerness to learn and grow"
          ]
        },
        {
          "id": 4,
          "title": "IT Recruiter",
          "location": "Bangalore",
          "description": "Identify and attract top IT talent to join our growing team.",
          "requirements": [
            "Bachelor's degree in Human Resources or related field",
            "Basic understanding of IT recruitment processes",
            "Eagerness to learn and grow"
          ]
        },
        {
          "id": 5,
          "title": "Cloud Consultant",
          "location": "Mumbai",
          "description": "Advise and implement cloud solutions to optimize business operations.",
          "requirements": [
            "Bachelor's degree in Computer Science or related field",
            "Basic understanding of cloud platforms like AWS or Azure",
            "Eagerness to learn and grow"
          ]
        },
        {
          "id": 6,
          "title": "Content Writer",
          "location": "Remote",
          "description": "Create engaging and informative content for various digital platforms.",
          "requirements": [
            "Bachelor's degree in English, Journalism, or related field",
            "Basic understanding of content writing principles",
            "Eagerness to learn and grow"
          ]
        }
      ];
      await fs.writeFile(graduateRolesFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    console.error('Error reading graduate roles file:', error);
    throw error;
  }
}

async function writeGraduateRolesFile(graduateRoles) {
  try {
    await ensureDirectoryExists(dataDirectory);
    await fs.writeFile(graduateRolesFilePath, JSON.stringify(graduateRoles, null, 2));
  } catch (error) {
    console.error('Error writing graduate roles file:', error);
    throw new Error('Error writing graduate roles data');
  }
}

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const graduateRoles = await readGraduateRolesFile();
        res.status(200).json(graduateRoles);
        break;

      case 'POST':
        let newGraduateRoles = req.body;
        if (!Array.isArray(newGraduateRoles)) {
          newGraduateRoles = [newGraduateRoles];
        }

        const existingGraduateRoles = await readGraduateRolesFile();
        const updatedGraduateRoles = [...existingGraduateRoles, ...newGraduateRoles];

        await writeGraduateRolesFile(updatedGraduateRoles);
        res.status(201).json(newGraduateRoles);
        break;

      case 'PUT':
        const updatedGraduateRole = req.body;
        const graduateRolesToUpdate = await readGraduateRolesFile();
        const updateIndex = graduateRolesToUpdate.findIndex((c) => c.id === parseInt(req.query.id));

        if (updateIndex !== -1) {
          graduateRolesToUpdate[updateIndex] = updatedGraduateRole;
          await writeGraduateRolesFile(graduateRolesToUpdate);
          res.status(200).json(updatedGraduateRole);
        } else {
          res.status(404).json({ message: 'Graduate role not found' });
        }
        break;

      case 'DELETE':
        const { id } = req.query;

        if (!id) {
          res.status(400).json({ message: 'Invalid graduate role ID' });
          break;
        }

        const graduateRolesToFilter = await readGraduateRolesFile();
        const filteredGraduateRoles = graduateRolesToFilter.filter((c) => c.id !== parseInt(id));

        if (graduateRolesToFilter.length !== filteredGraduateRoles.length) {
          await writeGraduateRolesFile(filteredGraduateRoles);
          res.status(200).json({ message: 'Graduate role deleted successfully' });
        } else {
          res.status(404).json({ message: 'Graduate role not found' });
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
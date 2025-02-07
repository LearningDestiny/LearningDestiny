import { Clerk } from '@clerk/clerk-sdk-node';
import { promises as fs } from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src', 'data');
const usersFilePath = path.join(dataDirectory, 'users.json');

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

async function readUsersFile() {
  try {
    await ensureDirectoryExists(dataDirectory);
    const data = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const initialData = [];
      await fs.writeFile(usersFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    console.error('Error reading users file:', error);
    throw error;
  }
}

async function writeUsersFile(users) {
  try {
    await ensureDirectoryExists(dataDirectory);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
    throw new Error('Error writing users data');
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const event = req.body;
    try {
      const clerkUser = await Clerk.users.getUser(event.data.id);
      const users = await readUsersFile();

      const existingUserIndex = users.findIndex(user => user.id === clerkUser.id);
      if (existingUserIndex !== -1) {
        users[existingUserIndex] = {
          id: clerkUser.id,
          name: clerkUser.fullName,
          email: clerkUser.emailAddresses[0].emailAddress,
          status: 'active'
        };
      } else {
        users.push({
          id: clerkUser.id,
          name: clerkUser.fullName,
          email: clerkUser.emailAddresses[0].emailAddress,
          status: 'active'
        });
      }

      await writeUsersFile(users);
      res.status(200).json({ message: 'User data synced successfully' });
    } catch (error) {
      console.error('Error syncing user data:', error);
      res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
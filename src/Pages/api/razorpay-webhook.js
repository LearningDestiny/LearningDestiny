import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

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
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature === expectedSignature) {
      const event = req.body;
      if (event.event === 'payment.captured') {
        const paymentDetails = {
          paymentId: event.payload.payment.entity.id,
          amount: event.payload.payment.entity.amount / 100, // Amount is in paise
          paymentDate: new Date(event.payload.payment.entity.created_at * 1000).toISOString(),
          status: event.payload.payment.entity.status,
        };

        try {
          const users = await readUsersFile();
          const userIndex = users.findIndex((user) => user.email === event.payload.payment.entity.email);

          if (userIndex !== -1) {
            users[userIndex].paymentDetails = users[userIndex].paymentDetails || [];
            users[userIndex].paymentDetails.push(paymentDetails);
            await writeUsersFile(users);
            res.status(200).json({ message: 'Payment details updated successfully' });
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        } catch (error) {
          console.error('Error updating payment details:', error);
          res.status(500).json({ message: 'Internal server error', error: error.toString() });
        }
      } else {
        res.status(400).json({ message: 'Unhandled event type' });
      }
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
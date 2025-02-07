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
  const { userId, couponId } = req.query;

  try {
    const users = await readUsersFile();
    const userIndex = users.findIndex(user => user.id === parseInt(userId));

    if (userIndex === -1) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    switch (req.method) {
      case 'GET':
        res.status(200).json(users[userIndex].coupons || []);
        break;

      case 'POST':
        const newCoupon = req.body;
        newCoupon.couponId = Date.now();
        users[userIndex].coupons = users[userIndex].coupons || [];
        users[userIndex].coupons.push(newCoupon);
        await writeUsersFile(users);
        res.status(201).json(newCoupon);
        break;

      case 'PUT':
        const updatedCoupon = req.body;
        const couponIndex = users[userIndex].coupons.findIndex(coupon => coupon.couponId === parseInt(couponId));
        if (couponIndex !== -1) {
          users[userIndex].coupons[couponIndex] = { ...users[userIndex].coupons[couponIndex], ...updatedCoupon };
          await writeUsersFile(users);
          res.status(200).json(users[userIndex].coupons[couponIndex]);
        } else {
          res.status(404).json({ message: 'Coupon not found' });
        }
        break;

      case 'DELETE':
        const updatedCoupons = users[userIndex].coupons.filter(coupon => coupon.couponId !== parseInt(couponId));
        users[userIndex].coupons = updatedCoupons;
        await writeUsersFile(users);
        res.status(200).json({ message: 'Coupon deleted successfully' });
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
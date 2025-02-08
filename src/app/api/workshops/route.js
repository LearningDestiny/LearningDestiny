import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const workshopsFilePath = path.join(process.cwd(), 'public/data/workshops.json');

export async function GET() {
  try {
    const data = await fs.readFile(workshopsFilePath, 'utf8');
    const workshops = JSON.parse(data);
    return NextResponse.json(workshops, { status: 200 });
  } catch (error) {
    console.error('Error reading workshops data:', error);
    return NextResponse.json({ message: 'Failed to load workshops' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const logPath = path.join(process.cwd(), 'data', 'queues', `${today}-log.json`);

  try {
    const data = await fs.readFile(logPath, 'utf-8');
    const log = JSON.parse(data);
    return NextResponse.json({ log });
  } catch {
    return NextResponse.json({ log: [] });
  }
}

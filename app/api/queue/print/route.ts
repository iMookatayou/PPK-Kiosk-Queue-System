// /app/api/queue/print/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const { queue, services } = await req.json();

    if (!queue || !Array.isArray(services)) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }

    const date = getToday();
    const dir = path.join(process.cwd(), 'data', 'queues');
    const filePath = path.join(dir, `${date}-services.json`);

    await fs.mkdir(dir, { recursive: true });

    let existing: any[] = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      existing = JSON.parse(data);
    } catch {
      existing = [];
    }

    existing.push({
      queue,
      services,
      timestamp: new Date().toISOString()
    });

    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'ผิดพลาดในการบันทึก' }, { status: 500 });
  }
}

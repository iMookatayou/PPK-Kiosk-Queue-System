// app/api/queue/latest/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'queues', '2025-06-27.json')
  const file = await fs.readFile(filePath, 'utf-8')
  const data = JSON.parse(file)
  const latestQueue = data?.latestQueue ?? null

  return NextResponse.json({ latestQueue })
}

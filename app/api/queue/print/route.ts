import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'Asia/Bangkok'

// คืนค่า Date ของวันนี้แบบ 00:00 UTC สำหรับใช้เป็น key ในฐานข้อมูล
function getTodayMidnightUTC(): Date {
  const now = dayjs().tz(TIMEZONE)
  return new Date(Date.UTC(now.year(), now.month(), now.date()))
}

// คืนค่าวันที่แบบ string 'YYYY-MM-DD' สำหรับชื่อไฟล์
function getTodayDateString(): string {
  return dayjs().tz(TIMEZONE).format('YYYY-MM-DD')
}

export async function POST(req: NextRequest) {
  try {
    const { queue, services } = await req.json()

    if (!queue || !Array.isArray(services)) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    const dateString = getTodayDateString()
    const date = getTodayMidnightUTC()
    const dir = path.join(process.cwd(), 'data', 'queues')
    const filePath = path.join(dir, `${dateString}-services.json`)
    const timestamp = new Date().toISOString()

    await fs.mkdir(dir, { recursive: true })

    let existing: any[] = []
    try {
      const data = await fs.readFile(filePath, 'utf-8')
      existing = JSON.parse(data)
    } catch {
      existing = []
    }

    existing.push({ queue, services, timestamp })
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8')

    // บันทึกลงฐานข้อมูล MySQL ด้วย date แบบ 00:00:00 UTC
    await prisma.dataQueue.upsert({
      where: { date },
      update: {
        lastQueue: parseInt(queue, 10) || 0,
        previousQueue: 0,
        source: 'manual',
      },
      create: {
        date,
        lastQueue: parseInt(queue, 10) || 0,
        previousQueue: 0,
        source: 'manual',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[QUEUE_PRINT_ERROR]', err)
    return NextResponse.json({ error: 'ผิดพลาดในการบันทึก' }, { status: 500 })
  }
}

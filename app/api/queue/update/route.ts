import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

function getToday(): string {
  return dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD')
}

function getQueueFilePath(): string {
  const today = getToday()
  return path.join(process.cwd(), 'data', 'queues', `${today}.json`)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newQueue = parseInt(body?.newQueue, 10)

    if (isNaN(newQueue) || newQueue < 0) {
      console.warn('[WARN] ค่า newQueue ไม่ถูกต้อง:', body?.newQueue)
      return NextResponse.json({ error: 'Invalid queue number' }, { status: 400 })
    }

    const queueFile = getQueueFilePath()
    await fs.mkdir(path.dirname(queueFile), { recursive: true })

    let currentData = { lastQueue: 0 }

    try {
      const file = await fs.readFile(queueFile, 'utf-8')
      currentData = JSON.parse(file)
      console.log('[INFO] คิวปัจจุบัน:', currentData.lastQueue)
    } catch {
      console.log('[INFO] ยังไม่มีไฟล์คิวสำหรับวันนี้ สร้างใหม่')
    }

    currentData.lastQueue = newQueue

    await fs.writeFile(queueFile, JSON.stringify(currentData, null, 2), 'utf-8')
    console.log('[✅] อัปเดตคิวสำเร็จ:', newQueue)

    return NextResponse.json({ message: 'อัปเดตคิวสำเร็จ', newQueue })

  } catch (error: any) {
    console.error('[❌ ERROR] อัปเดตคิวล้มเหลว:', error.message)
    return NextResponse.json({ error: 'อัปเดตคิวล้มเหลว' }, { status: 500 })
  }
}

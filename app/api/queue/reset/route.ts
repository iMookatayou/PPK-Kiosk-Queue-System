import { NextResponse } from 'next/server'
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

function getQueuePaths(date: string) {
  const dir = path.join(process.cwd(), 'data', 'queues')
  return {
    dir,
    queueFile: path.join(dir, `${date}.json`),
    logFile: path.join(dir, `${date}-log.json`),
    patientFile: path.join(dir, `${date}-patients.json`)
  }
}

export async function POST() {
  const today = getToday()
  const { dir, queueFile, logFile, patientFile } = getQueuePaths(today)

  try {
    // ลบไฟล์ทั้งหมดที่เกี่ยวข้อง
    await Promise.allSettled([
      fs.unlink(queueFile),
      fs.unlink(logFile),
      fs.unlink(patientFile),
    ])

    // เขียนไฟล์ queue ใหม่ให้เริ่มต้นที่ 0
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(queueFile, JSON.stringify({ lastQueue: 0 }, null, 2), 'utf-8')

    return NextResponse.json({ message: 'รีเซ็ตคิวและ log สำเร็จ' })
  } catch (error) {
    console.error('[ResetQueue] ERROR:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการล้างคิว' },
      { status: 500 }
    )
  }
}

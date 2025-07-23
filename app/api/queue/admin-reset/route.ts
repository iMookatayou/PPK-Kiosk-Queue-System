import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { prisma } from '@/lib/prisma'

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'Asia/Bangkok'

function getTodayDate() {
  return dayjs().tz(TIMEZONE).format('YYYY-MM-DD')
}

function getTodayMidnightUTC(): Date {
  const now = dayjs().tz(TIMEZONE)
  return new Date(Date.UTC(now.year(), now.month(), now.date()))
}

function getQueuePaths(date: string) {
  const dir = path.join(process.cwd(), 'data', 'queues')
  return {
    dir,
    queueFile: path.join(dir, `${date}.json`),
    logFile: path.join(dir, `${date}-log.json`),
    patientFile: path.join(dir, `${date}-patients.json`),
    flagFile: path.join(dir, `${date}-reset.flag`),
  }
}

async function resetQueueForce(): Promise<void> {
  const today = getTodayDate()
  const todayMidnight = getTodayMidnightUTC()
  const { dir, queueFile } = getQueuePaths(today)

  await fs.mkdir(dir, { recursive: true })

  let previousQueue = 0
  try {
    const existing = await fs.readFile(queueFile, 'utf-8')
    const data = JSON.parse(existing)
    previousQueue = data.lastQueue ?? 0
  } catch {
    // ไม่มีไฟล์เดิม → ถือว่าเริ่มใหม่
  }

  const resetData = {
    lastQueue: 0,
    date: today,
    previous: {
      queue: previousQueue,
      label: `หมายเลขคิวก่อนรีเซ็ตคือ ${previousQueue}`,
    },
  }

  await fs.writeFile(queueFile, JSON.stringify(resetData, null, 2), 'utf-8')

  // Reset คิวใน MySQL ด้วย Prisma
  await prisma.dataQueue.upsert({
    where: { date: todayMidnight },
    update: {
      lastQueue: 0,
      source: 'manual', // อัปเดตเฉพาะนี้
    },
    create: {
      date: todayMidnight,
      lastQueue: 0,
      previousQueue,   // ใส่ตอน create ครั้งแรกเท่านั้น
      source: 'manual',
    },
  })  
}

export async function POST() {
  const now = dayjs().tz(TIMEZONE)
  const today = getTodayDate()
  const { flagFile } = getQueuePaths(today)

  try {
    await resetQueueForce()
    await fs.writeFile(flagFile, `reset manually at ${now.format()}`)

    console.log(`[ADMIN] ✅ Manual reset queue success @ ${now.format()}`)

    return NextResponse.json({
      time: now.format(),
    })
  } catch (error: any) {
    console.error('[ADMIN RESET ERROR]', error)

    return NextResponse.json(
      {
        error: 'ล้มเหลวในการรีเซ็ตคิว',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}

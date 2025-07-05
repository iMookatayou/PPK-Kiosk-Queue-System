// app/api/queue/admin-reset/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'Asia/Bangkok'

function getTodayDate() {
  return dayjs().tz(TIMEZONE).format('YYYY-MM-DD')
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

// รีเซ็ตคิว (ไม่สน flag เดิม)
async function resetQueueForce(): Promise<void> {
  const today = getTodayDate()
  const { dir, queueFile } = getQueuePaths(today)

  await fs.mkdir(dir, { recursive: true })

  const emptyQueue = JSON.stringify({ lastQueue: 0 }, null, 2)
  await fs.writeFile(queueFile, emptyQueue, 'utf-8')
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
      message: '✅ รีเซ็ตคิวสำเร็จแล้ว',
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

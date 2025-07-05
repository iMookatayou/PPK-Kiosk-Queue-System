'use server'

import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

const TIMEZONE = 'Asia/Bangkok'

function getStrictToday(): string {
  return dayjs().tz(TIMEZONE).format('YYYY-MM-DD')
}

function getQueuePaths(date: string) {
  const dir = path.join(process.cwd(), 'data', 'queues')
  return {
    dir,
    queueFile: path.join(dir, `${date}.json`),
    logFile: path.join(dir, `${date}-log.json`),
    patientFile: path.join(dir, `${date}-patients.json`),
    morningFlagFile: path.join(dir, `${date}-reset-morning.flag`),
    eveningFlagFile: path.join(dir, `${date}-reset-evening.flag`),
    flagFile: path.join(dir, `${date}-reset.flag`),
    backupFile: path.join(dir, `${date}-backup.json`)
  }
}

export async function getLastQueue(): Promise<number> {
  const today = getStrictToday()
  const { queueFile } = getQueuePaths(today)

  try {
    const content = await fs.readFile(queueFile, 'utf-8')
    const data = JSON.parse(content)
    return data.lastQueue ?? 0
  } catch {
    return 0
  }
}

let lastCheckedAt: number | null = null

export async function autoResetOnStartup(): Promise<boolean> {
  const now = dayjs().tz(TIMEZONE)
  const nowHM = now.hour() * 60 + now.minute()
  const today = getStrictToday()
  const { dir, queueFile } = getQueuePaths(today)

  await fs.mkdir(dir, { recursive: true })

  const isResetTime = nowHM < 390 || nowHM >= 980 // ก่อน 6:30 หรือหลัง 16:20

  let shouldReset = false
  let previousQueue = 0

  try {
    const content = await fs.readFile(queueFile, 'utf-8')
    const data = JSON.parse(content)
    previousQueue = data.lastQueue ?? 0

    if (data.date !== today || (isResetTime && data.lastQueue !== 0)) {
      shouldReset = true
    }
  } catch (err) {
    shouldReset = true // ไม่มีไฟล์หรือพัง = รีเลย
  }

  if (shouldReset) {
    const resetData = {
      lastQueue: 0,
      date: today,
      previous: {
        queue: previousQueue,
        label: `หมายเลขคิวก่อนรีเซ็ตคือ ${previousQueue}`
      }
    }
    await fs.writeFile(queueFile, JSON.stringify(resetData, null, 2), 'utf-8')
    console.log(`✅ [AUTO RESET] คิวถูกรีแล้ว: ${now.format('HH:mm')} queue=0 (เก่า=${previousQueue})`)
    return true
  }

  return false
}

export async function updateQueueFromAdmin(newQueue: number): Promise<void> {
  const now = dayjs().tz(TIMEZONE)
  const today = getStrictToday()
  const { queueFile } = getQueuePaths(today)

  if (typeof newQueue !== 'number' || isNaN(newQueue) || newQueue < 0) {
    throw new Error('หมายเลขคิวไม่ถูกต้อง')
  }

  await fs.mkdir(path.dirname(queueFile), { recursive: true })

  const data = {
    lastQueue: newQueue,
    date: today,
  }

  await fs.writeFile(queueFile, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`[ADMIN] อัปเดตคิวล่าสุดเป็น ${newQueue} @ ${now.format('HH:mm')} (${queueFile})`)
}

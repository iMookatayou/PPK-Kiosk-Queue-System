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
    flagFile: path.join(dir, `${date}-reset.flag`),
  }
}

// รีเซ็ตคิวอัตโนมัติหากยังเป็นข้อมูลเก่า หรืออยู่นอกเวลาให้บริการ
export async function autoResetOnStartup(): Promise<boolean> {
  const now = dayjs().tz(TIMEZONE)
  const today = getStrictToday()
  const hour = now.hour()
  const minute = now.minute()
  const { queueFile, flagFile } = getQueuePaths(today)

  let queueData: { lastQueue: number; date?: string } = { lastQueue: 0 }
  try {
    const content = await fs.readFile(queueFile, 'utf-8')
    queueData = JSON.parse(content)
  } catch {}

  const isBefore630 = hour < 6 || (hour === 6 && minute < 30)
  const isAfter1620 = hour > 16 || (hour === 16 && minute >= 20)
  const isResetTime = isBefore630 || isAfter1620

  const dataDate = queueData.date
  const currentQueue = queueData.lastQueue || 0
  const isTodayData = dataDate === today

  const shouldReset = !isTodayData || (isResetTime && currentQueue > 0)

  if (shouldReset) {
    const resetData = {
      lastQueue: 0,
      date: today,
    }
    await fs.writeFile(queueFile, JSON.stringify(resetData, null, 2), 'utf-8')
    await fs.writeFile(flagFile, `Auto reset at ${now.format()}`)
    console.log(`[AUTO RESET] ✅ ล้างคิวอัตโนมัติ @ ${now.format()}`)
    return true
  } else {
    console.log('[AUTO RESET] ℹ️ ไม่ต้องรี คิวถูกต้องอยู่แล้ว')
    return false
  }
}

export async function getLastQueue(): Promise<number> {
  const today = getStrictToday()
  const { queueFile } = getQueuePaths(today)
  try {
    const content = await fs.readFile(queueFile, 'utf-8')
    const data = JSON.parse(content)
    return data.lastQueue || 0
  } catch {
    return 0
  }
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

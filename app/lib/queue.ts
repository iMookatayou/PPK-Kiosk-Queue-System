'use server'

import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'Asia/Bangkok'

function getStrictToday(): string {
  return dayjs().tz(TIMEZONE).format('YYYY-MM-DD')
}

function getQueuePaths(date: string) {
  const dir = path.join(process.cwd(), 'data', 'queues')
  return {
    dir,
    queueFile: path.join(dir, `${date}.json`),
    flagFile: path.join(dir, `${date}-reset.flag`),
  }
}

function isResetTime(hour: number, minute: number): boolean {
  return hour < 6 || (hour === 6 && minute < 30) || hour > 16 || (hour === 16 && minute >= 20)
}

export async function addQueue(): Promise<number> {
  const now = dayjs().tz(TIMEZONE)
  const hour = now.hour()
  const minute = now.minute()
  const today = getStrictToday()
  const { dir, queueFile, flagFile } = getQueuePaths(today)

  await fs.mkdir(dir, { recursive: true })

  let queueData: { lastQueue: number; date?: string } = { lastQueue: 0 }

  try {
    const content = await fs.readFile(queueFile, 'utf-8')
    queueData = JSON.parse(content)
  } catch {}

  const isOutOfTime = isResetTime(hour, minute)
  const currentQueue = queueData.lastQueue || 0
  const isToday = queueData.date === today
  const flagExists = await fs.stat(flagFile).then(() => true).catch(() => false)

  const needReset = !isToday || (isOutOfTime && currentQueue > 0 && !flagExists)

  if (needReset) {
    const resetData = {
      lastQueue: 0,
      date: today,
    }
    await fs.writeFile(queueFile, JSON.stringify(resetData, null, 2), 'utf-8')
    await fs.writeFile(flagFile, `Auto reset by addQueue() @ ${now.format()}`)
    console.log(`[AUTO RESET] คิวถูกล้างจาก addQueue() @ ${now.format()}`)
    return 0
  }

  if (!isOutOfTime) {
    const nextQueue = currentQueue + 1
    const newData = {
      lastQueue: nextQueue,
      date: today,
    }
    await fs.writeFile(queueFile, JSON.stringify(newData, null, 2), 'utf-8')
    return nextQueue
  }

  throw new Error('รับคิวได้เฉพาะเวลา 06:30 – 16:20 เท่านั้น')
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

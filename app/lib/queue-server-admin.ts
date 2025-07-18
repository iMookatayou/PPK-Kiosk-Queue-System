'use server'

import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import { prisma } from '@/lib/prisma'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

const TIMEZONE = 'Asia/Bangkok'
const DEFAULT_OPEN = '06:30'
const DEFAULT_CLOSE = '16:20'

interface Settings {
  override?: {
    enabled: boolean
    openTime: string
    closeTime: string
  }
}

// ✅ คืนค่า Date ที่เป็น 00:00 UTC ของวันนั้นในเขตเวลา Bangkok
function getTodayMidnightUTC(): Date {
  const now = dayjs().tz(TIMEZONE)
  return new Date(Date.UTC(now.year(), now.month(), now.date()))
}

// คืนค่าเป็น 'YYYY-MM-DD'
function getStrictToday(): string {
  return dayjs().tz(TIMEZONE).format('YYYY-MM-DD')
}

function getQueuePaths(date: string) {
  const dir = path.join(process.cwd(), 'data', 'queues')
  return {
    dir,
    queueFile: path.join(dir, `${date}.json`)
  }
}

async function loadSettings(): Promise<Settings> {
  try {
    const content = await fs.readFile(path.join(process.cwd(), 'data/settings.json'), 'utf-8')
    return JSON.parse(content)
  } catch {
    return {}
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

export async function autoResetOnStartup(): Promise<boolean> {
  const now = dayjs().tz(TIMEZONE)
  const nowHM = now.hour() * 60 + now.minute()
  const today = getStrictToday()
  const todayMidnightUTC = getTodayMidnightUTC()
  const { dir, queueFile } = getQueuePaths(today)

  await fs.mkdir(dir, { recursive: true })

  const settings = await loadSettings()
  const override = settings.override

  const openTime = override?.enabled ? override.openTime : DEFAULT_OPEN
  const closeTime = override?.enabled ? override.closeTime : DEFAULT_CLOSE

  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)
  const openHM = openH * 60 + openM
  const closeHM = closeH * 60 + closeM

  let shouldReset = false
  let previousQueue = 0

  try {
    const content = await fs.readFile(queueFile, 'utf-8')
    const data = JSON.parse(content)
    previousQueue = data.lastQueue ?? 0

    const alreadyReset = data.date === today && data.lastQueue === 0
    if (alreadyReset) {
      console.log(`⚠️ [AUTO RESET] ข้ามเพราะรีไปแล้ว queue=0`)
      return false
    }

    if (override?.enabled) {
      if (nowHM < openHM || nowHM >= closeHM || previousQueue === 0) {
        shouldReset = true
      } else {
        console.log(`[SKIP RESET] คิวยังอยู่ (${previousQueue}) และอยู่ในช่วงเวลาเปิดให้บริการ`)
      }
    } else {
      if (nowHM < 390 || nowHM >= closeHM) {
        shouldReset = true
      }
    }
  } catch {
    shouldReset = true
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

    try {
      await prisma.dataQueue.update({
        where: { date: todayMidnightUTC },
        data: {
          lastQueue: 0,
          previousQueue,
          source: 'auto'
        }
      })
    } catch {
      await prisma.dataQueue.create({
        data: {
          date: todayMidnightUTC,
          lastQueue: 0,
          previousQueue,
          source: 'auto',
          location: null
        }
      })
    }

    console.log(`✅ [AUTO RESET] คิวถูกรีแล้ว: ${now.format('HH:mm')} queue=0 (เก่า=${previousQueue})`)
    return true
  }

  return false
}

export async function updateQueueFromAdmin(newQueue: number): Promise<void> {
  const now = dayjs().tz(TIMEZONE)
  const today = getStrictToday()
  const todayMidnightUTC = getTodayMidnightUTC()
  const { queueFile } = getQueuePaths(today)

  if (typeof newQueue !== 'number' || isNaN(newQueue) || newQueue < 0) {
    throw new Error('หมายเลขคิวไม่ถูกต้อง')
  }

  await fs.mkdir(path.dirname(queueFile), { recursive: true })

  const data = {
    lastQueue: newQueue,
    date: today
  }

  await fs.writeFile(queueFile, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`[ADMIN] อัปเดตคิวล่าสุดเป็น ${newQueue} @ ${now.format('HH:mm')} (${queueFile})`)

  try {
    await prisma.dataQueue.update({
      where: { date: todayMidnightUTC },
      data: {
        lastQueue: newQueue
      }
    })
  } catch {
    await prisma.dataQueue.create({
      data: {
        date: todayMidnightUTC,
        lastQueue: newQueue,
        previousQueue: 0,
        source: 'manual',
        location: null
      }
    })
  }

  console.log(`[DB] ✅ บันทึกคิวล่าสุด ${newQueue} ลง MySQL สำเร็จ`)
}

'use server'

import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { prisma } from '@/lib/prisma'

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'Asia/Bangkok'

// ✅ คืนค่า 'YYYY-MM-DD' ของวันนี้ใน timezone ที่กำหนด
function getToday(): string {
  return dayjs().tz(TIMEZONE).format('YYYY-MM-DD')
}

// ✅ คืนค่า Date ที่เป็น 00:00:00 UTC ของวันใน timezone Bangkok
function getTodayMidnightUTC(): Date {
  const now = dayjs().tz(TIMEZONE)
  return new Date(Date.UTC(now.year(), now.month(), now.date()))
}

function getQueueFilePath(): string {
  const dir = path.join(process.cwd(), 'data', 'queues')
  return path.join(dir, `${getToday()}.json`)
}

async function loadSettings() {
  try {
    const content = await fs.readFile(path.join(process.cwd(), 'data/settings.json'), 'utf-8')
    return JSON.parse(content)
  } catch {
    return {}
  }
}

const validateTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number)
  if (h < 0 || h > 23 || m < 0 || m > 59) return '00:00'
  return time
}

export async function addQueue(): Promise<number> {
  const now = dayjs().tz(TIMEZONE)
  const nowHM = now.hour() * 60 + now.minute()
  const today = getToday()
  const todayMidnightUTC = getTodayMidnightUTC()
  const file = getQueueFilePath()

  await fs.mkdir(path.dirname(file), { recursive: true })

  let currentQueue = 0
  let savedDate = ''

  try {
    const content = await fs.readFile(file, 'utf-8')
    const data = JSON.parse(content)
    currentQueue = data.lastQueue || 0
    savedDate = data.date || ''
  } catch {
    // ไม่มีไฟล์ ถือเป็นวันใหม่
  }

  const settings = await loadSettings()
  const overrideEnabled = settings.override?.enabled === true
  const overrideStart = validateTime(settings.override?.openTime || '06:30')
  const overrideEnd = validateTime(settings.override?.closeTime || '16:20')

  const [startH, startM] = overrideStart.split(':').map(Number)
  const [endH, endM] = overrideEnd.split(':').map(Number)
  const openHM = startH * 60 + startM
  const closeHM = endH * 60 + endM

  const isOpen = overrideEnabled
    ? nowHM >= openHM && nowHM < closeHM
    : nowHM >= 390 && nowHM < 980 // 06:30–16:20 default

  const isOutdated = savedDate !== today
  const isOutOfTime = !isOpen && currentQueue > 0
  const shouldReset = isOutdated || isOutOfTime

  if (shouldReset) {
    const resetData = { lastQueue: 0, date: today }
    await fs.writeFile(file, JSON.stringify(resetData, null, 2), 'utf-8')

    try {
      await prisma.dataQueue.update({
        where: { date: todayMidnightUTC },
        data: {
          lastQueue: 0,
          previousQueue: currentQueue,
          source: 'auto',
          location: null,
        },
      })
    } catch {
      await prisma.dataQueue.create({
        data: {
          date: todayMidnightUTC,
          lastQueue: 0,
          previousQueue: currentQueue,
          source: 'auto',
          location: null,
        },
      })
    }

    console.log(`🔄 [RESET] คิวถูกรีเซ็ตเป็น 0 (เก่า ${currentQueue})`)
    currentQueue = 0
  }

  if (isOpen) {
    const nextQueue = currentQueue + 1
    const newData = { lastQueue: nextQueue, date: today }
    await fs.writeFile(file, JSON.stringify(newData, null, 2), 'utf-8')

    try {
      await prisma.dataQueue.update({
        where: { date: todayMidnightUTC },
        data: { lastQueue: nextQueue },
      })
    } catch {
      await prisma.dataQueue.create({
        data: {
          date: todayMidnightUTC,
          lastQueue: nextQueue,
          previousQueue: 0,
          source: 'manual',
          location: null, 
        },
      })
    }

    if (overrideEnabled) {
      console.log(`[OVERRIDE] kiosk รับคิวได้เพราะ override admin เปิดไว้`)
    }

    return nextQueue
  }

  throw new Error(
    `รับคิวได้เฉพาะเวลา ${overrideStart} – ${overrideEnd} หรือให้แอดมินเปิด Override`
  )
}

'use server'

import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import fetch from 'node-fetch'

dayjs.extend(utc)
dayjs.extend(timezone)

function getToday(): string {
  // วันที่ตามเวลาไทย (ใช้ภายใน server)
  return dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD')
}

async function getNowFromApi(): Promise<string> {
  try {
    const res = await fetch('http://superapp-web-1:3000/api/time')
    const data = await res.json() as {
      iso: string
      formatted: string
      unix: number
      timezone: string
    }

    return data.iso || new Date().toISOString()
  } catch (e) {
    console.warn('[WARN] ใช้เวลาสำรองจากระบบเพราะ API ล้มเหลว')
    return new Date().toISOString()
  }
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

export async function addQueue(): Promise<number> {
  const today = getToday()
  const { dir, queueFile, logFile } = getQueuePaths(today)
  await fs.mkdir(dir, { recursive: true })

  let lastQueue = 0
  try {
    const content = await fs.readFile(queueFile, 'utf-8')
    lastQueue = JSON.parse(content).lastQueue || 0
  } catch {
    // ถ้าไม่มีไฟล์ให้เริ่มจาก 0
  }

  const nextQueue = lastQueue + 1
  await fs.writeFile(queueFile, JSON.stringify({ lastQueue: nextQueue }), 'utf-8')

  let logs: Array<any> = []
  try {
    logs = JSON.parse(await fs.readFile(logFile, 'utf-8'))
  } catch {}

  const now = await getNowFromApi()
  logs.push({ queue: nextQueue, time: now })
  await fs.writeFile(logFile, JSON.stringify(logs, null, 2), 'utf-8')

  return nextQueue
}

export async function getLastQueue(): Promise<number> {
  const today = getToday()
  const { queueFile } = getQueuePaths(today)
  try {
    const content = await fs.readFile(queueFile, 'utf-8')
    return JSON.parse(content).lastQueue || 0
  } catch {
    return 0
  }
}

export async function savePatientInfo(data: {
  queueNumber: number
  name: string
  age: number
  gender: string
  cid: string
}) {
  const today = getToday()
  const { patientFile } = getQueuePaths(today)

  let records: any[] = []
  try {
    records = JSON.parse(await fs.readFile(patientFile, 'utf-8'))
  } catch {}

  const now = await getNowFromApi()

  records.push({
    ...data,
    time: now
  })

  await fs.writeFile(patientFile, JSON.stringify(records, null, 2), 'utf-8')
}

export async function updateQueue(newQueue: number): Promise<void> {
  const today = getToday()
  const { dir, queueFile } = getQueuePaths(today)
  await fs.mkdir(dir, { recursive: true })

  if (typeof newQueue !== 'number' || isNaN(newQueue) || newQueue < 0) {
    throw new Error('หมายเลขคิวไม่ถูกต้อง')
  }

  await fs.writeFile(queueFile, JSON.stringify({ lastQueue: newQueue }, null, 2), 'utf-8')
}

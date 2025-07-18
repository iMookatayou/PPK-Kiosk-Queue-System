// app/api/settings/route.ts

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { autoResetOnStartup } from '@/lib/queue-server-admin'

const settingsFile = path.join(process.cwd(), 'data', 'settings.json')

interface OverrideSetting {
  enabled: boolean
  openTime: string
  closeTime: string
}

interface Settings {
  override: OverrideSetting
}

// โหลด settings
async function readSettings(): Promise<Settings> {
  try {
    const raw = await fs.readFile(settingsFile, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {
      override: {
        enabled: false,
        openTime: '06:30',
        closeTime: '16:20'
      }
    }
  }
}

// อ่าน settings
export async function GET() {
  const settings = await readSettings()
  return NextResponse.json(settings)
}

// เขียนใหม่ทั้งหมด (ใช้เมื่อยังไม่มี)
export async function POST(req: Request) {
  try {
    const data = await req.json()

    if (
      typeof data.override?.enabled !== 'boolean' ||
      typeof data.override?.openTime !== 'string' ||
      typeof data.override?.closeTime !== 'string'
    ) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    // ตรวจสอบเวลาไม่ให้ซ้ำซ้อน
    const [openH, openM] = data.override.openTime.split(':').map(Number)
    const [closeH, closeM] = data.override.closeTime.split(':').map(Number)
    if (openH * 60 + openM >= closeH * 60 + closeM) {
      return NextResponse.json({ error: 'เวลาเริ่มต้องน้อยกว่าหมายเวลาเลิก' }, { status: 400 })
    }

    const newSettings: Settings = {
      override: {
        enabled: data.override.enabled,
        openTime: data.override.openTime,
        closeTime: data.override.closeTime
      }
    }

    await fs.mkdir(path.dirname(settingsFile), { recursive: true })
    await fs.writeFile(settingsFile, JSON.stringify(newSettings, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/settings error:', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}

// อัปเดต override + รีคิวถ้าเพิ่งเปิด
export async function PATCH(req: Request) {
  try {
    const data = await req.json()

    if (
      typeof data.override?.enabled !== 'boolean' ||
      typeof data.override?.openTime !== 'string' ||
      typeof data.override?.closeTime !== 'string'
    ) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    // ตรวจสอบเวลาไม่ให้ซ้ำซ้อน
    const [openH, openM] = data.override.openTime.split(':').map(Number)
    const [closeH, closeM] = data.override.closeTime.split(':').map(Number)
    if (openH * 60 + openM >= closeH * 60 + closeM) {
      return NextResponse.json({ error: 'เวลาเริ่มต้องน้อยกว่าหมายเวลาเลิก' }, { status: 400 })
    }

    const previousRaw = await fs.readFile(settingsFile, 'utf-8')
    const previous = JSON.parse(previousRaw)

    const newSettings: Settings = {
      override: {
        enabled: data.override.enabled,
        openTime: data.override.openTime,
        closeTime: data.override.closeTime
      }
    }

    await fs.writeFile(settingsFile, JSON.stringify(newSettings, null, 2), 'utf-8')

    // รีคิวทันที ถ้าเพิ่งเปิด override
    if (!previous.override?.enabled && data.override.enabled) {
      console.log('[ADMIN OVERRIDE] กำลังรีคิว...')
      await autoResetOnStartup()
    }   

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/settings error:', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const settingsFile = path.join(process.cwd(), 'data', 'settings.json')

export async function POST() {
  try {
    const defaultSettings = {
      override: {
        enabled: false,
        openTime: '06:30',
        closeTime: '16:20'
      }
    }

    await fs.mkdir(path.dirname(settingsFile), { recursive: true })
    await fs.writeFile(settingsFile, JSON.stringify(defaultSettings, null, 2), 'utf-8')

    return NextResponse.json({ success: true, settings: defaultSettings })
  } catch (err) {
    console.error('❌ reset-default error:', err)
    return NextResponse.json(
      { error: 'ไม่สามารถรีเซ็ตค่าเริ่มต้นได้' },
      { status: 500 }
    )
  }
}

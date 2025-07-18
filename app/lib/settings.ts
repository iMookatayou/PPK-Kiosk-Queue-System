import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json')

export async function GET() {
  try {
    const json = await readFile(SETTINGS_PATH, 'utf-8')
    const settings = JSON.parse(json)
    return NextResponse.json(settings)
  } catch (err) {
    console.error('โหลด settings ล้มเหลว:', err)
    return NextResponse.json({ error: 'ไม่สามารถโหลด settings ได้' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()

    // ตรวจสอบว่า override ส่งมาถูกต้องไหม
    const override = body.override
    const hasOverrideToggle = typeof override?.enabled === 'boolean'

    if (!hasOverrideToggle) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง: ต้องระบุ override.enabled' }, { status: 400 })
    }

    // โหลด settings ปัจจุบัน
    const currentJson = await readFile(SETTINGS_PATH, 'utf-8')
    const currentSettings = JSON.parse(currentJson)

    const newSettings = {
      ...currentSettings,
      override: {
        enabled: override.enabled,
        openTime: override.openTime ?? currentSettings.override?.openTime ?? '06:30',
        closeTime: override.closeTime ?? currentSettings.override?.closeTime ?? '16:20'
      }
    }

    await writeFile(SETTINGS_PATH, JSON.stringify(newSettings, null, 2), 'utf-8')

    return NextResponse.json({ message: 'บันทึกสำเร็จ', settings: newSettings })
  } catch (err) {
    console.error('อัปเดต settings ล้มเหลว:', err)
    return NextResponse.json({ error: 'ไม่สามารถบันทึก settings ได้' }, { status: 500 })
  }
}

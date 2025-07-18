import { autoResetOnStartup } from '@/lib/queue-server-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await autoResetOnStartup()

    if (result) {
      return NextResponse.json({
        success: true,
      })
    } else {
      return NextResponse.json({
        success: false,
        msg: '⚠️ คิวปัจจุบันยังไม่หมดเวลา ไม่ต้องรีเซ็ต'
      })
    }
  } catch (err) {
    console.error('[RESET_API_ERROR]', err)
    return NextResponse.json(
      {
        success: false,
        msg: '❌ เกิดข้อผิดพลาดระหว่างรีเซ็ตคิว',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}

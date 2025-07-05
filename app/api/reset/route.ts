// app/api/reset-check/route.ts
import { NextResponse } from 'next/server'
import { autoResetOnStartup } from '@/lib/queue-server-admin'

export async function GET() {
  try {
    const didReset = await autoResetOnStartup()
    return NextResponse.json({ ok: true, reset: didReset }) // <== เพิ่มตรงนี้
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as any).message || 'Unknown error' },
      { status: 500 }
    )
  }
}

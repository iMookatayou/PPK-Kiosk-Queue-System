// app/api/queue/latest/route.ts
import { NextResponse } from 'next/server'
import { getLastQueue } from '@/lib/queue-server-admin'

export async function GET() {
  try {
    const lastQueue = await getLastQueue()
    return NextResponse.json({ ok: true, lastQueue })
  } catch (err) {
    console.error('[GET_LATEST_QUEUE_ERROR]', err)
    return NextResponse.json(
      { ok: false, error: 'ไม่สามารถดึงคิวล่าสุดได้' },
      { status: 500 }
    )
  }
}

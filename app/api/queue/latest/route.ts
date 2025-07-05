// app/api/queue/latest/route.ts

import { NextResponse } from 'next/server'
import { getLastQueue } from '@/lib/queue-server-admin'

export async function GET() {
  try {
    const lastQueue = await getLastQueue()
    return NextResponse.json({ lastQueue })
  } catch (err) {
    console.error('[GET_LATEST_QUEUE_ERROR]', err)
    return NextResponse.json({ error: 'ดึงคิวล่าสุดล้มเหลว' }, { status: 500 })
  }
}

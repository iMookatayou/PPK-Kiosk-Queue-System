import { NextRequest, NextResponse } from 'next/server'
import { updateQueueFromAdmin } from '@/lib/queue-server-admin'

export async function POST(req: NextRequest) {
  try {
    const { newQueue } = await req.json()

    if (typeof newQueue !== 'number' || isNaN(newQueue) || newQueue < 0) {
      return NextResponse.json({ error: 'หมายเลขคิวไม่ถูกต้อง' }, { status: 400 })
    }

    console.log('[API] รับค่าคิวใหม่:', newQueue)

    await updateQueueFromAdmin(newQueue)

    return NextResponse.json({
      message: 'อัปเดตคิวสำเร็จ',
      newQueue,
    })
  } catch (err: any) {
    console.error('[ADMIN-UPDATE ERROR]', err)
    return NextResponse.json(
      { error: err?.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    )
  }
}

// app/api/dataqueue/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ฟังก์ชัน normalize: แปลง '2025-07-17' → Date.UTC(2025, 6, 17)
function parseDateToUTC(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)) // เวลา 00:00 UTC
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 📊 เคส: Dashboard fetch ช่วงเวลา
    if (body.startDate !== undefined && body.endDate !== undefined) {
      console.log('[API] ⏱️ startDate =', body.startDate)
      console.log('[API] ⏱️ endDate =', body.endDate)

      const start = parseDateToUTC(body.startDate)
      const end = parseDateToUTC(body.endDate)

      const data = await prisma.dataQueue.findMany({
        where: { date: { gte: start, lte: end } },
        orderBy: { date: 'asc' },
      })

      console.log('✅ fetched rows:', data.length)
      return NextResponse.json(data)
    }

    // 🧩 เคส: บันทึกข้อมูลจาก reset หรือ admin
    const {
      date,
      lastQueue,
      previousQueue = 0,
      source = 'manual',
      location = null,
    } = body

    if (!date || lastQueue === undefined) {
      return NextResponse.json({ error: 'Missing date or lastQueue' }, { status: 400 })
    }

    const parsedDate = parseDateToUTC(date)

    const record = await prisma.dataQueue.upsert({
      where: { date: parsedDate },
      update: { lastQueue, previousQueue, source, location },
      create: {
        date: parsedDate,
        lastQueue,
        previousQueue,
        source,
        location,
      },
    })

    return NextResponse.json(record)

  } catch (err) {
    console.error('[API] ❌ ERROR:', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด', detail: err }, { status: 500 })
  }
}

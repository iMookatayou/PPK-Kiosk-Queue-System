// app/api/queue-stats/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const data = await prisma.dataQueue.findMany({
    orderBy: { date: 'asc' }
  })

  const formatted = data.map((item: {
    date: Date
    lastQueue: number | null
    previousQueue: number | null
  }) => ({
    date: item.date.toISOString().split('T')[0],
    lastQueue: item.lastQueue ?? 0,
    previous: item.previousQueue
      ? {
          queue: item.previousQueue,
          label: `หมายเลขคิวก่อนรีเซ็ตคือ ${item.previousQueue}`,
        }
      : undefined,
  }))

  return NextResponse.json(formatted)
}

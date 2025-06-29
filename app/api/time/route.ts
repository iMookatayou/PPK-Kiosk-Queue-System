import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export async function GET() {
  const timeInBangkok = dayjs().tz('Asia/Bangkok')

  return NextResponse.json({
    iso: timeInBangkok.toISOString(),
    formatted: timeInBangkok.format('YYYY-MM-DD HH:mm:ss'),
    unix: timeInBangkok.unix(),
    timezone: 'Asia/Bangkok'
  })
}

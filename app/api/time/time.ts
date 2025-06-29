import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const timeInBangkok = dayjs().tz('Asia/Bangkok')
  res.status(200).json({
    iso: timeInBangkok.toISOString(),
    formatted: timeInBangkok.format('YYYY-MM-DD HH:mm:ss'),
    unix: timeInBangkok.unix(),
    timezone: 'Asia/Bangkok'
  })
}

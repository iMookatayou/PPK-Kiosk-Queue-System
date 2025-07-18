import { NextRequest, NextResponse } from 'next/server'

function formatThaiDate(thaiDateStr: string | undefined): string | null {
  if (!thaiDateStr || thaiDateStr.length !== 8) return null
  try {
    const yyyy = parseInt(thaiDateStr.slice(0, 4), 10) - 543
    const mm = thaiDateStr.slice(4, 6)
    const dd = thaiDateStr.slice(6, 8)
    return `${dd}/${mm}/${yyyy}`
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const cid = url.pathname.split('/').pop()

  if (!cid || cid.length !== 13) {
    return NextResponse.json({ error: 'Invalid CID' }, { status: 400 })
  }

  const backendURL = `http://172.16.78.22/nhso/api/v1/searchCurrentByPID/${cid}`

  try {
    const res = await fetch(backendURL, { cache: 'no-store' })

    if (!res.ok) {
      return NextResponse.json({ error: 'ไม่สามารถเชื่อมต่อระบบสิทธิได้' }, { status: res.status })
    }

    const data = await res.json()
    const info = data?.data || {}

    // ✅ รีบตอบทันทีถ้าไม่มีสิทธิ
    if (!info.maininscl) {
      return NextResponse.json({
        status: 'not_found',
        message: 'ไม่พบข้อมูลสิทธิของเลขบัตรประชาชนนี้ในระบบ',
        cid,
      }, { status: 200 })
    }

    const typeCode = info.maininscl_main?.trim() || ''
    const typeName = info.maininscl_name?.trim() || null
    const hospital = info.hmain_name?.trim() || null
    const startDate = formatThaiDate(info.startdate)
    const expDate = formatThaiDate(info.expdate)

    const fullDescription = typeName
      ? `(${typeCode}) ${typeName}${hospital ? ` (${hospital})` : ''}`
      : null

    return NextResponse.json({
      status: 'success',
      cid,
      insuranceCode: info.maininscl || null,
      insuranceType: fullDescription,
      registeredHospital: hospital,
      startDate,
      expDate,
      raw: data,
    }, { status: 200 })

  } catch (err) {
    console.error('[API ERROR]', err)
    return NextResponse.json({
      status: 'unreachable',
      message: 'ไม่สามารถเชื่อมต่อกับระบบสิทธิได้ในขณะนี้ กรุณาลองใหม่ภายหลัง',
    }, { status: 504 })
  }
}

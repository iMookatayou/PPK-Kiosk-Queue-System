import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// ตัวอย่าง users mock ในระบบ (สามารถเปลี่ยนเป็น DB ได้)
const users = [
  {
    username: 'admin',
    passwordHash: bcrypt.hashSync('123456', 10), // 🔐 เปลี่ยนรหัสตรงนี้
  },
]

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    const user = users.find((u) => u.username === username)
    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้งาน' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }

    return NextResponse.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ' })
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 })
  }
}

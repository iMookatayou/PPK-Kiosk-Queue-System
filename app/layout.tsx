// app/layout.tsx
import './globals.css'
import { autoResetOnStartup } from '@/lib/queue-server-admin' // เลี่ยนชื่อและ path

export const metadata = {
  title: 'ตู้กดหมายเลขรับบริการ',
  description: 'ค้นหาข้อมูลผู้ป่วยด้วย HN',
}

export default async function RootLayout({  
  children,
}: {
  children: React.ReactNode
}) {
  await autoResetOnStartup() // เรียกใช้ตัวที่มีจริง
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}

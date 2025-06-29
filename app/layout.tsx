// app/layout.tsx

import React from 'react'; // 👈 แก้จุดนี้!
import './globals.css'

export const metadata = {
  title: 'ตู้กดหมายเลขรับบริการ',
  description: 'ค้นหาข้อมูลผู้ป่วยด้วย HN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

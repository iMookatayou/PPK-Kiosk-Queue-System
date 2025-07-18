// layout.tsx ในโฟลเดอร์ /admin
export const metadata = {
  title: 'Admin Page',
  description: 'หน้าจัดการระบบโดยแอดมิน',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

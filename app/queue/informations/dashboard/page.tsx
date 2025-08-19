'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// import DashboardPage แบบไม่ใช้ SSR
const DashboardPage = dynamic(() => import('./DashboardPage'), { ssr: false })

export default function QueueDashboardPageWrapper() {
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const role = sessionStorage.getItem('role') // 'admin' | 'user' | null
    if (role === 'admin' || role === 'user') {
      setAuthorized(true)
    } else {
      router.replace('/queue/informations/login') // redirect ถ้าไม่มี role เลย
    }
  }, [router])

  if (!authorized) return null
  return <DashboardPage />
}

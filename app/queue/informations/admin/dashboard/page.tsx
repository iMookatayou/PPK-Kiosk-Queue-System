'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// เปลี่ยนชื่อที่ import มาเป็นชื่ออื่น เพื่อไม่ชนกับ component หลัก
const DashboardPage = dynamic(() => import('./DashboardPage'), { ssr: false })

export default function QueueDashboardPageWrapper() {
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (isAdmin === 'true') {
      setAuthorized(true)
    } else {
      router.replace('/queue/informations/login') // redirect ถ้าไม่ใช่ admin
    }
  }, [router])

  if (!authorized) return null
  return <DashboardPage />
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminContent from './AdminContent'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (isAdmin === 'true') {
      setAuthorized(true)
    } else {
      // redirect if not logged in
      router.replace('/queue/informations/login')
    }
  }, [router])

  if (!authorized) return null
  return <AdminContent />
}

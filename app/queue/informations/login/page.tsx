'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { users } from '@/api/utils/mockuser'
import styles from './Login.module.css'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const hashedPassword = await hashPassword(password)

    const matchedUser = users.find(
      (user) => user.username === 'admin' && user.password === hashedPassword
    )

    if (matchedUser) {
      sessionStorage.setItem('isAdmin', 'true')
      router.push('/queue/informations/admin')
    } else {
      setError('รหัสผ่านไม่ถูกต้อง')
    }
  }

  return (
    <div className={styles['login-layout']}>
      <div className={styles['login-card']}>
        <h2 className={styles['login-title']}>เข้าสู่ระบบผู้ดูแล</h2>
        <form onSubmit={handleLogin}>
          <div className={styles['input-wrapper']}>
            <Lock className={styles.icon} size={20} />
            <input
              type="password"
              className={styles['password-input']}
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className={styles['error-message']}>{error}</p>}
          <button type="submit" className={styles['login-button']}>
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  )
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { users } from '@/api/utils/mockuser' // ให้ตรงชื่อไฟล์จริง (case-sensitive)
import styles from './Login.module.css'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // ป้องกันโฟกัสออโต้
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('กรอกชื่อผู้ใช้และรหัสผ่าน')
      return
    }

    setLoading(true)
    try {
      const hashedPassword = await sha256Hex(password)

      const matchedUser = users.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() &&
          u.password === hashedPassword
      )

      if (!matchedUser) {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
        return
      }

      // เก็บ session
      sessionStorage.setItem('role', matchedUser.role)
      sessionStorage.setItem('isAdmin', String(matchedUser.role === 'admin'))
      sessionStorage.setItem('username', matchedUser.username)

      // route ตาม role
      if (matchedUser.role === 'admin') {
        router.push('/queue/informations/admin')
      } else {
        router.push('/queue/informations/dashboard')
      }
    } catch {
      setError('เกิดข้อผิดพลาดระหว่างล็อกอิน')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/queue/informations')
  }

  return (
    <div className={styles['login-layout']}>
      <div className={styles['login-card']}>
        <h2 className={styles['login-title']}>เข้าสู่ระบบ</h2>
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className={styles['input-wrapper']}>
            <span className={styles.icon}>@</span>
            <input
              type="text"
              className={styles['password-input']}
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
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

          <div className={styles['button-group']}>
            <button
              type="submit"
              className={styles['main-button']}
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
            </button>
            <button
              type="button"
              className={styles['main-button'] + ' ' + styles['back']}
              onClick={handleBack}
              disabled={loading}
            >
              ย้อนกลับ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/** hash ด้วย Web Crypto ให้ได้ sha256 แบบ hex */
async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  const bytes = Array.from(new Uint8Array(buf))
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
}

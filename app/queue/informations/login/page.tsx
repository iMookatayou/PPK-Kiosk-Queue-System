'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { users } from '@/api/utils/mockuser'
import styles from './Login.module.css'
import { createHash } from 'crypto'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const blockEvent = (e: Event) => {
      const target = e.target as HTMLElement;
      const isAllowed =
        target.tagName === 'INPUT' || target.tagName === 'BUTTON';
      if (!isAllowed) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('mousedown', blockEvent, true);
    document.addEventListener('mouseup', blockEvent, true);
    document.addEventListener('selectstart', blockEvent, true);
    document.addEventListener('contextmenu', blockEvent, true);

    return () => {
      document.removeEventListener('mousedown', blockEvent, true);
      document.removeEventListener('mouseup', blockEvent, true);
      document.removeEventListener('selectstart', blockEvent, true);
      document.removeEventListener('contextmenu', blockEvent, true);
    };
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('🔐 เริ่มทำการเข้าสู่ระบบ...')

    const hashedPassword = hashPassword(password)
    console.log('รหัสผ่าน (หลังแฮช):', hashedPassword)

    const matchedUser = users.find(
      (user) => user.username === 'admin' && user.password === hashedPassword
    )

    console.log('ผลลัพธ์การจับคู่ผู้ใช้:', matchedUser)

    if (matchedUser) {
      console.log('✅ เข้าสู่ระบบสำเร็จ: เป็นแอดมิน')
      sessionStorage.setItem('isAdmin', 'true')
      router.push('/queue/informations/admin')
    } else {
      console.log('❌ เข้าสู่ระบบไม่สำเร็จ: รหัสผ่านไม่ถูกต้อง')
      setError('รหัสผ่านไม่ถูกต้อง')
    }
  }

  const handleBack = () => {
    router.push('/queue/informations')
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

          <div className={styles['button-group']}>
            <button type="submit" className={styles['login-button']}>
              เข้าสู่ระบบ
            </button>
            <button
              type="button"
              className={styles['back-button']}
              onClick={handleBack}
            >
              ย้อนกลับ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

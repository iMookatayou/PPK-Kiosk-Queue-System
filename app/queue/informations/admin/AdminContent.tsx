'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench, Save, Trash2, LogOut, CheckCircle, Clock, RotateCw, BarChart2 } from 'lucide-react'
import styles from './AdminPage.module.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminPage() {
  const [latestQueue, setLatestQueue] = useState<number | null>(null)
  const [newQueue, setNewQueue] = useState<string>('')
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const [overrideStart, setOverrideStart] = useState<string>('06:30')
  const [overrideEnd, setOverrideEnd] = useState<string>('16:20')
  const router = useRouter()

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (isAdmin !== 'true') {
      router.replace('/queue/informations')
    }

    history.pushState(null, '', location.href)
    const handlePopState = () => {
      sessionStorage.removeItem('isAdmin')
      router.replace('/queue/informations')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const showPopup = (message: string) => {
    setPopupMessage(message)
    setTimeout(() => setPopupMessage(null), 2500)
  }

  const fetchLatestQueue = async () => {
    try {
      const res = await fetch('/api/queue/last-queue')
      const data = await res.json()
      if (res.ok) {
        setLatestQueue(data.lastQueue)
      }
    } catch (err) {
      console.error('Fetch latest queue error:', err)
    }
  }

  const handleUpdateQueue = async () => {
    const parsed = Number(newQueue)
    if (!Number.isInteger(parsed) || parsed < 0) {
      alert('กรุณาใส่หมายเลขคิวที่ถูกต้อง')
      return
    }

    try {
      const res = await fetch('/api/queue/admin-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newQueue: parsed })
      })
      const result = await res.json()
      if (res.ok) {
        showPopup('อัปเดตคิวเรียบร้อยแล้ว')
        setNewQueue('')
        fetchLatestQueue()
      } else {
        alert(result?.error || 'อัปเดตล้มเหลว')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    }
  }

  const handleResetQueue = async () => {
    if (!confirm('ยืนยันล้างคิว?')) return
    try {
      const res = await fetch('/api/queue/admin-reset', { method: 'POST' })
      const result = await res.json()
      if (res.ok) {
        showPopup('ล้างคิวสำเร็จแล้ว')
        fetchLatestQueue()
      } else {
        alert(result?.error || 'ล้างคิวล้มเหลว')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    }
  }

  const fetchOverrideSetting = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (res.ok && data.override) {
        setOverrideStart(data.override.openTime || '06:30')
        setOverrideEnd(data.override.closeTime || '16:20')
      }
    } catch {
      console.warn('โหลด override ล้มเหลว')
    }
  }

  const updateOverrideSetting = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          override: {
            enabled: true,
            openTime: overrideStart,
            closeTime: overrideEnd
          }
        })
      })
      const result = await res.json()
      if (res.ok) {
        showPopup('บันทึกเวลา Override สำเร็จ')
      } else {
        alert(result?.error || 'อัปเดตเวลาไม่สำเร็จ')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    }
  }

  const resetOverrideToDefault = async () => {
    try {
      const res = await fetch('/api/settings/reset-default', { method: 'POST' })
      const result = await res.json()
      if (res.ok) {
        setOverrideStart('06:30')
        setOverrideEnd('16:20')
        // รีเซ็ตค่า override ให้กลับไปใช้ค่า default
        await fetch('/api/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            override: {
              enabled: false,
              openTime: '06:30',
              closeTime: '16:20',
            }
          })
        })
        showPopup('คืนค่าเวลาเริ่มต้นแล้ว')
      } else {
        alert(result?.error || 'คืนค่าเริ่มต้นไม่สำเร็จ')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin')
    router.replace('/queue/informations')
  }

  useEffect(() => {
    fetchLatestQueue()
    fetchOverrideSetting()
    const interval = setInterval(fetchLatestQueue, 5000)
    return () => clearInterval(interval)
  }, [])


  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()

    // ป้องกันการคลิกขวา, เลือกข้อความ, ลากข้อความ
    document.addEventListener('contextmenu', prevent)
    document.addEventListener('selectstart', prevent)
    document.addEventListener('dragstart', prevent)
    
    // ป้องกัน Ctrl+C หรือ Command+C
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault()
      }
    })

    // ป้องกันการคลิกโลโก้
    const logo = document.querySelector('#logo') as HTMLElement | null  // การแคสท์เพื่อให้ TypeScript รู้ว่า logo เป็น HTMLElement
    const preventLogoClick = (e: MouseEvent) => {
      e.preventDefault()  // ป้องกันการทำงานจากการคลิก
    }

    // ตรวจสอบว่า logo มีค่าไม่เป็น null ก่อนที่จะเพิ่ม event listener
    if (logo) {
      logo.addEventListener('click', preventLogoClick)
    }

    // Clean up: ลบ event listener
    return () => {
      document.removeEventListener('contextmenu', prevent)
      document.removeEventListener('selectstart', prevent)
      document.removeEventListener('dragstart', prevent)
      if (logo) {
        logo.removeEventListener('click', preventLogoClick)
      }
    }
  }, [])
  
  return (
    <div className={styles.container}>
      <AnimatePresence>
        {popupMessage && (
          <motion.div
            className={styles.popupWrapper}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className={styles.popupContent}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <CheckCircle className={styles.popupIcon} />
              <div className={styles.popupText}>{popupMessage}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.card}>
        <h1 className={styles.title}>
          <Wrench className={styles.icon} />
          หน้าจัดการ ADMIN
        </h1>

        <p className={styles.queueDisplay}>
          คิวล่าสุด: <strong>{latestQueue ?? '-'}</strong>
        </p>

        <input
          type="number"
          placeholder="ใส่หมายเลขคิวใหม่"
          value={newQueue}
          onChange={(e) => setNewQueue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdateQueue()}
          className={styles.input}
        />

        <div className={styles.buttonGroup}>
          <button
            onClick={handleUpdateQueue}
            className={`${styles.button} ${styles.updateButton}`}
            disabled={!newQueue.trim()}
          >
            <Save size={18} style={{ marginRight: 8 }} />
            บันทึก
          </button>
          <button
            onClick={handleResetQueue}
            className={`${styles.button} ${styles.resetButton}`}
          >
            <Trash2 size={18} style={{ marginRight: 8 }} />
            ล้างคิว
          </button>
        </div>

        <div className={styles.divider} />

          <div className={styles.overrideTimeSection}>
            <label>
              เวลา Override:
              <input
                type="time"
                value={overrideStart}
                onChange={(e) => setOverrideStart(e.target.value)}
                className={styles.timeInput}
              />
              {' - '}
              <input
                type="time"
                value={overrideEnd}
                onChange={(e) => setOverrideEnd(e.target.value)}
                className={styles.timeInput}
              />
            </label>
            <button
              onClick={updateOverrideSetting}
              className={`${styles.button} ${styles.saveTimeButton}`}
              style={{ marginLeft: 8 }}
            >
              <Save size={16} style={{ marginRight: 4 }} />
              บันทึกเวลา
            </button>
            <button
              onClick={resetOverrideToDefault}
              className={`${styles.button} ${styles.resetTimeButton}`}
              style={{ marginLeft: 8 }}
            >
              <RotateCw size={16} style={{ marginRight: 4 }} />
              คืนค่าเริ่มต้น
            </button>
          </div>

          <div className={styles.logoutWrapper}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <LogOut size={18} style={{ marginRight: 6 }} />
              ออกจากระบบ
            </button>
          </div>

          <div className={styles.buttonGroup} style={{ marginTop: '1rem' }}>
            <button
              onClick={() => router.push('/queue/informations/admin/dashboard')}
              className={styles.button}
              style={{ backgroundColor: '#4e73df', color: 'white' }}
            >
              <BarChart2 size={18} style={{ marginRight: 8 }} />
              ดูแดชบอร์ดคิว
            </button>
          </div>
        </div>
      </div>
  )
}

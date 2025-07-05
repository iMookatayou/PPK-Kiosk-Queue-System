'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench, Save, Trash2, LogOut, CheckCircle } from 'lucide-react'
import styles from './AdminPage.module.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminPage() {
  const [latestQueue, setLatestQueue] = useState<number | null>(null)
  const [newQueue, setNewQueue] = useState<string>('')
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
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
      } else {
        console.warn(data?.error || 'ดึงคิวล่าสุดล้มเหลว')
      }
    } catch (err) {
      console.error('Fetch latest queue error:', err)
    }
  }

  const handleUpdateQueue = async () => {
    const parsedQueue = Number(newQueue)
    if (!Number.isInteger(parsedQueue) || parsedQueue < 0) {
      alert('กรุณาใส่หมายเลขคิวที่ถูกต้อง')
      return
    }

    try {
      const res = await fetch('/api/queue/admin-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newQueue: parsedQueue })
      })
      const result = await res.json()
      if (!res.ok) {
        alert(result?.error || 'เกิดข้อผิดพลาด')
      } else {
        showPopup('อัปเดตคิวเรียบร้อยแล้ว')
        fetchLatestQueue()
        setNewQueue('')
      }
    } catch {
      alert('อัปเดตคิวล้มเหลว')
    }
  }

  const handleResetQueue = async () => {
    const confirmed = confirm('ยืนยันล้างคิว?')
    if (!confirmed) return

    try {
      const res = await fetch('/api/queue/admin-reset', { method: 'POST' })
      const result = await res.json()
      if (!res.ok) {
        alert(result?.error || 'เกิดข้อผิดพลาดในการล้างคิว')
      } else {
        showPopup('ล้างคิวสำเร็จแล้ว')
        fetchLatestQueue()
      }
    } catch {
      alert('ล้างคิวล้มเหลว')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin')
    router.replace('/queue/informations')
  }

  useEffect(() => {
    fetchLatestQueue()
    const interval = setInterval(fetchLatestQueue, 5000)
    return () => clearInterval(interval)
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
            transition={{ duration: 0.4, ease: 'easeOut' }}
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
          หน้าจัดการคิว (Admin)
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
          className={`${styles.input} ${styles.inputFont}`}
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

        <div className={styles.logoutWrapper}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} style={{ marginRight: 6 }} />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  )
}

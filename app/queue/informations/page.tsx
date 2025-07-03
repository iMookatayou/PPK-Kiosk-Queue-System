'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Printer, CheckCircle, Menu, X, Shield, Hourglass } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './QueuePage.module.css'
import { addQueue } from '@/lib/queue'

declare global {
  interface Window {
    callback?: (data: any) => void
  }
}

// ดึงเวลาจาก server
const getServerTime = async (): Promise<Date | null> => {
  try {
    const res = await fetch('/api/time')
    const data = await res.json()
    return new Date(data.formatted)
  } catch (err) {
    console.error('⚠️ ใช้เวลา server ไม่ได้:', err)
    return null
  }
}

// ดึงคิวล่าสุดจาก API
const fetchLastQueue = async (): Promise<number> => {
  try {
    const res = await fetch('/api/queue/last-queue')
    const data = await res.json()

    console.log("datafetchlastqueue" ,data);
    
    return data.lastQueue ?? 0
  } catch (err) {
    console.warn('⚠️ ดึงคิวล่าสุดล้มเหลว', err)
    return 0
  }
}

export default function QueuePage() {
  const [clientReady, setClientReady] = useState(false)
  const [queue, setQueue] = useState<number | null>(null)
  const [now, setNow] = useState('')
  const [name, setName] = useState('__________')
  const [birthDate, setBirthDate] = useState('')
  const [age, setAge] = useState(0)
  const [gender, setGender] = useState('-')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [printed, setPrinted] = useState(false)
  const [cardRead, setCardRead] = useState(false)
  const [isReadingCard, setIsReadingCard] = useState(false)
  const [cardMessage, setCardMessage] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [canShowQueueButton, setCanShowQueueButton] = useState(false)
  const [resetMessage, setResetMessage] = useState<string | null>(null)

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const lastCitizenNo = useRef<string | null>(null)
  const router = useRouter()

  const resetPatientData = () => {
    setCardRead(false)
    setCardMessage(null)
    setName('__________')
    setBirthDate('')
    setAge(0)
    setGender('-')
    lastCitizenNo.current = null
  }

 useEffect(() => {
  setClientReady(true)

  const updateTime = async () => {
    const serverDate = await getServerTime()
    if (!serverDate) return

    setNow(serverDate.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }))

    const openTime = new Date(serverDate)
    openTime.setHours(6, 30, 0, 0)

    const closeTime = new Date(serverDate)
    closeTime.setHours(16, 20, 0, 0)

    const nowTime = serverDate.getTime()
    const isOpen = nowTime >= openTime.getTime() && nowTime < closeTime.getTime()
    setCanShowQueueButton(isOpen)
  }

  const checkAutoReset = async () => {
    const serverTime = await getServerTime()
    if (!serverTime) return

    const hour = serverTime.getHours()
    const minute = serverTime.getMinutes()
    const nowHM = hour * 60 + minute
    const isResetTime = nowHM < 390 || nowHM >= 980 // ก่อน 6:30 หรือหลัง 16:20

    if (isResetTime) {
      try {
        const res = await fetch('/api/reset-check') //ไม่ได้ใช้ส่วนของ Api แล้วแต่ยังใช้ฟังส์ชั่นอยู่
        const result = await res.json()
        if (result?.ok && result?.reset === true) {
          const latest = await fetchLastQueue()
          setQueue(latest)
          console.log('[CLIENT RESET] ✅ ระบบรีเซ็ตคิวสำเร็จ และอัปเดต queue =', latest)
        }
      } catch (err) {
      }
    }
  }

  // ทำทันทีเมื่อโหลดหน้า
  fetchLastQueue().then(setQueue)
  updateTime()
  checkAutoReset()

  // ตั้ง interval ต่าง ๆ
  const timer = setInterval(updateTime, 1000) 
  const queueUpdater = setInterval(() => fetchLastQueue().then(setQueue), 15000) // ทุก 15 วินาที
  const autoResetTimer = setInterval(checkAutoReset, 30000) // ทุก 30 วินาที

  return () => {
    clearInterval(timer)
    clearInterval(queueUpdater)
    clearInterval(autoResetTimer)
  }
}, [])

  // กัน Copy / คลิกขวา / Ctrl+C / ลากข้อความ
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()

    document.addEventListener('contextmenu', prevent)
    document.addEventListener('selectstart', prevent)
    document.addEventListener('dragstart', prevent)
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        alert('ไม่อนุญาตให้ Copy เนื้อหา!')
      }
    })

    return () => {
      document.removeEventListener('contextmenu', prevent)
      document.removeEventListener('selectstart', prevent)
      document.removeEventListener('dragstart', prevent)
    }
  }, [])

  useEffect(() => {
    window.callback = (data: any) => {
      setIsReadingCard(false)

      if (data?.CitizenNo) {
        if (data.CitizenNo !== lastCitizenNo.current) {
          console.log(`[thaiid] พบข้อมูลบัตรใหม่: ${data.CitizenNo}`)
          lastCitizenNo.current = data.CitizenNo
          setCardRead(true)

          const fullName = `${data.TitleNameTh || ''} ${data.FirstNameTh || ''} ${data.LastNameTh || ''}`.trim()
          setName(fullName || '__________')
          setBirthDate(data.BirthDate || '')
          setAge(calcAgeFromBirth(data.BirthDate || ''))
          setGender(data.Gender === '1' ? 'ชาย' : data.Gender === '2' ? 'หญิง' : '-')
          setCardMessage('ข้อมูลบัตรของท่านเข้าแล้ว')
        } else {
          console.log('[thaiid] ข้ามการอ่านเพราะเป็นบัตรเดิม')
        }
      } else {
        if (cardRead) {
          console.warn('[thaiid] ❌ บัตรถูกถอดออก')
          resetPatientData()
        }
      }
    }

    const interval = setInterval(() => {
      if (isReadingCard) return
      setIsReadingCard(true)

      const script = document.createElement('script')
      script.src = 'https://localhost:8182/thaiid/read.jsonp?callback=callback&section1=true&section2a=true&section2c=true'
      script.async = true
      document.body.appendChild(script)

      setTimeout(() => {
        try {
          document.body.removeChild(script)
        } catch {}
        setIsReadingCard(false)
      }, 1000)
    }, 1000)

    return () => {
      delete window.callback
      clearInterval(interval)
    }
  }, [cardRead, isReadingCard])

  const handleAddQueue = async () => {
    if (loading || cooldown) return
    setLoading(true)
    setCooldown(true)
    setPrinted(false)

    try {
      const newQueue = await addQueue()
      setQueue(newQueue)
      sessionStorage.setItem('currentQueue', String(newQueue))
      handlePrint(newQueue)
    } catch (e: any) {
      alert(e.message || 'เกิดข้อผิดพลาด')
      setLoading(false)
      setCooldown(false)
    }
  }

  const handlePrint = (queueNumber: number) => {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <link rel="stylesheet" href="/print-kiosk-optimized.css" />
    <title>Print</title></head><body>
    <div class="printArea">
      <div class="headerRow">
        <div class="logoLeft">
          <img src="${location.origin}/images/logoppk.png" class="logo" />
        </div>
        <div class="headerText">
          <div class="topTitle">โรงพยาบาลพระปกเกล้า</div>
          <div class="titleLine">ผู้ป่วยใหม่ / ผิดนัด</div>
          <div class="subtitleLine">อาคารประชาธิปกศักดิเดชน์ 2</div>
          <div class="metaRow">วันเวลา: ${now}</div>
          <div class="queuetoplabel">จุดคัดกรอง</div>
          <div class="queueLabel">หมายเลขรับบริการ</div>
        </div>
      </div>
      <div class="queueBlock"><div class="queueNumber">${queueNumber}</div></div>
      <div class="infoRow"><div><strong>ชื่อ-สกุล:</strong> ${name}</div></div>
      <div class="infoRow"><div><strong>อายุ:</strong> ${age} ปี</div><div><strong>เพศ:</strong> ${gender}</div></div>

      <div class="instructions">
        <p>🕖 จะเริ่มเรียกหมายเลขการให้บริการเวลา 07:00 น.</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li>
            เหนื่อยหอบ แน่นหน้าอก ไข้สูง หน้ามืด →
            <strong>ไปห้องฉุกเฉิน อาคารเทพรัตน์หรือ โทร 1669</strong>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <strong>ไม่พบไข้ + ไอ + ตุ่มน้ำใส</strong>
            </label>
          </li>
        </ul>
      </div>

      <div class="sectionTitle">ส่งห้องตรวจ <span class="smallNote">(เจ้าหน้าที่กรอก)</span></div>
      <div class="checkGrid">${[
        'จิตเวช', 'จักษุ', 'ทันตกรรม', 'ไตเทียม', 'สูติกรรม',
        'คลินิกนอกเวลา', 'คลินิกปรึกษา', 'นิติเวช', 'นรีเวชกรรม', 'ศัลยกรรม',
        'อายุกรรม ชั้น 2', 'ห้องตรวจ 203', 'แพทย์แผนไทย', 'อาชีวเวชกรรม',
        'ศูนย์เมทริกซ์', 'กุมารเวชกรรม', 'ศูนย์โรคหัวใจ', 'หู คอ จมูก',
        'ฉีดยา ชั้น 2', 'อายุรกรรมชั้น 3', 'ศัลยกรรมกระดูก', 'หน่วยตรวจพิเศษชั้น 4',
      ].map(item => `<div><input type="checkbox" /> ${item}</div>`).join('')}</div>

      <div class="otherLine">
        <span>อื่นๆ</span> ......................................................................
      </div>

      <div class="signGroup">
        <span class="label">ลงชื่อผู้คัดกรอง</span>
        <span class="dots">......................................................................</span>
      </div>

      <div class="line"></div>
    </div>
  </body></html>`

    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const doc = iframe.contentWindow?.document
    if (!doc) return

    doc.open()
    doc.write(html)
    doc.close()

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
        document.body.removeChild(iframe)
        setPrinted(true)
        setLoading(false)
        setTimeout(() => setCooldown(false), 1000)
        resetPatientData()
      }, 500)
    }
  }

  const calcAgeFromBirth = (yyyymmdd: string): number => {
    if (!yyyymmdd || yyyymmdd.length !== 8) return 0
    let year = +yyyymmdd.slice(0, 4)
    const month = +yyyymmdd.slice(4, 6) - 1
    const day = +yyyymmdd.slice(6, 8)
    if (year > new Date().getFullYear()) year -= 543
    const birth = new Date(year, month, day)
    const diff = Date.now() - birth.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  const handleAdminClick = () => {
    router.push('/queue/informations/login')
  }

  return (
  <div className="pageBackground">
    <div className={styles.header}>
      {/* ✅ Overlay บล็อกทุกคลิกยกเว้นปุ่มสำคัญ */}
      {clientReady && !canShowQueueButton && (
        <div className={styles.fullScreenBlocker}></div>
      )}

      {/* Hidden Iframe สำหรับพิมพ์ */}
      <iframe ref={iframeRef} style={{ display: 'none' }} title="silent-print" />

      {/* โลโก้ */}
      <div className={styles.logoContainer}>
        <img src="/images/logoppk2.png" alt="โลโก้" className={styles.logo} />
        <h1 className={styles.hospitalName}>โรงพยาบาลพระปกเกล้าจันทบุรี</h1>
      </div>

      {clientReady && (
        <>
          {/* เวลา */}
          <div className={styles.clock}>
            <Clock style={{ marginRight: 8 }} /> เวลาปัจจุบัน: {now}
          </div>

          {/* ข้อความแจ้งผล */}
          {cardMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: 12,
                padding: '8px 16px',
                background: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb',
                borderRadius: 8,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                maxWidth: 480,
              }}
            >
              <CheckCircle size={20} /> {cardMessage}
            </motion.div>
          )}

          {/* กล่องคิว */}
          <div className={styles.card}>
            <div className={styles.queueLabel}>หมายเลขรับบริการล่าสุด</div>
            <div className={styles.queueSlotWrapper}>
              <AnimatePresence mode="wait">
                <motion.div key={queue} className={styles.queueNumber}>
                  {queue ?? '-'}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ✅ ปุ่มรับคิว */}
            <div className={styles.noneselect}>
            {canShowQueueButton ? (
              <motion.button
                onClick={handleAddQueue}
                disabled={loading || cooldown}
                className={`${styles.button} ${!cooldown ? styles.buttonActive : styles.buttonDisabled}`}
                whileTap={{ scale: 0.96 }}
              >
                <Printer size={24} />
                {loading ? 'กำลังพิมพ์...' : 'กดเพื่อรับ'}
              </motion.button>
            ) : (
              <div className={styles.red}>
                <div className={styles.waitingMessage}>
                  <Hourglass size={24} className={styles.hourglassFlip} />
                  <span style={{ marginLeft: 8 }}>
                    ระบบจะเปิดรับคิวเวลา <strong>06:30 น.</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
          </div>

          {/* ✅ ปุ่มเมนู (≡) */}
          <div className={styles.hamburgerWrapper}>
            <button
              className={styles.hamburgerButton}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* ✅ เมนู admin */}
          {menuOpen && (
            <div className={styles.sidebarMenu}>
              <button onClick={handleAdminClick} className={styles.menuItem}>
                <Shield size={18} style={{ marginRight: 8 }} /> ADMIN
              </button>
              {resetMessage && (
                <div className={styles.resetInfo}>{resetMessage}</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  </div>
)
}
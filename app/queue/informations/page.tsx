'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Printer, CheckCircle, Menu, X, Shield, Hourglass } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './QueuePage.module.css'
import { addQueue } from '@/lib/queue'
import { getLastQueue } from '@/lib/queue-server-admin'

declare global {
  interface Window {
    callback?: (data: any) => void
  }
}

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
  getLastQueue().then(setQueue)

  const updateTime = async () => {
  const serverDate = await getServerTime()
  if (!serverDate) return

  setNow(serverDate.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }))

  const openTime = new Date(serverDate)
  openTime.setHours(6, 30, 0, 0) // 06:30:00

  const closeTime = new Date(serverDate)
  closeTime.setHours(16, 20, 0, 0) // 16:20:00

  const nowTime = serverDate.getTime()
  const canOpen = nowTime >= openTime.getTime() && nowTime < closeTime.getTime()

  setCanShowQueueButton(canOpen)
}

  // รีเซ็ตคิวอัตโนมัติทุก 5 นาที พร้อมเช็คผล
  const resetInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/reset')
        const result = await res.json()
        if (result?.ok && result?.reset === true) {
          const latest = await getLastQueue()
          setQueue(latest)
          setResetMessage('ระบบเริ่มคิวใหม่แล้ววันนี้')
          sessionStorage.removeItem('currentQueue')
          updateTime()
        }
      } catch (err) {
        console.warn('[CLIENT] ⚠️ รีเซ็ตไม่สำเร็จ')
      }
    }, 60*1000)

  updateTime()
  const timer = setInterval(updateTime, 1000)
  const queueUpdater = setInterval(() => getLastQueue().then(setQueue), 3000)

  return () => {
    clearInterval(timer)
    clearInterval(queueUpdater)
    clearInterval(resetInterval)
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
      // script.src = 'https://172.16.46.22:8182/thaiid/read.jsonp?callback=callback&section1=true&section2a=true&section2c=true'
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
        <div class="instructions"><p>🕖 จะเริ่มเรียกหมายเลยการให้บริการเวลา 07:00 น.</p><ol>
          <li>เหนื่อยหอบ แน่นหน้าอก ไข้สูง หน้ามืด → <strong>ไปห้องฉุกเฉิน อาคารเทพรัตน์ โทร 1669</strong></li>
          <li>หญิงตั้งครรภ์ (ต่ำ/เกิน 3 เดือน) → <strong>ไปตรวจที่ รพ.สาขาเมือง</strong></li>
        </ol></div>
        <div class="sectionTitle">ส่งห้องตรวจ <span class="smallNote">(เจ้าหน้าที่กรอก)</span></div>
        <div class="checkGrid">${[
          'จิตเวช', 'จักษุ', 'ทันตกรรม', 'ไตเทียม', 'สูติกรรม',
          'คลินิกนอกเวลา', 'คลินิกปรึกษา', 'นิติเวช', 'นรีเวชกรรม', 'ศัลยกรรม',
          'อายุกรรม ชั้น 2', 'ห้องตรวจ 203', 'แพทย์แผนไทย', 'อาชีวเวชกรรม',
          'ศูนย์เมทริกซ์', 'กุมารเวชกรรม', 'ศูนย์โรคหัวใจ', 'หู คอ จมูก',
          'ฉีดยา ชั้น 2', 'ผู้สูงอายุ ชั้น 4', 'ศัลยกรรมกระดูก'
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
        {/* ✅ บล็อกทั้งหน้า ถ้า system ยังไม่เปิด */}
        {clientReady && !canShowQueueButton && (
          <div className={styles.fullScreenBlocker} />
        )}

        <iframe ref={iframeRef} style={{ display: 'none' }} title="silent-print" />

        {/* โลโก้ */}
        <div className={styles.logoContainer}>
          <img src="/images/logoppk2.png" alt="โลโก้" className={styles.logo} />
          <h1 className={styles.hospitalName}>โรงพยาบาลพระปกเกล้าจันทบุรี</h1>
        </div>

        {clientReady && (
          <>
            {/* นาฬิกา */}
            <div className={styles.clock}>
              <Clock style={{ marginRight: 8 }} /> เวลาปัจจุบัน: {now}
            </div>

            {/* ข้อความสำเร็จ */}
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
                  maxWidth: 480
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

            {/* Hamburger menu */}
            <div className={styles.hamburgerWrapper}>
              <button
                className={styles.hamburgerButton}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* เมนู admin */}
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

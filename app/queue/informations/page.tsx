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

const fetchLastQueue = async (): Promise<number> => {
  try {
    const res = await fetch('/api/queue/last-queue')
    const data = await res.json()
    return data.lastQueue ?? 0
  } catch (err) {
    console.warn('⚠️ ดึงคิวล่าสุดล้มเหลว', err)
    return 0
  }
}

const fetchRights = async (
  cid: string | null,
  setInsuranceType: (val: string | null) => void,
  setCardMessage: (msg: string | null) => void,
  setInsuranceDetail: (val: {
    insuranceType: string
    startDate: string
    expDate: string
  } | null) => void
) => {
  if (!cid || cid.trim() === '') {
    console.warn('[สิทธิ] ไม่มีเลขบัตรประชาชน')
    setInsuranceType(null)
    setCardMessage(null)
    setInsuranceDetail(null)
    return
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000) // ⏱ 3 วินาที timeout

  try {
    const res = await fetch(`/api/v1/searchCurrentByPID/${cid}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) throw new Error('ไม่พบข้อมูลสิทธิ')

    const data = await res.json()
    const info = data.raw?.data || {}

    const insclCode = info.maininscl_main?.trim() || info.inscl?.trim() || ''
    const type = info.maininscl_name?.trim() || info.inscl_name?.trim() || '-'
    const hospital = info.hmain_name?.trim() || ''

    const full = `${insclCode ? `(${insclCode}) ` : ''}${type}${hospital ? ` (${hospital})` : ''}`

    const startDate = info.startdate || '-'
    const expDate = info.expdate || '-'

    setInsuranceType(full)
    setCardMessage(`สิทธิ: ${full}`)
    setInsuranceDetail({ insuranceType: full, startDate, expDate })
  } catch (err: any) {
    clearTimeout(timeoutId)

    const isAbort = err.name === 'AbortError' || err.message === '⏰ Timeout'

    if (isAbort) {
      console.warn('[สิทธิ] ดึงข้อมูลล้มเหลวเพราะ timeout (Abort)')
    } else {
      console.error('[สิทธิ] ดึงข้อมูลล้มเหลว:', err)
    }

    setInsuranceType(null)
    setCardMessage('ไม่สามารถตรวจสอบสิทธิได้')
    setInsuranceDetail(null)
  }
}

const formatDate = (yyyymmdd: string): string => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return '-'
  const year = yyyymmdd.substring(0, 4)
  const month = yyyymmdd.substring(4, 6)
  const day = yyyymmdd.substring(6, 8)
  return `${day}/${month}/${year}`
}

export default function QueuePage() {
  const lastCid = useRef<string | null>(null)  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const [clientReady, setClientReady] = useState(false)
  const [hasPrintedQueue, setHasPrintedQueue] = useState(false)
  const [queue, setQueue] = useState<number | null>(null)
  const [now, setNow] = useState('')
  const [name, setName] = useState('__________')
  const [birthDate, setBirthDate] = useState('')
  const [age, setAge] = useState(0)
  const [gender, setGender] = useState('-')
  const [insuranceType, setInsuranceType] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [printed, setPrinted] = useState(false)
  const [cardRead, setCardRead] = useState(false)
  const [isReadingCard, setIsReadingCard] = useState(false)
  const [cardMessage, setCardMessage] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [canShowQueueButton, setCanShowQueueButton] = useState(false)
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [isFetchingRights, setIsFetchingRights] = useState(false)
  const [openTimeStr, setOpenTimeStr] = useState('06:30')
  const [closeTimeStr, setCloseTimeStr] = useState('16:20')
  const [insuranceDetail, setInsuranceDetail] = useState<{
    insuranceType: string
    startDate: string
    expDate: string
  } | null>(null)

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const lastCitizenNo = useRef<string | null>(null)
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

  const resetPatientData = () => {
    setCardRead(false)
    setCardMessage(null)
    setName('__________')
    setBirthDate('')
    setAge(0)
    setGender('-')
    setInsuranceType(null)
    setInsuranceDetail(null)
    setHasPrintedQueue(false) 
    lastCitizenNo.current = null
  }

  const checkOverrideSetting = async () => {
  try {
    const res = await fetch('/api/settings')
    if (!res.ok) throw new Error('โหลด settings ไม่สำเร็จ')

    const data = await res.json()
    const override = data.override ?? {}

    const serverDate = await getServerTime()
    if (!serverDate) {
      setCanShowQueueButton(false)
      return
    }

    // fallback ไปใช้เวลา default ถ้า override ปิด
    const openTimeStr = override.enabled ? override.openTime : '06:30'
    const closeTimeStr = override.enabled ? override.closeTime : '16:20'

    const [openH, openM] = openTimeStr.split(':').map(Number)
    const [closeH, closeM] = closeTimeStr.split(':').map(Number)

    const openTime = new Date(serverDate)
    openTime.setHours(openH, openM, 0, 0)

    const closeTime = new Date(serverDate)
    closeTime.setHours(closeH, closeM, 0, 0)

    const nowTime = serverDate.getTime()
    const isOpen = nowTime >= openTime.getTime() && nowTime < closeTime.getTime()

    setCanShowQueueButton(isOpen)
    setOpenTimeStr(openTimeStr)
    setCloseTimeStr(closeTimeStr)

  } catch (err) {
    console.warn('⚠️ ตรวจสอบเวลาเปิดรับคิวล้มเหลว', err)
    setCanShowQueueButton(false)
  }
}

  useEffect(() => {
    setClientReady(true)

    const updateTime = async () => {
      const serverDate = await getServerTime()
      if (!serverDate) return
      setNow(serverDate.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }))
    }

    let lastResetAt: number | null = null  // ตัวแปรเก็บเวลารีเซ็ตล่าสุด

    const checkAutoReset = async () => {
      const serverTime = await getServerTime()
      if (!serverTime) return

      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        const override = data.override ?? {}

        const openTimeStr = override.enabled ? override.openTime : '06:30'
        const closeTimeStr = override.enabled ? override.closeTime : '16:20'

        const [openH, openM] = openTimeStr.split(':').map(Number)
        const [closeH, closeM] = closeTimeStr.split(':').map(Number)

        const nowHM = serverTime.getHours() * 60 + serverTime.getMinutes()
        const openHM = openH * 60 + openM
        const closeHM = closeH * 60 + closeM

        const isResetTime = nowHM < openHM || nowHM >= closeHM

        // ตรวจสอบการรีเซ็ตว่าได้ทำการรีเซ็ตแล้วในช่วงเวลานี้หรือไม่
        if (isResetTime && (lastResetAt === null || Date.now() - lastResetAt >= 300000)) {  // 300000 ms = 5 minutes
          const res = await fetch('/api/queue/reset')
          const result = await res.json()
          if (result?.success) {
            console.log('[CLIENT RESET] ✅ รีคิวใหม่แล้ว')
            setResetMessage(result.msg)
            lastResetAt = Date.now()  // อัปเดตเวลารีเซ็ตล่าสุด
          } else {
            console.log('[CLIENT RESET] ⚠️ ไม่รีคิวซ้ำ:', result.msg)
          }
        }
      } catch (err) {
        console.error('❌ checkAutoReset ล้มเหลว', err)
      }

      // โหลด queue ล่าสุดทุกครั้ง หลัง reset (หรือไม่ reset ก็ตาม)
      const latest = await fetchLastQueue()
      setQueue(latest)
    }

        fetchLastQueue().then(setQueue)
        checkOverrideSetting()
        checkAutoReset()

        const timeTimer = setInterval(updateTime, 1000)
        const overrideTimer = setInterval(checkOverrideSetting, 5000)
        const queueUpdater = setInterval(() => fetchLastQueue().then(setQueue), 15000)
        const autoResetTimer = setInterval(checkAutoReset, 30000)

        return () => {
          clearInterval(timeTimer)
          clearInterval(overrideTimer)
          clearInterval(queueUpdater)
          clearInterval(autoResetTimer)
        }
      }, [])

      useEffect(() => {
        let cancelled = false;

        const processCardData = (data: any) => {
          setIsReadingCard(false)

          const isPresent = data?.card_present === true
          const cid = data?.CitizenID?.trim() || null

          // ไม่มีบัตร หรือบัตรเสียบแต่ไม่มี cid → ล้างเสมอ
          if (!isPresent || !cid) {
            console.warn('[thaiid] ❌ ไม่มีบัตร หรือบัตรข้อมูลไม่ครบ → ล้างข้อมูล')
            resetPatientData()
            lastCid.current = null
            return
          }

          // ถ้าเป็นบัตรเดิม → ข้าม
          if (cid === lastCid.current) {
            console.log('[thaiid] บัตรเดิม ยังไม่เปลี่ยน')
            return
          }

          // พบข้อมูลบัตรใหม่
          console.log(`[thaiid] ✅ พบข้อมูลบัตรใหม่: ${cid}`)
          lastCid.current = cid
          lastCitizenNo.current = cid
          setCardRead(true)

          const fullName = `${data.TitleNameTh || ''} ${data.FirstNameTh || ''} ${data.LastNameTh || ''}`.trim()
          setName(fullName || '__________')
          setBirthDate(data.BirthDate || '')
          setAge(data.Age || 0)
          setGender(data.Gender === '1' ? 'ชาย' : data.Gender === '2' ? 'หญิง' : '-')

          if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {

              setIsFetchingRights(true);
              fetchRights(cid, setInsuranceType, setCardMessage, setInsuranceDetail)
                .finally(() => {
                  setIsFetchingRights(false);
                });
            }, 500);
            }; 

        // ตั้ง callback
        window.callback = (data: any) => {
          if (!cancelled) processCardData(data);
        };

        // loop ดึงข้อมูลบัตรจาก API ทุก 3 วิ
        const loop = async () => {
          while (!cancelled) {
            if (!isReadingCard) {
              setIsReadingCard(true);

              const script = document.createElement('script');
              script.src = 'http://localhost:5000/get_cid_data?callback=callback&section1=true&section2a=true&section2c=true';
              script.async = true;
              document.body.appendChild(script);

              await new Promise(resolve => setTimeout(resolve, 1000));
              try {
                document.body.removeChild(script);
              } catch {}

              setIsReadingCard(false);
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); 
          }
        };

        loop();

        return () => {
          cancelled = true;
          delete window.callback;
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
      }, []);

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

 const formatThaiDate = (yyyymmdd: string): string => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return '-'
  const y = yyyymmdd.slice(0, 4)
  const m = yyyymmdd.slice(4, 6)
  const d = yyyymmdd.slice(6, 8)
  return `${d}/${m}/${y}`
}

const handlePrint = (queueNumber: number) => {
  const insuranceText = insuranceDetail?.insuranceType || '-'
  const startDate = formatThaiDate(insuranceDetail?.startDate || '')
  const expDate = formatThaiDate(insuranceDetail?.expDate || '')

  const html = `<!DOCTYPE html>
  <html><head><meta charset="utf-8">
    <link rel="stylesheet" href="/print-kiosk-optimized.css" />
    <title>Print</title></head><body>
    <div class="printArea">
      <!-- Header -->
      <div class="headerRow">
        <div class="logoLeft">
          <img src="${location.origin}/images/logoppk.png" class="logo" />
        </div>
        <div class="headerText">
          <div class="topTitle">โรงพยาบาลพระปกเกล้า</div>
          <div class="titleLine">ผู้ป่วยใหม่ / ผิดนัด</div>
          <div class="subtitleLine">อาคารประชาธิปกศักดิเดชน์ 2</div>
          <div class="metaRow">วันเวลา: ${now}</div>
          </div>
      </div>
      
        <div class="centerLabels">
          <div class="queuetoplabel">จุดคัดกรอง</div>
          <div class="queueLabel">หมายเลขรับบริการ</div>
        </div>

    <!-- Queue Number -->
        <div class="queueBlock"><div class="queueNumber">${queueNumber}</div></div>

        <!-- Patient Info -->
        <div class="infoGrid">
          <div class="leftGroup">
            <div><strong>ชื่อ-สกุล:</strong> ${name}</div>
            <div class="inlineRow">
              <span><strong>อายุ:</strong> ${age} ปี</span>
              <span><strong>เพศ:</strong> ${gender}</span>
            </div>
            <div><strong>สิทธิการรักษา:</strong> ${insuranceText}</div>
            <div><strong>วันเริ่มทำสิทธิการรักษา:</strong> ${startDate}</div>
            <div><strong>วันหมดอายุสิทธืการรักษา:</strong> ${expDate}</div>
          </div>
        </div>

      <!-- Instructions -->
    <div class="formSection">
      <div class="instructions">
        <p>จะเริ่มเรียกหมายเลขการให้บริการเวลา 07:00 น.</p>
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

      <!-- Clinic Selection -->
      <div class="sectionTitle">ส่งห้องตรวจ <span class="smallNote">(เจ้าหน้าที่กรอก)</span></div>
      <div class="checkGrid">${[
        'จิตเวช', 'จักษุ', 'ทันตกรรม', 'ไตเทียม', 'สูติกรรม',
        'คลินิกนอกเวลา', 'คลินิกปรึกษา', 'นิติเวช', 'นรีเวชกรรม', 'ศัลยกรรม',
        'อายุกรรม ชั้น 2', 'ห้องตรวจ 203', 'แพทย์แผนไทย', 'อาชีวเวชกรรม',
        'ศูนย์เมทริกซ์', 'กุมารเวชกรรม', 'ศูนย์โรคหัวใจ', 'หู คอ จมูก',
        'ฉีดยา ชั้น 2', 'อายุรกรรมชั้น 3', 'ศัลยกรรมกระดูก', 'หน่วยตรวจพิเศษชั้น 4',
      ].map(item => `<div><input type="checkbox" /> ${item}</div>`).join('')}</div>

      <!-- Other + Signature -->
      <div class="otherLine">
        <span>อื่นๆ</span> ......................................................................
      </div>
      <div class="signGroup">
        <span class="label">ลงชื่อผู้คัดกรอง</span>
        <span class="dots">......................................................................</span>
      </div>

      <div class="line"></div>
    </div>
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
        setHasPrintedQueue(true) 
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
        {/* Overlay ปิดหน้าจอ */}
        {clientReady && !canShowQueueButton && (
          <div className={styles.fullScreenBlocker}></div>
        )}

        {/* Hidden Iframe */}
        <iframe
          ref={iframeRef}
          style={{ display: 'none' }}
          title="silent-print"
        />

        {/* โลโก้ */}
        <div className={styles.logoContainer}>
          <img src="/images/logoppk2.png" alt="โลโก้" className={styles.logo} />
          <div className={styles.hospitalBar}>
            <h1 className={styles.hospitalName}>
              โรงพยาบาลพระปกเกล้าจันทบุรี
              <br />
              <span className={styles.enName}>PHRAPOKKLAO HOSPITAL</span>
            </h1>
          </div>
        </div>

        {/* ✅ พื้นที่ popup เว้นไว้ตลอด */}
        <div className={styles.popupSpace}>
          {typeof cardMessage === 'string' && cardMessage.trim() ? (
            <motion.div
              key="popup"
              className={styles.popupBox}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle />
              <span>{cardMessage}</span>
            </motion.div>
          ) : (
            <motion.div
              className={styles.popupBoxTransparent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.img
                src="/images/credit-card.png"
                alt="เสียบบัตร"
                animate={{ y: [0, -10, 0, -10, 0] }}
                transition={{
                  duration: 2,
                  times: [0, 0.2, 0.4, 0.6, 0.8],
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: 'easeInOut',
                }}
                style={{
                  width: '80px',
                  height: 'auto',
                  margin: '0 auto',
                  display: 'block',
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
              />
            </motion.div>
          )}
        </div>

        {/* เวลา + กล่องคิว */}
        <div className={styles.clockAndCardWrapper}>
          {/* เวลา */}
          <div className={styles.clock}>
            <Clock
              style={{
                marginRight: 8,
                fontSize: '3rem',
                width: '3rem',
                height: '3rem',
              }}
            />
            เวลาปัจจุบัน: {now}
          </div>

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

            {/* Footer ปุ่ม/ข้อความ */}
            <div className={styles.cardFooter}>
              {!canShowQueueButton ? (
                <div className={`${styles.waitingMessage} ${styles.waitingMessageClosed}`}>
                  <Hourglass size={24} className={styles.hourglassFlip} />
                  <span>
                    ระบบจะเปิดเวลา <strong>{openTimeStr} น.</strong>
                    <br />
                    และจะสิ้นสุดเวลา <strong>{closeTimeStr} น.</strong>
                  </span>
                </div>
              ) : cardRead ? (
                !cardMessage ? (
                  <div className={styles.waitingMessage}>
                    <Hourglass size={24} className={styles.hourglassFlip} />
                    <span>กำลังตรวจสอบสิทธิการรักษา…</span>
                  </div>
                ) : (
                  <motion.button
                    onClick={handleAddQueue}
                    disabled={loading || cooldown}
                    className={`${styles.button} ${
                      !cooldown ? styles.buttonActive : styles.buttonDisabled
                    }`}
                    whileTap={{ scale: 0.96 }}
                  >
                    {loading ? 'กำลังพิมพ์...' : 'กดเพื่อรับ'}
                  </motion.button>
                )
              ) : (
                <motion.button
                  onClick={handleAddQueue}
                  disabled={loading || cooldown}
                  className={`${styles.button} ${
                    !cooldown ? styles.buttonActive : styles.buttonDisabled
                  }`}
                  whileTap={{ scale: 0.96 }}
                >
                  {loading ? 'กำลังพิมพ์...' : 'กดเพื่อรับ'}
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* ปุ่มเมนู */}
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
      </div>
    </div>
  );
}

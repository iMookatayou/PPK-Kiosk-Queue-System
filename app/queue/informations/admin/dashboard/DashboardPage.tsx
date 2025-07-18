'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  BarChart as BarChartIcon,
  Table as TableIcon,
  ArrowLeftCircle,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './Dashboard.module.css'

interface QueueRecord {
  date: string
  lastQueue: number
  previousQueue?: number
  source: string
}

interface DisplayQueue {
  date: string
  totalQueues: number
  source: string
}

const TIME_OPTIONS = [
  { label: 'สัปดาห์', days: 7 },
  { label: 'เดือน', days: 30 },
  { label: 'ปี', days: 365 },
  { label: '10 ปี', days: 3650 },
]

export default function QueueDashboard() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [data, setData] = useState<DisplayQueue[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDays, setSelectedDays] = useState<number>(7) // ✅ กำหนดค่า default

  const itemsPerPage = 50
  const router = useRouter()

  // ✅ ตรวจสิทธิ์
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (isAdmin === 'true') {
      setAuthorized(true)
    } else {
      router.replace('/queue/informations/login')
    }
  }, [router])

  // ✅ ตั้งค่า startDate/endDate เริ่มต้น
  useEffect(() => {
    const today = new Date()
    const start = new Date()
    start.setDate(today.getDate() - 7 + 1)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }, [])

  // ✅ Fetch data เมื่อช่วงวันเปลี่ยน
  useEffect(() => {
    if (startDate && endDate) fetchQueueData()
  }, [startDate, endDate])

  const fetchQueueData = async () => {
    try {
      const res = await fetch('/api/dataqueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      })

      const rawData = await res.json()
      if (res.status !== 200) {
        alert(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${rawData?.error || 'Unknown error'}`)
        return
      }

      const formatted: DisplayQueue[] = rawData.map((item: QueueRecord) => {
        const hasReset = item.previousQueue !== undefined && item.previousQueue > 0
        const displayDate = item.date.split('T')[0]
        return {
          date: displayDate,
          totalQueues: hasReset ? item.previousQueue! : item.lastQueue ?? 0,
          source: hasReset ? 'คิวก่อนรีเซ็ต' : 'คิวสุดท้าย',
        }
      })

      setData(formatted)
      setCurrentPage(1)
    } catch {
      alert('ไม่สามารถโหลดข้อมูลได้')
    }
  }

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalQueuesSum = data.reduce((sum, item) => sum + item.totalQueues, 0)

  const handleTimeOptionClick = (days: number) => {
    const today = new Date()
    const start = new Date()
    start.setDate(today.getDate() - days + 1)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
    setSelectedDays(days)
  }

  // ✅ สร้าง chartData ตาม selectedDays
  const chartData = (() => {
    if (data.length === 0) return []

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (selectedDays === 7) {
      return data.filter((item) => {
        const date = new Date(item.date)
        return date >= start && date <= end
      })
    }

    if (selectedDays === 30) {
      const byMonth: Record<string, number> = {}
      data.forEach((item) => {
        const d = new Date(item.date)
        const m = d.getMonth() + 1
        const key = m.toString().padStart(2, '0')
        byMonth[key] = (byMonth[key] || 0) + item.totalQueues
      })
      return Object.entries(byMonth).map(([month, totalQueues]) => ({
        date: `เดือน ${month}`,
        totalQueues,
      }))
    }

    if (selectedDays === 365) {
      const byYear: Record<string, number> = {}
      data.forEach((item) => {
        const y = new Date(item.date).getFullYear().toString()
        byYear[y] = (byYear[y] || 0) + item.totalQueues
      })
      return Object.entries(byYear)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([year, totalQueues]) => ({ date: year, totalQueues }))
    }

    if (selectedDays === 3650) {
      const byGroup: Record<string, number> = {}
      data.forEach((item) => {
        const y = new Date(item.date).getFullYear()
        const bucket = `${Math.floor(y / 2) * 2}-${Math.floor(y / 2) * 2 + 1}`
        byGroup[bucket] = (byGroup[bucket] || 0) + item.totalQueues
      })
      return Object.entries(byGroup)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([range, totalQueues]) => ({ date: range, totalQueues }))
    }

    return data.slice(-50)
  })()

  if (authorized === null) return <p style={{ padding: 20 }}>กำลังตรวจสอบสิทธิ์ผู้ใช้...</p>
  if (!authorized) return null

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.headerActions}>
        <h1 className={styles.dashboardTitle}>
          <BarChartIcon size={24} />
          <span>Dashboard Queue</span>
        </h1>
        <div className={styles.buttonGroup}>
          <button onClick={() => router.push('/queue/informations/admin')} className={styles.actionButton}>
            <ArrowLeftCircle size={16} />
            <span>กลับหน้า Admin</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('isAdmin')
              router.push('/queue/informations')
            }}
            className={styles.actionButton}
          >
            <LogOut size={16} />
            <span>ไปหน้ารับคิว</span>
          </button>
        </div>
      </div>

      <div className={styles.timeOptionGroup}>
        {TIME_OPTIONS.map(({ label, days }) => (
          <button
            key={label}
            className={selectedDays === days ? styles.timeButtonActive : styles.timeButton}
            onClick={() => handleTimeOptionClick(days)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.dateRangeSection}>
        <div className={styles.dateInputGroup}>
          <label htmlFor="startDate">วันที่เริ่มต้น</label>
          <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className={styles.dateInputGroup}>
          <label htmlFor="endDate">วันที่สิ้นสุด</label>
          <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className={styles.chartSection} id="chartSection">
        <h3>กราฟแสดงจำนวนคิว</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 30, right: 20, bottom: 30, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} interval={0} />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="totalQueues" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className={styles.sectionTitle}>
        <TableIcon size={18} style={{ marginRight: 6 }} />
        จำนวนคิวต่อวัน
      </h2>

      {data.length > 0 && (
        <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>
          รวมทั้งหมด <strong>{totalQueuesSum.toLocaleString()}</strong> คิว
        </p>
      )}

      <table className={styles.queueTable}>
        <thead>
          <tr>
            <th>วันที่</th>
            <th>จำนวนคิว</th>
            <th>ประเภท</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>-- ไม่มีข้อมูล --</td>
            </tr>
          ) : (
            paginatedData.map(({ date, totalQueues, source }) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{totalQueues.toLocaleString()} คิว</td>
                <td>{source}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.paginationControls}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            <ChevronsLeft size={16} /> ย้อนกลับ
          </button>
          <span style={{ margin: '0 1rem' }}>หน้า {currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            ถัดไป <ChevronsRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

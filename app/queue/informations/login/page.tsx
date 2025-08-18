'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { users } from '@/api/utils/mockuser'
import styles from './Login.module.css'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const u = username.trim()
    if (!u || !password) {
      setError('กรอกชื่อผู้ใช้และรหัสผ่าน')
      return
    }

    setLoading(true)
    try {
      const hashed = await sha256Hex(password) // ← มี fallback แล้ว

      const matchedUser = users.find(
        (usr) =>
          usr.username.toLowerCase() === u.toLowerCase() &&
          usr.password === hashed
      )

      if (!matchedUser) {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
        return
      }

      // เก็บไว้ฝั่ง client (ถ้ามีโค้ดเดิมต้องใช้)
      sessionStorage.setItem('role', matchedUser.role)
      sessionStorage.setItem('isAdmin', String(matchedUser.role === 'admin'))
      sessionStorage.setItem('username', matchedUser.username)

      // เก็บ cookie ให้ middleware/SSR เห็น
      setCookie('role', matchedUser.role, 1)
      setCookie('username', matchedUser.username, 1)

      // route ตาม role
      if (matchedUser.role === 'admin') {
        router.push('/queue/informations/admin')
      } else {
        router.push('/queue/informations/dashboard')
      }
    } catch (err) {
      console.error(err)
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
              autoComplete="username"
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
              autoComplete="current-password"
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

/** SHA-256 → hex (มี fallback ถ้าไม่มี WebCrypto) */
async function sha256Hex(text: string): Promise<string> {
  // 1) ใช้ Web Crypto ถ้ามี (https หรือ localhost)
  const webCrypto = (globalThis as any)?.crypto?.subtle
  if (webCrypto) {
    const enc = new TextEncoder().encode(text)
    const buf = await webCrypto.digest('SHA-256', enc)
    const bytes = Array.from(new Uint8Array(buf))
    return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  // 2) หากรันฝั่ง server (เช่น SSR) และมี node:crypto ให้ใช้แทน
  //    (โค้ดนี้ปกติไม่ถูกเรียก เพราะหน้านี้เป็น client component)
  try {
    // dynamic require เพื่อไม่ให้ bundler ทะเลาะ
    // @ts-ignore
    const nodeCrypto = (await import('crypto')).createHash
    const h = nodeCrypto('sha256')
    h.update(text)
    return h.digest('hex')
  } catch {
    // 3) Fallback สุดท้าย: Pure JS (ทำงานได้บน http/lan)
    return sha256HexPureJS(text)
  }
}

/** Pure JS SHA-256 (compact) */
function sha256HexPureJS(ascii: string): string {
  // จากอัลกอริทึมมาตรฐาน FIPS 180-4, เวอร์ชันย่อเพื่อฝังใน client
  function rightRotate(n: number, x: number) {
    return (x >>> n) | (x << (32 - n))
  }
  const mathPow = Math.pow
  const maxWord = mathPow(2, 32)
  let result = ''

  const words: number[] = []
  const asciiBitLength = ascii.length * 8

  const hash: number[] = []
  const k: number[] = []
  let primeCounter = 0

  const isPrime = (n: number) => {
    const sqrtN = Math.sqrt(n)
    for (let f = 2; f <= sqrtN; f++) if (n % f === 0) return false
    return true
  }
  const frac = (n: number) => ((n - (n | 0)) * maxWord) | 0

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (isPrime(candidate)) {
      hash[primeCounter] = frac(Math.pow(candidate, 1 / 2))
      k[primeCounter++] = frac(Math.pow(candidate, 1 / 3))
    }
  }

  ascii += '\x80'
  while ((ascii.length % 64) - 56) ascii += '\x00'

  for (let i = 0; i < ascii.length; i++) {
    const j = ascii.charCodeAt(i)
    words[i >> 2] |= j << ((3 - (i % 4)) * 8)
  }
  words[words.length] = (asciiBitLength / maxWord) | 0
  words[words.length] = asciiBitLength

  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16))
    const oldHash = hash.slice(0)

    for (let i = 16; i < 64; i++) {
      const s0 =
        rightRotate(7, w[i - 15]) ^
        rightRotate(18, w[i - 15]) ^
        (w[i - 15] >>> 3)
      const s1 =
        rightRotate(17, w[i - 2]) ^
        rightRotate(19, w[i - 2]) ^
        (w[i - 2] >>> 10)
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0
    }

    let a = hash[0],
      b = hash[1],
      c = hash[2],
      d = hash[3],
      e = hash[4],
      f = hash[5],
      g = hash[6],
      h = hash[7]

    for (let i = 0; i < 64; i++) {
      const s1 = rightRotate(6, e) ^ rightRotate(11, e) ^ rightRotate(25, e)
      const ch = (e & f) ^ (~e & g)
      const temp1 = (h + s1 + ch + k[i] + w[i]) | 0
      const s0 = rightRotate(2, a) ^ rightRotate(13, a) ^ rightRotate(22, a)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const temp2 = (s0 + maj) | 0

      h = g
      g = f
      f = e
      e = (d + temp1) | 0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) | 0
    }

    hash[0] = (hash[0] + a) | 0
    hash[1] = (hash[1] + b) | 0
    hash[2] = (hash[2] + c) | 0
    hash[3] = (hash[3] + d) | 0
    hash[4] = (hash[4] + e) | 0
    hash[5] = (hash[5] + f) | 0
    hash[6] = (hash[6] + g) | 0
    hash[7] = (hash[7] + h) | 0
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255
      result += (b < 16 ? 0 : '') + b.toString(16)
    }
  }
  return result
}

/** ตั้ง cookie ให้ middleware/SSR เห็นได้ */
function setCookie(name: string, value: string, days = 1) {
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
}

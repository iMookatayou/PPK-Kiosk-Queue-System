export const metadata = {
  title: 'Login Page',
  description: 'เข้าสู่หน้า Admin',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  )
}
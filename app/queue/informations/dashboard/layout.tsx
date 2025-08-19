export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#f9fafb',
        fontFamily: 'Sarabun, sans-serif',
      }}
    >
      {children}
    </div>
  )
}

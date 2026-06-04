export const metadata = {
  title: 'AankMilaan Social Manager',
  description: 'AI-powered Social Media Manager for AankMilaan numerology matchmaking app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}

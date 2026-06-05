'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const SocialManager = dynamic(() => import('../components/SocialManager'), { ssr: false })
const LoginPage = dynamic(() => import('../components/LoginPage'), { ssr: false })

export default function Home() {
  const [authState, setAuthState] = useState('checking') // checking | loggedIn | loggedOut

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/check')
      const data = await res.json()
      setAuthState(data.loggedIn ? 'loggedIn' : 'loggedOut')
    } catch {
      setAuthState('loggedOut')
    }
  }

  const handleLogin = () => setAuthState('loggedIn')

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuthState('loggedOut')
  }

  if (authState === 'checking') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0D0A0B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8A7070',
        fontFamily: 'sans-serif',
        fontSize: 14,
      }}>
        🔢 Loading AankMilaan SMM...
      </div>
    )
  }

  if (authState === 'loggedOut') {
    return <LoginPage onLogin={handleLogin} />
  }

  return <SocialManager onLogout={handleLogout} />
}

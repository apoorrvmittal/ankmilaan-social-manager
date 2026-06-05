import { useState } from 'react'

const BRAND = {
  colors: {
    primary: "#C84B31", secondary: "#E8A87C", accent: "#FFD700",
    bg: "#0D0A0B", surface: "#1A1318", card: "#221A1E",
    border: "#3A2830", text: "#F5EDE8", muted: "#8A7070",
  },
}

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.success) {
        onLogin()
      } else {
        setError(data.error || 'Invalid password')
        setPassword('')
      }
    } catch (e) {
      setError('Connection error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: BRAND.colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Nunito', sans-serif",
      padding: 20,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />

      <div style={{
        width: '100%',
        maxWidth: 420,
        background: BRAND.colors.card,
        border: `1px solid ${BRAND.colors.border}`,
        borderRadius: 20,
        padding: '48px 40px',
        boxShadow: '0 24px 80px rgba(200, 75, 49, 0.12)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${BRAND.colors.primary}, ${BRAND.colors.secondary})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 16px',
            boxShadow: `0 8px 32px ${BRAND.colors.primary}44`,
          }}>🔢</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: BRAND.colors.text, marginBottom: 6 }}>
            AankMilaan
          </div>
          <div style={{ fontSize: 14, color: BRAND.colors.muted }}>Social Media Manager</div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: BRAND.colors.border, marginBottom: 32 }} />

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: BRAND.colors.text, marginBottom: 6 }}>
            Welcome back 👋
          </div>
          <div style={{ fontSize: 13, color: BRAND.colors.muted }}>
            Enter your password to access the portal
          </div>
        </div>

        <form onSubmit={handleLogin}>
          {/* Password field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: BRAND.colors.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter portal password"
                autoFocus
                style={{
                  width: '100%',
                  background: BRAND.colors.surface,
                  border: `1px solid ${error ? '#f44336' : BRAND.colors.border}`,
                  borderRadius: 12,
                  padding: '14px 48px 14px 16px',
                  color: BRAND.colors.text,
                  fontSize: 15,
                  outline: 'none',
                  fontFamily: "'Nunito', sans-serif",
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = BRAND.colors.primary}
                onBlur={e => e.target.style.borderColor = error ? '#f44336' : BRAND.colors.border}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: BRAND.colors.muted, fontSize: 18, padding: 0,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {error && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#f44336', display: 'flex', alignItems: 'center', gap: 6 }}>
                ❌ {error}
              </div>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              width: '100%',
              background: loading || !password.trim()
                ? BRAND.colors.border
                : `linear-gradient(135deg, ${BRAND.colors.primary}, #A83020)`,
              color: loading || !password.trim() ? BRAND.colors.muted : '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '15px',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading || !password.trim() ? 'default' : 'pointer',
              fontFamily: "'Nunito', sans-serif",
              transition: 'all 0.2s',
              boxShadow: loading || !password.trim() ? 'none' : `0 4px 20px ${BRAND.colors.primary}44`,
            }}
          >
            {loading ? '🔐 Verifying...' : '🚀 Access Portal'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 28, textAlign: 'center', fontSize: 12, color: BRAND.colors.muted }}>
          🔒 Protected portal · AankMilaan SMM
        </div>
      </div>
    </div>
  )
}

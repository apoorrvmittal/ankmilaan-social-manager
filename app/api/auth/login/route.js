import { NextResponse } from 'next/server'

const SESSION_SECRET = process.env.SESSION_SECRET || 'ankmilaan-smm-secret-key-min32chars!!'

export async function POST(request) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.PORTAL_PASSWORD || 'AankMilaan@SMM2024'

    if (password !== correctPassword) {
      await new Promise(r => setTimeout(r, 800)) // delay brute force
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = Buffer.from(JSON.stringify({ loggedIn: true, ts: Date.now() })).toString('base64')
    const signature = Buffer.from(`${token}.${SESSION_SECRET}`).toString('base64').slice(0, 32)
    const sessionToken = `${token}.${signature}`

    const response = NextResponse.json({ success: true })
    response.cookies.set('smm_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

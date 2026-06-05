import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SESSION_SECRET = process.env.SESSION_SECRET || 'ankmilaan-smm-secret-key-min32chars!!'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('smm_session')?.value
    if (!sessionToken) return NextResponse.json({ loggedIn: false })

    const parts = sessionToken.split('.')
    if (parts.length < 2) return NextResponse.json({ loggedIn: false })

    const signature = parts[parts.length - 1]
    const token = parts.slice(0, -1).join('.')
    const expectedSig = Buffer.from(`${token}.${SESSION_SECRET}`).toString('base64').slice(0, 32)

    if (signature !== expectedSig) return NextResponse.json({ loggedIn: false })
    return NextResponse.json({ loggedIn: true })
  } catch {
    return NextResponse.json({ loggedIn: false })
  }
}

import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const renderId = searchParams.get('id')
  if (!renderId) return NextResponse.json({ error: 'renderId required' }, { status: 400 })

  const res = await fetch(`https://api.creatomate.com/v1/renders/${renderId}`, {
    headers: { 'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}` }
  })
  const data = await res.json()

  // Return everything for debugging
  return NextResponse.json({
    status: data.status,
    url: data.url || null,
    progress: data.progress || 0,
    error: data.error || null,
    errorMessage: data.error_message || data.errorMessage || null,
    snapshot: data.snapshot_url || data.snapshotUrl || null,
    raw: data
  })
}

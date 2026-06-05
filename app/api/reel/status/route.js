import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const renderId = searchParams.get('id')
  if (!renderId) return NextResponse.json({ error: 'renderId required' }, { status: 400 })

  const res = await fetch(`https://api.creatomate.com/v1/renders/${renderId}`, {
    headers: { 'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}` }
  })
  const data = await res.json()

  // If this render is a jpg snapshot, look for the related mp4 render
  if (data.output_format === 'jpg') {
    // Fetch recent renders and find the mp4 with same dimensions/time
    const listRes = await fetch('https://api.creatomate.com/v1/renders?limit=10', {
      headers: { 'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}` }
    })
    const allRenders = await listRes.json()
    
    // Find mp4 render created around same time
    const mp4 = Array.isArray(allRenders) 
      ? allRenders.find(r => r.output_format === 'mp4' && r.id !== renderId)
      : null

    if (mp4) {
      return NextResponse.json({
        status: mp4.status,
        url: mp4.url || null,
        progress: mp4.progress || 0,
        outputFormat: mp4.output_format,
        note: 'switched to mp4 render',
        mp4Id: mp4.id,
      })
    }
  }

  return NextResponse.json({
    status: data.status,
    url: data.output_format === 'mp4' ? data.url : null,
    progress: data.progress || 0,
    errorMessage: data.error_message || null,
    outputFormat: data.output_format,
  })
}

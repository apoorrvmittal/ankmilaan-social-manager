import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const renderId = searchParams.get('id')
  if (!renderId) return NextResponse.json({ error: 'renderId required' }, { status: 400 })

  // Fetch this specific render directly by ID
  const res = await fetch(`https://api.creatomate.com/v1/renders/${renderId}`, {
    headers: { 'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}` }
  })
  const data = await res.json()

  // The URL is the video URL regardless of format - just return it
  return NextResponse.json({
    status: data.status,
    url: data.url || null,
    progress: data.progress || 0,
    errorMessage: data.error_message || null,
    outputFormat: data.output_format,
  })
}

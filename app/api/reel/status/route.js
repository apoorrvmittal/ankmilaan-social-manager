import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const renderId = searchParams.get('id')
  if (!renderId) return NextResponse.json({ error: 'renderId required' }, { status: 400 })

  // Get all renders for this job - the main render + snapshot
  const res = await fetch(`https://api.creatomate.com/v1/renders?limit=10`, {
    headers: { 'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}` }
  })
  const allRenders = await res.json()

  // Find our specific render by ID
  const render = Array.isArray(allRenders) 
    ? allRenders.find(r => r.id === renderId)
    : null

  // If not found in list, fetch directly
  if (!render) {
    const singleRes = await fetch(`https://api.creatomate.com/v1/renders/${renderId}`, {
      headers: { 'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}` }
    })
    const single = await singleRes.json()
    
    // Find the MP4 url - not the jpg snapshot
    const videoUrl = single.output_format === 'mp4' ? single.url : null
    
    return NextResponse.json({
      status: single.status,
      url: videoUrl,
      progress: single.progress || 0,
      errorMessage: single.error_message || null,
      outputFormat: single.output_format,
      raw: single
    })
  }

  const videoUrl = render.output_format === 'mp4' ? render.url : null

  return NextResponse.json({
    status: render.status,
    url: videoUrl,
    progress: render.progress || 0,
    errorMessage: render.error_message || null,
    outputFormat: render.output_format,
  })
}

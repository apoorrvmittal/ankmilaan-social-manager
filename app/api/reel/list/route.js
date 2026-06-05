import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://api.creatomate.com/v1/renders?limit=20', {
    headers: { 'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}` }
  })
  const data = await res.json()
  
  // Return simplified list
  const renders = Array.isArray(data) ? data.map(r => ({
    id: r.id,
    status: r.status,
    format: r.output_format,
    url: r.url,
    created: r.created_at,
    width: r.width,
    height: r.height,
  })) : data

  return NextResponse.json(renders)
}

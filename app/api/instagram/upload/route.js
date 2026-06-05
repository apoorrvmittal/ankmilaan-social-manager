import { NextResponse } from 'next/server'

// Upload image to a temporary public CDN (imgbb) so Instagram can fetch it
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Upload to imgbb for a public URL Instagram can fetch
    const imgbbRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `image=${encodeURIComponent(base64)}`,
      }
    )
    const imgbbData = await imgbbRes.json()

    if (!imgbbData.success) {
      return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
    }

    return NextResponse.json({ 
      url: imgbbData.data.url,
      deleteUrl: imgbbData.data.delete_url 
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

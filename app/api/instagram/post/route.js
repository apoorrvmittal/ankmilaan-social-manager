import { NextResponse } from 'next/server'

const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID || '17841430432226275'
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN

export async function POST(request) {
  try {
    const { imageUrl, caption, mediaType } = await request.json()

    if (!imageUrl || !caption) {
      return NextResponse.json({ error: 'imageUrl and caption are required' }, { status: 400 })
    }

    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.facebook.com/v25.0/${IG_ACCOUNT_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: ACCESS_TOKEN,
        }),
      }
    )
    const container = await containerRes.json()

    if (container.error) {
      return NextResponse.json({ error: container.error.message }, { status: 400 })
    }

    // Step 2: Publish the container
    const publishRes = await fetch(
      `https://graph.facebook.com/v25.0/${IG_ACCOUNT_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: container.id,
          access_token: ACCESS_TOKEN,
        }),
      }
    )
    const published = await publishRes.json()

    if (published.error) {
      return NextResponse.json({ error: published.error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, postId: published.id })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

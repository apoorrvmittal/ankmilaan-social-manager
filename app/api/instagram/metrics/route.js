import { NextResponse } from 'next/server'

const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID || '17841430432226275'
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN

export async function GET() {
  try {
    const profileRes = await fetch(
      `https://graph.facebook.com/v25.0/${IG_ACCOUNT_ID}?fields=username,followers_count,media_count,profile_picture_url,biography&access_token=${ACCESS_TOKEN}`
    )
    const profile = await profileRes.json()

    const now = Math.floor(Date.now() / 1000)
    const weekAgo = now - 7 * 86400

    const insightsRes = await fetch(
      `https://graph.facebook.com/v25.0/${IG_ACCOUNT_ID}/insights?metric=reach,impressions,profile_views&period=day&since=${weekAgo}&until=${now}&access_token=${ACCESS_TOKEN}`
    )
    const insights = await insightsRes.json()

    const mediaRes = await fetch(
      `https://graph.facebook.com/v25.0/${IG_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&limit=10&access_token=${ACCESS_TOKEN}`
    )
    const media = await mediaRes.json()

    return NextResponse.json({ profile, insights, media })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

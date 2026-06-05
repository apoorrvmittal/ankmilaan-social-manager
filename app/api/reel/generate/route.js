import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { name1, name2, lifePathNumber1, lifePathNumber2, compatibilityScore, city } = await request.json()

    const creatomateRes = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: process.env.CREATOMATE_TEMPLATE_ID,
        modifications: {
          "Name-1": name1,
          "Name-2": name2,
          "Life-Path-1": `Life Path ${lifePathNumber1}`,
          "Life-Path-2": `Life Path ${lifePathNumber2}`,
          "Score": `${compatibilityScore}%`,
          "City": city || "India",
          "Tagline": "Matched by the Numbers ✨",
        }
      })
    })

    const renders = await creatomateRes.json()
    if (!creatomateRes.ok) return NextResponse.json({ error: renders.message || 'Render failed' }, { status: 400 })

    return NextResponse.json({ 
      renderId: renders[0]?.id,
      status: renders[0]?.status,
      url: renders[0]?.url || null
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

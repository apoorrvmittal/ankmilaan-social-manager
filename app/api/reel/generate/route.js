import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { name1, name2, lifePathNumber1, lifePathNumber2, compatibilityScore, city } = await request.json()

    const scoreColor = compatibilityScore >= 75 ? '#4CAF50' : compatibilityScore >= 60 ? '#FFD700' : '#C84B31'

    // Use inline source - no template needed!
    const source = {
      output_format: 'mp4',
      width: 1080,
      height: 1920,
      duration: 12,
      frame_rate: 30,
      fill_color: '#0D0A0B',
      elements: [
        // Background
        {
          type: 'rectangle',
          width: '100%',
          height: '100%',
          x: '0%', y: '0%',
          x_anchor: '0%', y_anchor: '0%',
          fill_color: '#1A0810',
        },
        // Top brand
        {
          type: 'text',
          text: '🔢 AankMilaan',
          time: 0, duration: 12,
          x: '50%', y: '6%',
          x_anchor: '50%', y_anchor: '50%',
          width: '85%',
          font_family: 'Playfair Display',
          font_size: '52px',
          font_weight: '700',
          fill_color: '#C84B31',
          text_align: 'center',
        },
        // Tagline
        {
          type: 'text',
          text: 'Numerology Match Reveal ✨',
          time: 0.3, duration: 11.7,
          x: '50%', y: '11%',
          x_anchor: '50%', y_anchor: '50%',
          width: '85%',
          font_size: '32px',
          fill_color: '#E8A87C',
          text_align: 'center',
        },
        // Divider
        {
          type: 'rectangle',
          time: 0.5, duration: 11.5,
          x: '50%', y: '15%',
          x_anchor: '50%', y_anchor: '50%',
          width: '70%', height: '3px',
          fill_color: '#3A2830',
        },
        // Name 1
        {
          type: 'text',
          text: name1,
          time: 1, duration: 11,
          x: '25%', y: '28%',
          x_anchor: '50%', y_anchor: '50%',
          width: '44%',
          font_family: 'Nunito',
          font_size: '56px',
          font_weight: '700',
          fill_color: '#F5EDE8',
          text_align: 'center',
          animations: [{ time: 'start', duration: 0.8, type: 'slide', direction: '270deg', easing: 'quadratic-out' }],
        },
        // Life Path 1
        {
          type: 'text',
          text: `Life Path ${lifePathNumber1}`,
          time: 1.2, duration: 10.8,
          x: '25%', y: '35%',
          x_anchor: '50%', y_anchor: '50%',
          width: '44%',
          font_size: '34px',
          fill_color: '#C84B31',
          text_align: 'center',
        },
        // Heart
        {
          type: 'text',
          text: '💕',
          time: 1.8, duration: 10.2,
          x: '50%', y: '31%',
          x_anchor: '50%', y_anchor: '50%',
          font_size: '72px',
          text_align: 'center',
          animations: [{ time: 'start', duration: 0.5, type: 'scale', easing: 'bounce-out' }],
        },
        // Name 2
        {
          type: 'text',
          text: name2,
          time: 1, duration: 11,
          x: '75%', y: '28%',
          x_anchor: '50%', y_anchor: '50%',
          width: '44%',
          font_family: 'Nunito',
          font_size: '56px',
          font_weight: '700',
          fill_color: '#F5EDE8',
          text_align: 'center',
          animations: [{ time: 'start', duration: 0.8, type: 'slide', direction: '90deg', easing: 'quadratic-out' }],
        },
        // Life Path 2
        {
          type: 'text',
          text: `Life Path ${lifePathNumber2}`,
          time: 1.2, duration: 10.8,
          x: '75%', y: '35%',
          x_anchor: '50%', y_anchor: '50%',
          width: '44%',
          font_size: '34px',
          fill_color: '#C84B31',
          text_align: 'center',
        },
        // Score label
        {
          type: 'text',
          text: 'Compatibility Score',
          time: 3, duration: 9,
          x: '50%', y: '52%',
          x_anchor: '50%', y_anchor: '50%',
          width: '80%',
          font_size: '34px',
          fill_color: '#8A7070',
          text_align: 'center',
          animations: [{ time: 'start', duration: 0.6, type: 'fade' }],
        },
        // Score value
        {
          type: 'text',
          text: `${compatibilityScore}%`,
          time: 3.5, duration: 8.5,
          x: '50%', y: '63%',
          x_anchor: '50%', y_anchor: '50%',
          width: '80%',
          font_family: 'Playfair Display',
          font_size: '180px',
          font_weight: '700',
          fill_color: scoreColor,
          text_align: 'center',
          animations: [{ time: 'start', duration: 0.8, type: 'scale', easing: 'bounce-out' }],
        },
        // City
        {
          type: 'text',
          text: `📍 ${city || 'India'}`,
          time: 4, duration: 8,
          x: '50%', y: '76%',
          x_anchor: '50%', y_anchor: '50%',
          width: '80%',
          font_size: '32px',
          fill_color: '#8A7070',
          text_align: 'center',
        },
        // Divider bottom
        {
          type: 'rectangle',
          time: 4, duration: 8,
          x: '50%', y: '81%',
          x_anchor: '50%', y_anchor: '50%',
          width: '60%', height: '3px',
          fill_color: '#3A2830',
        },
        // CTA
        {
          type: 'text',
          text: 'Find YOUR match on AankMilaan 🔢',
          time: 5, duration: 7,
          x: '50%', y: '88%',
          x_anchor: '50%', y_anchor: '50%',
          width: '82%',
          font_size: '36px',
          font_weight: '700',
          fill_color: '#E8A87C',
          text_align: 'center',
          animations: [{ time: 'start', duration: 0.8, type: 'fade' }],
        },
        {
          type: 'text',
          text: 'ankmilaan.com',
          time: 5.5, duration: 6.5,
          x: '50%', y: '93%',
          x_anchor: '50%', y_anchor: '50%',
          width: '80%',
          font_size: '28px',
          fill_color: '#8A7070',
          text_align: 'center',
        },
      ]
    }

    const res = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ source }])
    })

    const renders = await res.json()

    if (!res.ok) {
      console.error('Creatomate error:', JSON.stringify(renders))
      return NextResponse.json({ error: renders?.message || renders?.[0]?.error || 'Render failed', details: renders }, { status: 400 })
    }

    const render = Array.isArray(renders) ? renders[0] : renders
    return NextResponse.json({
      renderId: render.id,
      status: render.status,
      url: render.url || null,
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

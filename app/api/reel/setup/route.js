import { NextResponse } from 'next/server'

// Creates the AankMilaan Match Reveal template on Creatomate
// Call this ONCE from the browser to get your template ID
export async function POST() {
  try {
    const res = await fetch('https://api.creatomate.com/v1/templates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'AankMilaan Match Reveal Reel',
        source: {
          output_format: 'mp4',
          width: 1080,
          height: 1920,
          duration: 15,
          elements: [
            // Background gradient
            {
              type: 'rectangle',
              track: 1,
              time: 0, duration: 15,
              x: '50%', y: '50%',
              width: '100%', height: '100%',
              fill_color: ['#1A0810', '#0D0A0B', '#2A1020'],
            },
            // Top tagline
            {
              type: 'text',
              track: 2,
              name: 'Tagline',
              time: 0.5, duration: 14,
              text: 'Matched by the Numbers ✨',
              x: '50%', y: '8%',
              width: '85%',
              font_family: 'Playfair Display',
              font_size: '38 vmin',
              font_weight: '700',
              fill_color: '#E8A87C',
              x_alignment: '50%',
              animations: [{ type: 'fade', time: 'start', duration: 1 }]
            },
            // Divider line
            {
              type: 'rectangle',
              track: 2,
              time: 1, duration: 13,
              x: '50%', y: '14%',
              width: '60%', height: '2px',
              fill_color: '#3A2830',
            },
            // Name 1
            {
              type: 'text',
              track: 3,
              name: 'Name-1',
              time: 1, duration: 13,
              text: 'Priya Sharma',
              x: '25%', y: '28%',
              width: '42%',
              font_family: 'Nunito',
              font_size: '52 vmin',
              font_weight: '700',
              fill_color: '#F5EDE8',
              x_alignment: '50%',
              animations: [{ type: 'slide', direction: '270deg', time: 'start', duration: 1 }]
            },
            // Life Path 1
            {
              type: 'text',
              track: 3,
              name: 'Life-Path-1',
              time: 1.2, duration: 13,
              text: 'Life Path 3',
              x: '25%', y: '35%',
              width: '42%',
              font_family: 'Nunito',
              font_size: '30 vmin',
              fill_color: '#C84B31',
              x_alignment: '50%',
            },
            // Heart
            {
              type: 'text',
              track: 4,
              time: 2, duration: 12,
              text: '💕',
              x: '50%', y: '31%',
              font_size: '70 vmin',
              x_alignment: '50%',
              animations: [{ type: 'scale', time: 'start', duration: 0.5, easing: 'bounce-out' }]
            },
            // Name 2
            {
              type: 'text',
              track: 5,
              name: 'Name-2',
              time: 1, duration: 13,
              text: 'Arjun Mehta',
              x: '75%', y: '28%',
              width: '42%',
              font_family: 'Nunito',
              font_size: '52 vmin',
              font_weight: '700',
              fill_color: '#F5EDE8',
              x_alignment: '50%',
              animations: [{ type: 'slide', direction: '90deg', time: 'start', duration: 1 }]
            },
            // Life Path 2
            {
              type: 'text',
              track: 5,
              name: 'Life-Path-2',
              time: 1.2, duration: 13,
              text: 'Life Path 6',
              x: '75%', y: '35%',
              width: '42%',
              font_family: 'Nunito',
              font_size: '30 vmin',
              fill_color: '#C84B31',
              x_alignment: '50%',
            },
            // Score label
            {
              type: 'text',
              track: 6,
              time: 3, duration: 11,
              text: 'Compatibility Score',
              x: '50%', y: '53%',
              width: '80%',
              font_family: 'Nunito',
              font_size: '28 vmin',
              fill_color: '#8A7070',
              x_alignment: '50%',
              animations: [{ type: 'fade', time: 'start', duration: 0.8 }]
            },
            // Score value - BIG
            {
              type: 'text',
              track: 6,
              name: 'Score',
              time: 3.5, duration: 11,
              text: '87%',
              x: '50%', y: '63%',
              width: '80%',
              font_family: 'Playfair Display',
              font_size: '130 vmin',
              font_weight: '700',
              fill_color: '#FFD700',
              x_alignment: '50%',
              animations: [{ type: 'counter', time: 'start', duration: 2 }, { type: 'scale', time: 'start', duration: 0.8, easing: 'bounce-out' }]
            },
            // City
            {
              type: 'text',
              track: 7,
              name: 'City',
              time: 4, duration: 10,
              text: '📍 Mumbai',
              x: '50%', y: '77%',
              width: '80%',
              font_family: 'Nunito',
              font_size: '28 vmin',
              fill_color: '#8A7070',
              x_alignment: '50%',
            },
            // Divider
            {
              type: 'rectangle',
              track: 7,
              time: 4, duration: 10,
              x: '50%', y: '82%',
              width: '60%', height: '2px',
              fill_color: '#3A2830',
            },
            // Brand name
            {
              type: 'text',
              track: 8,
              time: 4.5, duration: 10,
              text: '🔢 AankMilaan',
              x: '50%', y: '87%',
              width: '80%',
              font_family: 'Playfair Display',
              font_size: '40 vmin',
              font_weight: '700',
              fill_color: '#C84B31',
              x_alignment: '50%',
              animations: [{ type: 'fade', time: 'start', duration: 1 }]
            },
            // Tagline bottom
            {
              type: 'text',
              track: 8,
              time: 5, duration: 9,
              text: 'Find your match at AankMilaan.com',
              x: '50%', y: '93%',
              width: '80%',
              font_family: 'Nunito',
              font_size: '22 vmin',
              fill_color: '#E8A87C',
              x_alignment: '50%',
            },
          ]
        }
      })
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Template creation failed', details: data }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      templateId: data.id,
      name: data.name,
      message: `Template created! Add CREATOMATE_TEMPLATE_ID=${data.id} to your Vercel env vars.`
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

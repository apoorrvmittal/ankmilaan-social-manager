import { NextResponse } from 'next/server'

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
        source: JSON.stringify({
          output_format: 'mp4',
          width: 1080,
          height: 1920,
          duration: 15,
          fills: [{ type: 'color', value: '#0D0A0B' }],
          elements: [
            {
              type: 'rectangle',
              width: '100%', height: '100%',
              x: '50%', y: '50%',
              x_anchor: '50%', y_anchor: '50%',
              fills: [{ type: 'color', value: '#1A0810' }]
            },
            {
              type: 'text',
              name: 'Tagline',
              text: 'Matched by the Numbers ✨',
              y: '8%', x: '50%',
              x_anchor: '50%', y_anchor: '50%',
              width: '85%',
              font_family: 'Playfair Display',
              font_size: '7vmin',
              font_weight: '700',
              color: '#E8A87C',
              text_align: 'center'
            },
            {
              type: 'text',
              name: 'Name-1',
              text: 'Name 1',
              x: '25%', y: '28%',
              x_anchor: '50%', y_anchor: '50%',
              width: '42%',
              font_family: 'Nunito',
              font_size: '6vmin',
              font_weight: '700',
              color: '#F5EDE8',
              text_align: 'center'
            },
            {
              type: 'text',
              name: 'Life-Path-1',
              text: 'Life Path 3',
              x: '25%', y: '35%',
              x_anchor: '50%', y_anchor: '50%',
              width: '42%',
              font_family: 'Nunito',
              font_size: '4vmin',
              color: '#C84B31',
              text_align: 'center'
            },
            {
              type: 'text',
              text: '💕',
              x: '50%', y: '31%',
              x_anchor: '50%', y_anchor: '50%',
              font_size: '10vmin',
              text_align: 'center'
            },
            {
              type: 'text',
              name: 'Name-2',
              text: 'Name 2',
              x: '75%', y: '28%',
              x_anchor: '50%', y_anchor: '50%',
              width: '42%',
              font_family: 'Nunito',
              font_size: '6vmin',
              font_weight: '700',
              color: '#F5EDE8',
              text_align: 'center'
            },
            {
              type: 'text',
              name: 'Life-Path-2',
              text: 'Life Path 6',
              x: '75%', y: '35%',
              x_anchor: '50%', y_anchor: '50%',
              width: '42%',
              font_family: 'Nunito',
              font_size: '4vmin',
              color: '#C84B31',
              text_align: 'center'
            },
            {
              type: 'text',
              text: 'Compatibility Score',
              x: '50%', y: '53%',
              x_anchor: '50%', y_anchor: '50%',
              width: '80%',
              font_family: 'Nunito',
              font_size: '4vmin',
              color: '#8A7070',
              text_align: 'center'
            },
            {
              type: 'text',
              name: 'Score',
              text: '87%',
              x: '50%', y: '63%',
              x_anchor: '50%', y_anchor: '50%',
              width: '80%',
              font_family: 'Playfair Display',
              font_size: '20vmin',
              font_weight: '700',
              color: '#FFD700',
              text_align: 'center'
            },
            {
              type: 'text',
              name: 'City',
              text: '📍 India',
              x: '50%', y: '76%',
              x_anchor: '50%', y_anchor: '50%',
              width: '80%',
              font_family: 'Nunito',
              font_size: '4vmin',
              color: '#8A7070',
              text_align: 'center'
            },
            {
              type: 'text',
              text: '🔢 AankMilaan',
              x: '50%', y: '87%',
              x_anchor: '50%', y_anchor: '50%',
              width: '80%',
              font_family: 'Playfair Display',
              font_size: '6vmin',
              font_weight: '700',
              color: '#C84B31',
              text_align: 'center'
            },
            {
              type: 'text',
              name: 'Tagline-Bottom',
              text: 'Find your match at AankMilaan.com',
              x: '50%', y: '93%',
              x_anchor: '50%', y_anchor: '50%',
              width: '80%',
              font_family: 'Nunito',
              font_size: '3vmin',
              color: '#E8A87C',
              text_align: 'center'
            }
          ]
        })
      })
    })

    const data = await res.json()
    
    // Log full response for debugging
    console.log('Creatomate response:', JSON.stringify(data))

    if (data.id) {
      return NextResponse.json({
        success: true,
        templateId: data.id,
        message: `Template created! Add CREATOMATE_TEMPLATE_ID=${data.id} to Vercel env vars.`
      })
    }

    return NextResponse.json({ 
      error: data.message || data.error || 'Template creation failed',
      details: data
    }, { status: 400 })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET - check existing template
export async function GET() {
  try {
    const templateId = process.env.CREATOMATE_TEMPLATE_ID
    if (!templateId) return NextResponse.json({ error: 'No template ID set' })

    const res = await fetch(`https://api.creatomate.com/v1/templates/${templateId}`, {
      headers: { 'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}` }
    })
    const data = await res.json()
    return NextResponse.json({ template: data })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

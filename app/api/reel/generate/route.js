import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { reelType, data } = await request.json()

    let source
    if (reelType === 'how_it_works') source = buildHowItWorksReel()
    else if (reelType === 'numerology_explainer') source = buildNumerologyExplainer(data)
    else source = buildMatchReveal(data)

    // Creatomate expects: POST /v1/renders with body { "source": <JSON string> }

    const res = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source })
    })

    const result = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: JSON.stringify(result) }, { status: 400 })
    }

    const render = Array.isArray(result) ? result[0] : result
    return NextResponse.json({ renderId: render.id, status: render.status, url: render.url || null })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function el(type, props) {
  return { type, ...props }
}

function txt(text, x, y, fontSize, color, extra = {}) {
  return el('text', {
    text, x, y,
    xAnchor: '50%', yAnchor: '50%',
    width: extra.width || '80%',
    fontSize,
    fillColor: color,
    textAlign: extra.textAlign || 'center',
    fontFamily: extra.fontFamily || 'Nunito',
    fontWeight: extra.fontWeight || '400',
    time: extra.time ?? 0,
    duration: extra.duration ?? 15,
    ...( extra.animations ? { animations: extra.animations } : {} )
  })
}

function buildHowItWorksReel() {
  return {
    outputFormat: 'mp4',
    width: 1080,
    height: 1920,
    duration: 15,
    frameRate: 30,
    fillColor: '#0D0A0B',
    elements: [
      el('rectangle', { width: '100%', height: '100%', x: '0%', y: '0%', xAnchor: '0%', yAnchor: '0%', fillColor: '#1A0810' }),
      txt('🔢 AankMilaan', '50%', '6%', '58px', '#C84B31', { fontFamily: 'Playfair Display', fontWeight: '700', duration: 15 }),
      txt('How It Works', '50%', '12%', '38px', '#E8A87C', { duration: 15 }),
      el('rectangle', { x: '50%', y: '16%', xAnchor: '50%', yAnchor: '50%', width: '65%', height: '3px', fillColor: '#3A2830', time: 0, duration: 15 }),

      // Step 1
      txt('📝', '50%', '24%', '80px', '#F5EDE8', { time: 1, duration: 14, animations: [{ time: 'start', duration: 0.5, type: 'scale', easing: 'bounce-out' }] }),
      txt('Step 1', '50%', '30%', '28px', '#C84B31', { fontWeight: '700', time: 1.2, duration: 13 }),
      txt('Enter Your Details', '50%', '35%', '44px', '#F5EDE8', { fontWeight: '700', time: 1.4, duration: 13, animations: [{ time: 'start', duration: 0.6, type: 'fade' }] }),
      txt('Name, date of birth & preferences', '50%', '40%', '28px', '#8A7070', { time: 1.6, duration: 12 }),

      el('rectangle', { x: '50%', y: '44%', xAnchor: '50%', yAnchor: '50%', width: '55%', height: '2px', fillColor: '#2A1820', time: 2, duration: 13 }),

      // Step 2
      txt('🔢', '50%', '50%', '80px', '#F5EDE8', { time: 2, duration: 13, animations: [{ time: 'start', duration: 0.5, type: 'scale', easing: 'bounce-out' }] }),
      txt('Step 2', '50%', '56%', '28px', '#C84B31', { fontWeight: '700', time: 2.2, duration: 12 }),
      txt('Chaldean Numerology', '50%', '61%', '44px', '#F5EDE8', { fontWeight: '700', time: 2.4, duration: 12, animations: [{ time: 'start', duration: 0.6, type: 'fade' }] }),
      txt('We calculate your Life Path number', '50%', '66%', '28px', '#8A7070', { time: 2.6, duration: 11 }),

      el('rectangle', { x: '50%', y: '70%', xAnchor: '50%', yAnchor: '50%', width: '55%', height: '2px', fillColor: '#2A1820', time: 3, duration: 12 }),

      // Step 3
      txt('💕', '50%', '76%', '80px', '#F5EDE8', { time: 3, duration: 12, animations: [{ time: 'start', duration: 0.5, type: 'scale', easing: 'bounce-out' }] }),
      txt('Step 3', '50%', '82%', '28px', '#C84B31', { fontWeight: '700', time: 3.2, duration: 11 }),
      txt('Meet Your Match', '50%', '87%', '44px', '#F5EDE8', { fontWeight: '700', time: 3.4, duration: 11, animations: [{ time: 'start', duration: 0.6, type: 'fade' }] }),
      txt('Download AankMilaan Today!', '50%', '94%', '34px', '#FFD700', { fontWeight: '700', time: 5, duration: 10, animations: [{ time: 'start', duration: 0.8, type: 'fade' }] }),
    ]
  }
}

function buildNumerologyExplainer({ lifePathNumber = 3, traits = [], compatibleWith = [] }) {
  const colors = { 1:'#FF6B6B',2:'#4ECDC4',3:'#FFD700',4:'#95A5A6',5:'#E8A87C',6:'#C84B31',7:'#9C6FDE',8:'#2ECC71',9:'#E74C3C' }
  const color = colors[lifePathNumber] || '#FFD700'

  return {
    outputFormat: 'mp4',
    width: 1080,
    height: 1920,
    duration: 12,
    frameRate: 30,
    fillColor: '#0D0A0B',
    elements: [
      el('rectangle', { width: '100%', height: '100%', x: '0%', y: '0%', xAnchor: '0%', yAnchor: '0%', fillColor: '#1A0810' }),
      txt('🔢 AankMilaan', '50%', '5%', '52px', '#C84B31', { fontFamily: 'Playfair Display', fontWeight: '700' }),
      txt('Life Path Number', '50%', '11%', '36px', '#8A7070'),
      el('rectangle', { x: '50%', y: '15%', xAnchor: '50%', yAnchor: '50%', width: '60%', height: '3px', fillColor: '#3A2830', time: 0, duration: 12 }),

      txt(`${lifePathNumber}`, '50%', '32%', '260px', color, {
        fontFamily: 'Playfair Display', fontWeight: '700', time: 0.8, duration: 11,
        animations: [{ time: 'start', duration: 0.8, type: 'scale', easing: 'bounce-out' }]
      }),

      txt('Your Personality', '50%', '50%', '34px', '#E8A87C', { time: 2, duration: 10 }),
      txt(traits.join('  ·  '), '50%', '56%', '38px', '#F5EDE8', {
        fontWeight: '700', time: 2.5, duration: 9.5,
        animations: [{ time: 'start', duration: 0.6, type: 'fade' }]
      }),

      el('rectangle', { x: '50%', y: '62%', xAnchor: '50%', yAnchor: '50%', width: '60%', height: '3px', fillColor: '#3A2830', time: 3, duration: 9 }),

      txt('Most Compatible With', '50%', '68%', '34px', '#E8A87C', { time: 3.5, duration: 8.5 }),
      txt(compatibleWith.join('   '), '50%', '76%', '88px', color, {
        fontFamily: 'Playfair Display', fontWeight: '700', time: 4, duration: 8,
        animations: [{ time: 'start', duration: 0.8, type: 'scale', easing: 'bounce-out' }]
      }),

      txt('Find your match on AankMilaan 💕', '50%', '87%', '34px', '#FFD700', {
        fontWeight: '700', time: 5, duration: 7,
        animations: [{ time: 'start', duration: 0.8, type: 'fade' }]
      }),
      txt('ankmilaan.com', '50%', '93%', '28px', '#8A7070', { time: 5.5, duration: 6.5 }),
    ]
  }
}

function buildMatchReveal({ name1 = 'Priya', name2 = 'Arjun', lifePathNumber1 = 3, lifePathNumber2 = 6, compatibilityScore = 87, city = 'Mumbai' }) {
  const scoreColor = compatibilityScore >= 75 ? '#4CAF50' : compatibilityScore >= 60 ? '#FFD700' : '#C84B31'
  return {
    outputFormat: 'mp4',
    width: 1080,
    height: 1920,
    duration: 12,
    frameRate: 30,
    fillColor: '#0D0A0B',
    elements: [
      el('rectangle', { width: '100%', height: '100%', x: '0%', y: '0%', xAnchor: '0%', yAnchor: '0%', fillColor: '#1A0810' }),
      txt('🔢 AankMilaan', '50%', '6%', '52px', '#C84B31', { fontFamily: 'Playfair Display', fontWeight: '700' }),
      txt('Numerology Match Reveal ✨', '50%', '12%', '32px', '#E8A87C'),
      el('rectangle', { x: '50%', y: '16%', xAnchor: '50%', yAnchor: '50%', width: '65%', height: '3px', fillColor: '#3A2830', time: 0, duration: 12 }),

      txt(name1, '25%', '27%', '54px', '#F5EDE8', {
        fontWeight: '700', width: '44%', time: 1, duration: 11,
        animations: [{ time: 'start', duration: 0.8, type: 'slide', direction: '270deg', easing: 'quadratic-out' }]
      }),
      txt(`Life Path ${lifePathNumber1}`, '25%', '34%', '32px', '#C84B31', { width: '44%', time: 1.2, duration: 10.8 }),

      txt('💕', '50%', '30%', '70px', '#F5EDE8', {
        time: 1.8, duration: 10.2,
        animations: [{ time: 'start', duration: 0.5, type: 'scale', easing: 'bounce-out' }]
      }),

      txt(name2, '75%', '27%', '54px', '#F5EDE8', {
        fontWeight: '700', width: '44%', time: 1, duration: 11,
        animations: [{ time: 'start', duration: 0.8, type: 'slide', direction: '90deg', easing: 'quadratic-out' }]
      }),
      txt(`Life Path ${lifePathNumber2}`, '75%', '34%', '32px', '#C84B31', { width: '44%', time: 1.2, duration: 10.8 }),

      txt('Compatibility Score', '50%', '51%', '32px', '#8A7070', { time: 3, duration: 9, animations: [{ time: 'start', duration: 0.6, type: 'fade' }] }),
      txt(`${compatibilityScore}%`, '50%', '63%', '176px', scoreColor, {
        fontFamily: 'Playfair Display', fontWeight: '700', time: 3.5, duration: 8.5,
        animations: [{ time: 'start', duration: 0.8, type: 'scale', easing: 'bounce-out' }]
      }),

      txt(`📍 ${city}`, '50%', '76%', '30px', '#8A7070', { time: 4, duration: 8 }),
      el('rectangle', { x: '50%', y: '81%', xAnchor: '50%', yAnchor: '50%', width: '60%', height: '3px', fillColor: '#3A2830', time: 4, duration: 8 }),
      txt('Find YOUR match on AankMilaan 🔢', '50%', '88%', '34px', '#E8A87C', {
        fontWeight: '700', time: 5, duration: 7,
        animations: [{ time: 'start', duration: 0.8, type: 'fade' }]
      }),
      txt('ankmilaan.com', '50%', '93%', '28px', '#8A7070', { time: 5.5, duration: 6.5 }),
    ]
  }
}

import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { reelType, data } = await request.json()

    let source
    if (reelType === 'how_it_works') source = buildHowItWorksReel()
    else if (reelType === 'numerology_explainer') source = buildNumerologyExplainer(data)
    else source = buildMatchReveal(data)

    const res = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source })
    })

    const result = await res.json()
    if (!res.ok) return NextResponse.json({ error: JSON.stringify(result) }, { status: 400 })
    const render = Array.isArray(result) ? result[0] : result
    return NextResponse.json({ renderId: render.id, status: render.status, url: render.url || null })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Valid types: "composition", "text", "shape", "image", "video", "audio"
// Rectangle = type "shape" with path
// Text uses fillColor (not color)

function rect(fillColor, opts = {}) {
  return {
    type: 'shape',
    path: 'M 0 0 L 100 0 L 100 100 L 0 100 L 0 0 Z',
    fillColor,
    width: opts.width || '100%',
    height: opts.height || '100%',
    x: opts.x || '50%',
    y: opts.y || '50%',
    xAnchor: '50%',
    yAnchor: '50%',
    time: opts.time ?? 0,
    duration: opts.duration ?? 15,
  }
}

function txt(text, y, opts = {}) {
  const el = {
    type: 'text',
    text,
    y,
    x: opts.x || '50%',
    xAnchor: '50%',
    yAnchor: '50%',
    width: opts.width || '80%',
    fontSize: opts.fontSize || '40px',
    fontWeight: opts.fontWeight || '400',
    fillColor: opts.color || '#F5EDE8',
    textAlign: 'center',
    xAlignment: '50%',
    time: opts.time ?? 0,
    duration: opts.duration ?? 15,
  }
  if (opts.fontFamily) el.fontFamily = opts.fontFamily
  if (opts.animations) el.animations = opts.animations
  return el
}

function buildHowItWorksReel() {
  return {
    outputFormat: 'mp4',
    width: 1080,
    height: 1920,
    duration: 15,
    frameRate: 30,
    emojiStyle: 'apple',
    elements: [
      rect('#1A0810', { duration: 15 }),
      txt('🔢 AankMilaan', '6%', { fontSize: '58px', fontWeight: '700', color: '#C84B31', fontFamily: 'Playfair Display' }),
      txt('How It Works', '12%', { fontSize: '38px', color: '#E8A87C' }),
      rect('#3A2830', { y: '16%', width: '65%', height: '3px', duration: 15 }),

      txt('📝', '24%', { fontSize: '80px', time: 1, duration: 14, animations: [{ type: 'scale', time: 'start', duration: 0.5, easing: 'bounce-out' }] }),
      txt('Step 1 — Enter Your Details', '32%', { fontSize: '42px', fontWeight: '700', time: 1.3, duration: 13 }),
      txt('Name, date of birth & preferences', '38%', { fontSize: '28px', color: '#8A7070', time: 1.5, duration: 12 }),

      rect('#2A1820', { y: '44%', width: '55%', height: '2px', time: 2, duration: 13 }),

      txt('🔢', '50%', { fontSize: '80px', time: 2, duration: 13, animations: [{ type: 'scale', time: 'start', duration: 0.5, easing: 'bounce-out' }] }),
      txt('Step 2 — Chaldean Numerology', '58%', { fontSize: '42px', fontWeight: '700', time: 2.3, duration: 12 }),
      txt('We calculate your Life Path number', '64%', { fontSize: '28px', color: '#8A7070', time: 2.5, duration: 11 }),

      rect('#2A1820', { y: '70%', width: '55%', height: '2px', time: 3, duration: 12 }),

      txt('💕', '76%', { fontSize: '80px', time: 3, duration: 12, animations: [{ type: 'scale', time: 'start', duration: 0.5, easing: 'bounce-out' }] }),
      txt('Step 3 — Meet Your Match', '84%', { fontSize: '42px', fontWeight: '700', time: 3.3, duration: 11 }),
      txt('Download AankMilaan Today! 🔢', '93%', { fontSize: '32px', fontWeight: '700', color: '#FFD700', time: 5, duration: 10, animations: [{ type: 'fade', time: 'start', duration: 0.8 }] }),
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
    emojiStyle: 'apple',
    elements: [
      rect('#1A0810', { duration: 12 }),
      txt('🔢 AankMilaan', '5%', { fontSize: '52px', fontWeight: '700', color: '#C84B31', fontFamily: 'Playfair Display' }),
      txt('Life Path Number', '11%', { fontSize: '36px', color: '#8A7070' }),
      rect('#3A2830', { y: '15%', width: '60%', height: '3px', duration: 12 }),

      txt(String(lifePathNumber), '32%', { fontSize: '250px', fontWeight: '700', color, fontFamily: 'Playfair Display', time: 0.8, duration: 11, animations: [{ type: 'scale', time: 'start', duration: 0.8, easing: 'bounce-out' }] }),

      txt('Your Personality', '50%', { fontSize: '34px', color: '#E8A87C', time: 2, duration: 10 }),
      txt(traits.join(' · '), '57%', { fontSize: '36px', fontWeight: '700', time: 2.5, duration: 9.5, animations: [{ type: 'fade', time: 'start', duration: 0.6 }] }),

      rect('#3A2830', { y: '63%', width: '60%', height: '3px', time: 3, duration: 9 }),

      txt('Most Compatible With', '68%', { fontSize: '34px', color: '#E8A87C', time: 3.5, duration: 8.5 }),
      txt(compatibleWith.join('   '), '77%', { fontSize: '88px', fontWeight: '700', color, fontFamily: 'Playfair Display', time: 4, duration: 8, animations: [{ type: 'scale', time: 'start', duration: 0.8, easing: 'bounce-out' }] }),

      txt('Find your match on AankMilaan 💕', '87%', { fontSize: '32px', fontWeight: '700', color: '#FFD700', time: 5, duration: 7, animations: [{ type: 'fade', time: 'start', duration: 0.8 }] }),
      txt('ankmilaan.com', '93%', { fontSize: '26px', color: '#8A7070', time: 5.5, duration: 6.5 }),
    ]
  }
}

function buildMatchReveal({ name1='Priya', name2='Arjun', lifePathNumber1=3, lifePathNumber2=6, compatibilityScore=87, city='Mumbai' }) {
  const scoreColor = compatibilityScore >= 75 ? '#4CAF50' : compatibilityScore >= 60 ? '#FFD700' : '#C84B31'
  return {
    outputFormat: 'mp4',
    width: 1080,
    height: 1920,
    duration: 12,
    frameRate: 30,
    emojiStyle: 'apple',
    elements: [
      rect('#1A0810', { duration: 12 }),
      txt('🔢 AankMilaan', '6%', { fontSize: '52px', fontWeight: '700', color: '#C84B31', fontFamily: 'Playfair Display' }),
      txt('Numerology Match Reveal ✨', '12%', { fontSize: '30px', color: '#E8A87C' }),
      rect('#3A2830', { y: '16%', width: '65%', height: '3px', duration: 12 }),

      txt(name1, '27%', { x: '25%', width: '44%', fontSize: '52px', fontWeight: '700', time: 1, duration: 11, animations: [{ type: 'slide', time: 'start', duration: 0.8, direction: '270deg', easing: 'quadratic-out' }] }),
      txt(`Life Path ${lifePathNumber1}`, '34%', { x: '25%', width: '44%', fontSize: '30px', color: '#C84B31', time: 1.2, duration: 10.8 }),

      txt('💕', '30%', { fontSize: '68px', time: 1.8, duration: 10.2, animations: [{ type: 'scale', time: 'start', duration: 0.5, easing: 'bounce-out' }] }),

      txt(name2, '27%', { x: '75%', width: '44%', fontSize: '52px', fontWeight: '700', time: 1, duration: 11, animations: [{ type: 'slide', time: 'start', duration: 0.8, direction: '90deg', easing: 'quadratic-out' }] }),
      txt(`Life Path ${lifePathNumber2}`, '34%', { x: '75%', width: '44%', fontSize: '30px', color: '#C84B31', time: 1.2, duration: 10.8 }),

      txt('Compatibility Score', '51%', { fontSize: '32px', color: '#8A7070', time: 3, duration: 9, animations: [{ type: 'fade', time: 'start', duration: 0.6 }] }),
      txt(`${compatibilityScore}%`, '63%', { fontSize: '170px', fontWeight: '700', color: scoreColor, fontFamily: 'Playfair Display', time: 3.5, duration: 8.5, animations: [{ type: 'scale', time: 'start', duration: 0.8, easing: 'bounce-out' }] }),

      txt(`📍 ${city}`, '76%', { fontSize: '30px', color: '#8A7070', time: 4, duration: 8 }),
      rect('#3A2830', { y: '81%', width: '60%', height: '3px', time: 4, duration: 8 }),
      txt('Find YOUR match on AankMilaan 🔢', '88%', { fontSize: '32px', fontWeight: '700', color: '#E8A87C', time: 5, duration: 7, animations: [{ type: 'fade', time: 'start', duration: 0.8 }] }),
      txt('ankmilaan.com', '93%', { fontSize: '26px', color: '#8A7070', time: 5.5, duration: 6.5 }),
    ]
  }
}

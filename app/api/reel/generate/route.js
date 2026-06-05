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
    console.log('Creatomate response:', JSON.stringify(result))

    if (!res.ok) {
      return NextResponse.json({ error: JSON.stringify(result) }, { status: 400 })
    }

    const render = Array.isArray(result) ? result[0] : result
    return NextResponse.json({ renderId: render.id, status: render.status, url: render.url || null })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Minimal valid Creatomate source - using only documented properties
function baseSource(duration = 12) {
  return {
    outputFormat: 'mp4',
    width: 1080,
    height: 1920,
    duration,
    frameRate: 30,
    backgroundColor: '#0D0A0B',
  }
}

function textEl(text, opts = {}) {
  const el = {
    type: 'text',
    text,
    width: opts.width || '80%',
    height: 'auto',
    x: opts.x || '50%',
    y: opts.y || '50%',
    xAnchor: '50%',
    yAnchor: '50%',
    fontSize: opts.fontSize || '40px',
    fontWeight: opts.fontWeight || '400',
    color: opts.color || '#F5EDE8',
    textAlign: 'center',
  }
  if (opts.fontFamily) el.fontFamily = opts.fontFamily
  if (opts.time !== undefined) el.time = opts.time
  if (opts.duration !== undefined) el.duration = opts.duration
  if (opts.animations) el.animations = opts.animations
  return el
}

function rectEl(opts = {}) {
  return {
    type: 'rectangle',
    x: opts.x || '50%',
    y: opts.y || '50%',
    xAnchor: '50%',
    yAnchor: '50%',
    width: opts.width || '100%',
    height: opts.height || '100%',
    color: opts.color || '#1A0810',
    time: opts.time ?? 0,
    duration: opts.duration ?? 15,
  }
}

function buildHowItWorksReel() {
  return {
    ...baseSource(15),
    elements: [
      rectEl({ color: '#1A0810' }),

      textEl('🔢 AankMilaan', { y: '6%', fontSize: '58px', fontWeight: '700', color: '#C84B31', fontFamily: 'Playfair Display' }),
      textEl('How It Works', { y: '12%', fontSize: '38px', color: '#E8A87C' }),

      textEl('📝', { y: '24%', fontSize: '80px', time: 1, duration: 14, animations: [{ type: 'scale', time: 'start', duration: 0.5, easing: 'bounce-out' }] }),
      textEl('Step 1 — Enter Your Details', { y: '32%', fontSize: '42px', fontWeight: '700', color: '#F5EDE8', time: 1.3, duration: 13 }),
      textEl('Name, date of birth & preferences', { y: '38%', fontSize: '28px', color: '#8A7070', time: 1.5, duration: 12 }),

      textEl('🔢', { y: '50%', fontSize: '80px', time: 2, duration: 13, animations: [{ type: 'scale', time: 'start', duration: 0.5, easing: 'bounce-out' }] }),
      textEl('Step 2 — Chaldean Numerology', { y: '58%', fontSize: '42px', fontWeight: '700', color: '#F5EDE8', time: 2.3, duration: 12 }),
      textEl('We calculate your Life Path number', { y: '64%', fontSize: '28px', color: '#8A7070', time: 2.5, duration: 11 }),

      textEl('💕', { y: '74%', fontSize: '80px', time: 3, duration: 12, animations: [{ type: 'scale', time: 'start', duration: 0.5, easing: 'bounce-out' }] }),
      textEl('Step 3 — Meet Your Match', { y: '82%', fontSize: '42px', fontWeight: '700', color: '#F5EDE8', time: 3.3, duration: 11 }),

      textEl('Download AankMilaan Today! 🔢', { y: '93%', fontSize: '32px', fontWeight: '700', color: '#FFD700', time: 5, duration: 10, animations: [{ type: 'fade', time: 'start', duration: 0.8 }] }),
    ]
  }
}

function buildNumerologyExplainer({ lifePathNumber = 3, traits = [], compatibleWith = [] }) {
  const colors = { 1:'#FF6B6B',2:'#4ECDC4',3:'#FFD700',4:'#95A5A6',5:'#E8A87C',6:'#C84B31',7:'#9C6FDE',8:'#2ECC71',9:'#E74C3C' }
  const color = colors[lifePathNumber] || '#FFD700'

  return {
    ...baseSource(12),
    elements: [
      rectEl({ color: '#1A0810', duration: 12 }),
      textEl('🔢 AankMilaan', { y: '5%', fontSize: '52px', fontWeight: '700', color: '#C84B31', fontFamily: 'Playfair Display' }),
      textEl('Life Path Number', { y: '11%', fontSize: '36px', color: '#8A7070' }),

      textEl(String(lifePathNumber), { y: '31%', fontSize: '250px', fontWeight: '700', color, fontFamily: 'Playfair Display', time: 0.8, duration: 11, animations: [{ type: 'scale', time: 'start', duration: 0.8, easing: 'bounce-out' }] }),

      textEl('Your Personality', { y: '50%', fontSize: '34px', color: '#E8A87C', time: 2, duration: 10 }),
      textEl(traits.join(' · '), { y: '56%', fontSize: '36px', fontWeight: '700', color: '#F5EDE8', time: 2.5, duration: 9.5, animations: [{ type: 'fade', time: 'start', duration: 0.6 }] }),

      textEl('Most Compatible With', { y: '67%', fontSize: '34px', color: '#E8A87C', time: 3.5, duration: 8.5 }),
      textEl(compatibleWith.join('   '), { y: '76%', fontSize: '86px', fontWeight: '700', color, fontFamily: 'Playfair Display', time: 4, duration: 8, animations: [{ type: 'scale', time: 'start', duration: 0.8, easing: 'bounce-out' }] }),

      textEl('Find your match on AankMilaan 💕', { y: '87%', fontSize: '32px', fontWeight: '700', color: '#FFD700', time: 5, duration: 7, animations: [{ type: 'fade', time: 'start', duration: 0.8 }] }),
      textEl('ankmilaan.com', { y: '93%', fontSize: '26px', color: '#8A7070', time: 5.5, duration: 6.5 }),
    ]
  }
}

function buildMatchReveal({ name1 = 'Priya', name2 = 'Arjun', lifePathNumber1 = 3, lifePathNumber2 = 6, compatibilityScore = 87, city = 'Mumbai' }) {
  const scoreColor = compatibilityScore >= 75 ? '#4CAF50' : compatibilityScore >= 60 ? '#FFD700' : '#C84B31'
  return {
    ...baseSource(12),
    elements: [
      rectEl({ color: '#1A0810', duration: 12 }),
      textEl('🔢 AankMilaan', { y: '6%', fontSize: '52px', fontWeight: '700', color: '#C84B31', fontFamily: 'Playfair Display' }),
      textEl('Numerology Match Reveal ✨', { y: '12%', fontSize: '30px', color: '#E8A87C' }),

      textEl(name1, { x: '25%', y: '27%', width: '44%', fontSize: '52px', fontWeight: '700', color: '#F5EDE8', time: 1, duration: 11, animations: [{ type: 'slide', time: 'start', duration: 0.8, direction: '270deg', easing: 'quadratic-out' }] }),
      textEl(`Life Path ${lifePathNumber1}`, { x: '25%', y: '34%', width: '44%', fontSize: '30px', color: '#C84B31', time: 1.2, duration: 10.8 }),

      textEl('💕', { y: '30%', fontSize: '68px', time: 1.8, duration: 10.2, animations: [{ type: 'scale', time: 'start', duration: 0.5, easing: 'bounce-out' }] }),

      textEl(name2, { x: '75%', y: '27%', width: '44%', fontSize: '52px', fontWeight: '700', color: '#F5EDE8', time: 1, duration: 11, animations: [{ type: 'slide', time: 'start', duration: 0.8, direction: '90deg', easing: 'quadratic-out' }] }),
      textEl(`Life Path ${lifePathNumber2}`, { x: '75%', y: '34%', width: '44%', fontSize: '30px', color: '#C84B31', time: 1.2, duration: 10.8 }),

      textEl('Compatibility Score', { y: '51%', fontSize: '32px', color: '#8A7070', time: 3, duration: 9, animations: [{ type: 'fade', time: 'start', duration: 0.6 }] }),
      textEl(`${compatibilityScore}%`, { y: '63%', fontSize: '170px', fontWeight: '700', color: scoreColor, fontFamily: 'Playfair Display', time: 3.5, duration: 8.5, animations: [{ type: 'scale', time: 'start', duration: 0.8, easing: 'bounce-out' }] }),

      textEl(`📍 ${city}`, { y: '76%', fontSize: '30px', color: '#8A7070', time: 4, duration: 8 }),
      textEl('Find YOUR match on AankMilaan 🔢', { y: '87%', fontSize: '32px', fontWeight: '700', color: '#E8A87C', time: 5, duration: 7, animations: [{ type: 'fade', time: 'start', duration: 0.8 }] }),
      textEl('ankmilaan.com', { y: '93%', fontSize: '26px', color: '#8A7070', time: 5.5, duration: 6.5 }),
    ]
  }
}

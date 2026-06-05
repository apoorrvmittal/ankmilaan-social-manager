import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { reelType, data } = await request.json()

    let source

    if (reelType === 'how_it_works') {
      source = buildHowItWorksReel()
    } else if (reelType === 'numerology_explainer') {
      source = buildNumerologyExplainer(data)
    } else {
      source = buildMatchReveal(data)
    }

    const res = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ source: JSON.stringify(source) }])
    })

    const renders = await res.json()

    if (!res.ok) {
      console.error('Creatomate error:', JSON.stringify(renders))
      return NextResponse.json({ 
        error: renders?.message || renders?.[0]?.error || JSON.stringify(renders), 
        details: renders 
      }, { status: 400 })
    }

    const render = Array.isArray(renders) ? renders[0] : renders
    return NextResponse.json({ renderId: render.id, status: render.status, url: render.url || null })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function buildHowItWorksReel() {
  const steps = [
    { icon: '📝', title: 'Enter Your Details', desc: 'Name, date of birth & preferences' },
    { icon: '🔢', title: 'Chaldean Numerology', desc: 'We calculate your Life Path number' },
    { icon: '💫', title: 'AI Matching', desc: 'Algorithm finds compatible partners' },
    { icon: '💕', title: 'Your Perfect Match', desc: 'Connect with your numerology soulmate' },
  ]

  return {
    output_format: 'mp4',
    width: 1080,
    height: 1920,
    duration: 16,
    frame_rate: 30,
    fill_color: '#0D0A0B',
    elements: [
      // Background gradient
      { type: 'rectangle', width: '100%', height: '100%', x: '0%', y: '0%', x_anchor: '0%', y_anchor: '0%', fill_color: '#1A0810' },
      // Brand header
      { type: 'text', text: '🔢 AankMilaan', time: 0, duration: 16, x: '50%', y: '6%', x_anchor: '50%', y_anchor: '50%', width: '85%', font_family: 'Playfair Display', font_size: '60px', font_weight: '700', fill_color: '#C84B31', text_align: 'center' },
      { type: 'text', text: 'How It Works', time: 0.3, duration: 15.7, x: '50%', y: '11%', x_anchor: '50%', y_anchor: '50%', width: '85%', font_size: '36px', fill_color: '#E8A87C', text_align: 'center' },
      { type: 'rectangle', time: 0.5, duration: 15.5, x: '50%', y: '15%', x_anchor: '50%', y_anchor: '50%', width: '65%', height: '3px', fill_color: '#3A2830' },

      // Step 1
      { type: 'text', text: steps[0].icon, time: 1, duration: 14, x: '50%', y: '24%', x_anchor: '50%', y_anchor: '50%', font_size: '80px', text_align: 'center', animations: [{ time: 'start', duration: 0.5, type: 'scale', easing: 'bounce-out' }] },
      { type: 'text', text: '01', time: 1, duration: 14, x: '18%', y: '24%', x_anchor: '50%', y_anchor: '50%', font_size: '28px', fill_color: '#C84B31', font_weight: '700', text_align: 'center' },
      { type: 'text', text: steps[0].title, time: 1.2, duration: 13.8, x: '50%', y: '31%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_family: 'Nunito', font_size: '46px', font_weight: '700', fill_color: '#F5EDE8', text_align: 'center', animations: [{ time: 'start', duration: 0.6, type: 'fade' }] },
      { type: 'text', text: steps[0].desc, time: 1.4, duration: 13.6, x: '50%', y: '36%', x_anchor: '50%', y_anchor: '50%', width: '75%', font_size: '30px', fill_color: '#8A7070', text_align: 'center' },

      // Divider
      { type: 'rectangle', time: 2, duration: 13, x: '50%', y: '41%', x_anchor: '50%', y_anchor: '50%', width: '55%', height: '2px', fill_color: '#2A1820' },

      // Step 2
      { type: 'text', text: steps[1].icon, time: 1.5, duration: 13.5, x: '50%', y: '48%', x_anchor: '50%', y_anchor: '50%', font_size: '80px', text_align: 'center', animations: [{ time: 'start', duration: 0.5, type: 'scale', easing: 'bounce-out' }] },
      { type: 'text', text: '02', time: 1.5, duration: 13.5, x: '18%', y: '48%', x_anchor: '50%', y_anchor: '50%', font_size: '28px', fill_color: '#C84B31', font_weight: '700', text_align: 'center' },
      { type: 'text', text: steps[1].title, time: 1.7, duration: 13.3, x: '50%', y: '55%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_family: 'Nunito', font_size: '46px', font_weight: '700', fill_color: '#F5EDE8', text_align: 'center', animations: [{ time: 'start', duration: 0.6, type: 'fade' }] },
      { type: 'text', text: steps[1].desc, time: 1.9, duration: 13.1, x: '50%', y: '60%', x_anchor: '50%', y_anchor: '50%', width: '75%', font_size: '30px', fill_color: '#8A7070', text_align: 'center' },

      { type: 'rectangle', time: 2.5, duration: 12.5, x: '50%', y: '65%', x_anchor: '50%', y_anchor: '50%', width: '55%', height: '2px', fill_color: '#2A1820' },

      // Step 3
      { type: 'text', text: steps[2].icon, time: 2, duration: 13, x: '50%', y: '71%', x_anchor: '50%', y_anchor: '50%', font_size: '80px', text_align: 'center', animations: [{ time: 'start', duration: 0.5, type: 'scale', easing: 'bounce-out' }] },
      { type: 'text', text: '03', time: 2, duration: 13, x: '18%', y: '71%', x_anchor: '50%', y_anchor: '50%', font_size: '28px', fill_color: '#C84B31', font_weight: '700', text_align: 'center' },
      { type: 'text', text: steps[2].title, time: 2.2, duration: 12.8, x: '50%', y: '78%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_family: 'Nunito', font_size: '46px', font_weight: '700', fill_color: '#F5EDE8', text_align: 'center', animations: [{ time: 'start', duration: 0.6, type: 'fade' }] },
      { type: 'text', text: steps[2].desc, time: 2.4, duration: 12.6, x: '50%', y: '83%', x_anchor: '50%', y_anchor: '50%', width: '75%', font_size: '30px', fill_color: '#8A7070', text_align: 'center' },

      // CTA bottom
      { type: 'text', text: 'Download AankMilaan Today 💕', time: 4, duration: 12, x: '50%', y: '92%', x_anchor: '50%', y_anchor: '50%', width: '82%', font_size: '36px', font_weight: '700', fill_color: '#FFD700', text_align: 'center', animations: [{ time: 'start', duration: 1, type: 'fade' }] },
    ]
  }
}

function buildNumerologyExplainer(data) {
  const { lifePathNumber = 3, traits = ['Creative', 'Expressive', 'Joyful'], compatibleWith = [1, 5, 9] } = data || {}

  const numberColors = { 1:'#FF6B6B', 2:'#4ECDC4', 3:'#FFD700', 4:'#95A5A6', 5:'#E8A87C', 6:'#C84B31', 7:'#9C6FDE', 8:'#2ECC71', 9:'#E74C3C' }
  const color = numberColors[lifePathNumber] || '#FFD700'

  return {
    output_format: 'mp4',
    width: 1080,
    height: 1920,
    duration: 12,
    frame_rate: 30,
    fill_color: '#0D0A0B',
    elements: [
      { type: 'rectangle', width: '100%', height: '100%', x: '0%', y: '0%', x_anchor: '0%', y_anchor: '0%', fill_color: '#1A0810' },
      { type: 'text', text: '🔢 AankMilaan', time: 0, duration: 12, x: '50%', y: '5%', x_anchor: '50%', y_anchor: '50%', width: '85%', font_family: 'Playfair Display', font_size: '52px', font_weight: '700', fill_color: '#C84B31', text_align: 'center' },
      { type: 'text', text: 'Life Path Number', time: 0.5, duration: 11.5, x: '50%', y: '12%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_size: '38px', fill_color: '#8A7070', text_align: 'center' },
      // Big number
      { type: 'text', text: `${lifePathNumber}`, time: 1, duration: 11, x: '50%', y: '30%', x_anchor: '50%', y_anchor: '50%', font_family: 'Playfair Display', font_size: '260px', font_weight: '700', fill_color: color, text_align: 'center', animations: [{ time: 'start', duration: 0.8, type: 'scale', easing: 'bounce-out' }] },
      // Traits
      { type: 'text', text: 'Your Personality', time: 2, duration: 10, x: '50%', y: '48%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_size: '34px', fill_color: '#E8A87C', text_align: 'center' },
      { type: 'text', text: traits.join('  ·  '), time: 2.5, duration: 9.5, x: '50%', y: '54%', x_anchor: '50%', y_anchor: '50%', width: '85%', font_family: 'Nunito', font_size: '40px', font_weight: '700', fill_color: '#F5EDE8', text_align: 'center', animations: [{ time: 'start', duration: 0.6, type: 'fade' }] },
      { type: 'rectangle', time: 3, duration: 9, x: '50%', y: '60%', x_anchor: '50%', y_anchor: '50%', width: '65%', height: '3px', fill_color: '#3A2830' },
      // Compatible with
      { type: 'text', text: 'Most Compatible With', time: 3.5, duration: 8.5, x: '50%', y: '66%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_size: '34px', fill_color: '#E8A87C', text_align: 'center' },
      { type: 'text', text: compatibleWith.join('   '), time: 4, duration: 8, x: '50%', y: '74%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_family: 'Playfair Display', font_size: '90px', font_weight: '700', fill_color: color, text_align: 'center', animations: [{ time: 'start', duration: 0.8, type: 'scale', easing: 'bounce-out' }] },
      { type: 'text', text: 'Find your match on AankMilaan 💕', time: 5, duration: 7, x: '50%', y: '86%', x_anchor: '50%', y_anchor: '50%', width: '82%', font_size: '36px', font_weight: '700', fill_color: '#FFD700', text_align: 'center', animations: [{ time: 'start', duration: 0.8, type: 'fade' }] },
      { type: 'text', text: 'ankmilaan.com', time: 5.5, duration: 6.5, x: '50%', y: '92%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_size: '30px', fill_color: '#8A7070', text_align: 'center' },
    ]
  }
}

function buildMatchReveal(data) {
  const { name1 = 'Priya', name2 = 'Arjun', lifePathNumber1 = 3, lifePathNumber2 = 6, compatibilityScore = 87, city = 'Mumbai' } = data || {}
  const scoreColor = compatibilityScore >= 75 ? '#4CAF50' : compatibilityScore >= 60 ? '#FFD700' : '#C84B31'

  return {
    output_format: 'mp4',
    width: 1080,
    height: 1920,
    duration: 12,
    frame_rate: 30,
    fill_color: '#0D0A0B',
    elements: [
      { type: 'rectangle', width: '100%', height: '100%', x: '0%', y: '0%', x_anchor: '0%', y_anchor: '0%', fill_color: '#1A0810' },
      { type: 'text', text: '🔢 AankMilaan', time: 0, duration: 12, x: '50%', y: '6%', x_anchor: '50%', y_anchor: '50%', width: '85%', font_family: 'Playfair Display', font_size: '52px', font_weight: '700', fill_color: '#C84B31', text_align: 'center' },
      { type: 'text', text: 'Numerology Match Reveal ✨', time: 0.3, duration: 11.7, x: '50%', y: '11%', x_anchor: '50%', y_anchor: '50%', width: '85%', font_size: '32px', fill_color: '#E8A87C', text_align: 'center' },
      { type: 'rectangle', time: 0.5, duration: 11.5, x: '50%', y: '15%', x_anchor: '50%', y_anchor: '50%', width: '70%', height: '3px', fill_color: '#3A2830' },
      { type: 'text', text: name1, time: 1, duration: 11, x: '25%', y: '28%', x_anchor: '50%', y_anchor: '50%', width: '44%', font_family: 'Nunito', font_size: '56px', font_weight: '700', fill_color: '#F5EDE8', text_align: 'center', animations: [{ time: 'start', duration: 0.8, type: 'slide', direction: '270deg', easing: 'quadratic-out' }] },
      { type: 'text', text: `Life Path ${lifePathNumber1}`, time: 1.2, duration: 10.8, x: '25%', y: '35%', x_anchor: '50%', y_anchor: '50%', width: '44%', font_size: '34px', fill_color: '#C84B31', text_align: 'center' },
      { type: 'text', text: '💕', time: 1.8, duration: 10.2, x: '50%', y: '31%', x_anchor: '50%', y_anchor: '50%', font_size: '72px', text_align: 'center', animations: [{ time: 'start', duration: 0.5, type: 'scale', easing: 'bounce-out' }] },
      { type: 'text', text: name2, time: 1, duration: 11, x: '75%', y: '28%', x_anchor: '50%', y_anchor: '50%', width: '44%', font_family: 'Nunito', font_size: '56px', font_weight: '700', fill_color: '#F5EDE8', text_align: 'center', animations: [{ time: 'start', duration: 0.8, type: 'slide', direction: '90deg', easing: 'quadratic-out' }] },
      { type: 'text', text: `Life Path ${lifePathNumber2}`, time: 1.2, duration: 10.8, x: '75%', y: '35%', x_anchor: '50%', y_anchor: '50%', width: '44%', font_size: '34px', fill_color: '#C84B31', text_align: 'center' },
      { type: 'text', text: 'Compatibility Score', time: 3, duration: 9, x: '50%', y: '52%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_size: '34px', fill_color: '#8A7070', text_align: 'center', animations: [{ time: 'start', duration: 0.6, type: 'fade' }] },
      { type: 'text', text: `${compatibilityScore}%`, time: 3.5, duration: 8.5, x: '50%', y: '63%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_family: 'Playfair Display', font_size: '180px', font_weight: '700', fill_color: scoreColor, text_align: 'center', animations: [{ time: 'start', duration: 0.8, type: 'scale', easing: 'bounce-out' }] },
      { type: 'text', text: `📍 ${city}`, time: 4, duration: 8, x: '50%', y: '76%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_size: '32px', fill_color: '#8A7070', text_align: 'center' },
      { type: 'rectangle', time: 4, duration: 8, x: '50%', y: '81%', x_anchor: '50%', y_anchor: '50%', width: '60%', height: '3px', fill_color: '#3A2830' },
      { type: 'text', text: 'Find YOUR match on AankMilaan 🔢', time: 5, duration: 7, x: '50%', y: '88%', x_anchor: '50%', y_anchor: '50%', width: '82%', font_size: '36px', font_weight: '700', fill_color: '#E8A87C', text_align: 'center', animations: [{ time: 'start', duration: 0.8, type: 'fade' }] },
      { type: 'text', text: 'ankmilaan.com', time: 5.5, duration: 6.5, x: '50%', y: '93%', x_anchor: '50%', y_anchor: '50%', width: '80%', font_size: '28px', fill_color: '#8A7070', text_align: 'center' },
    ]
  }
}

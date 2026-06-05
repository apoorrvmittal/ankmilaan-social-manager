import { NextResponse } from 'next/server'

const MUSIC_URL = 'https://creatomate-static.s3.amazonaws.com/demo/pixabay-best-summer-128473.mp3'

const VOICEOVER_SCRIPTS = {
  how_it_works: `Welcome to AankMilaan — India's first numerology-based matrimony app. Step one: Enter your name and date of birth. Step two: Our Chaldean numerology engine calculates your Life Path number. Step three: We match you with your most compatible partner. Download AankMilaan today and let the numbers guide you to your soulmate.`,

  numerology_explainer: (num, traits, compatible) =>
    `Life Path Number ${num}. You are ${traits.join(', ')}. You are most compatible with Life Path numbers ${compatible.join(' and ')}. Discover your perfect match on AankMilaan.`,

  match_reveal: (name1, name2, score, lp1, lp2) =>
    `${name1}, Life Path ${lp1}. ${name2}, Life Path ${lp2}. Their compatibility score is ${score} percent! Numbers never lie. Find your perfect match on AankMilaan.`,
}

async function generateVoiceover(text) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) return null

    const voiceId = '21m00Tcm4TlvDq8ikWAM' // Rachel

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.substring(0, 500),
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true }
      })
    })

    if (!res.ok) {
      console.error('ElevenLabs failed:', await res.text())
      return null
    }

    const audioBuffer = await res.arrayBuffer()

    // Upload to tmpfiles.org for public URL
    const formData = new FormData()
    formData.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'vo.mp3')

    // Try file.io
    const uploadRes = await fetch('https://file.io/?expires=1d', { method: 'POST', body: formData })
    const uploadData = await uploadRes.json()
    if (uploadData.success && uploadData.link) return uploadData.link

    // Try tmpfiles.org
    const tmpForm = new FormData()
    tmpForm.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'vo.mp3')
    const tmpRes = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: tmpForm })
    const tmpData = await tmpRes.json()
    if (tmpData.status === 'success') {
      return tmpData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
    }

    return null
  } catch (e) {
    console.error('Voiceover generation failed:', e.message)
    return null
  }
}


async function generateCaption(reelType, data) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return null

    let prompt = ''
    if (reelType === 'how_it_works') {
      prompt = `Write a high-engagement Instagram caption for a Reel about AankMilaan, a numerology-based matrimony app. The reel shows how the app works in 3 steps. 
      Make it curiosity-driven, spiritual yet modern, targeting unmarried Indians aged 22-35.
      Include: hook line, 2-3 sentences, strong CTA, 8-10 relevant hashtags.
      Tone: warm, aspirational, slightly mystical. Max 200 words.`
    } else if (reelType === 'numerology_explainer') {
      const num = data?.lifePathNumber || 3
      const traits = data?.traits?.join(', ') || 'creative, expressive, joyful'
      const compatible = data?.compatibleWith?.join(', ') || '1, 3, 5, 9'
      prompt = `Write a high-engagement Instagram caption for a Reel about Life Path Number ${num} in Chaldean Numerology.
      Key facts: Traits are ${traits}. Most compatible with numbers ${compatible}.
      Hook people with their birth date revealing personality. Ask them to comment their own number.
      Include: strong hook, personality description, compatible numbers, CTA to comment, 8-10 hashtags.
      Tone: mystical, fun, shareable. Max 200 words.`
    } else {
      const name1 = data?.name1 || 'Priya'
      const name2 = data?.name2 || 'Arjun'  
      const score = data?.compatibilityScore || 87
      const lp1 = data?.lifePathNumber1 || 3
      const lp2 = data?.lifePathNumber2 || 6
      prompt = `Write a high-engagement Instagram caption for a numerology match reveal Reel.
      The match: Life Path ${lp1} meets Life Path ${lp2}. Compatibility score: ${score}%.
      This is for AankMilaan, India's numerology matrimony app.
      Make it emotional, shareable, and drive people to check their own compatibility.
      Include: emotional hook, brief explanation of why these numbers work, CTA to try AankMilaan, 8-10 hashtags.
      ${score >= 75 ? 'Score is high — celebrate the match!' : 'Score shows growth potential — spin it positively.'}
      Tone: romantic, mystical, aspirational. Max 200 words.`
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const result = await res.json()
    return result.content?.[0]?.text || null
  } catch (e) {
    console.error('Caption generation failed:', e.message)
    return null
  }
}

export async function POST(request) {
  try {
    const { reelType, data } = await request.json()

    // Build voiceover script
    let script = ''
    if (reelType === 'how_it_works') {
      script = VOICEOVER_SCRIPTS.how_it_works
    } else if (reelType === 'numerology_explainer') {
      script = VOICEOVER_SCRIPTS.numerology_explainer(
        data?.lifePathNumber || 3,
        data?.traits || ['creative', 'expressive', 'joyful'],
        data?.compatibleWith || [1, 3, 5, 9]
      )
    } else {
      script = VOICEOVER_SCRIPTS.match_reveal(
        data?.name1 || 'Priya', data?.name2 || 'Arjun',
        data?.compatibilityScore || 87,
        data?.lifePathNumber1 || 3, data?.lifePathNumber2 || 6
      )
    }

    // Generate voiceover (non-blocking — reel works without it)
    // Generate AI caption + voiceover in parallel
    const [voiceoverUrl, caption] = await Promise.all([
      generateVoiceover(script),
      generateCaption(reelType, data)
    ])
    console.log('Caption generated:', !!caption)

    let source
    if (reelType === 'how_it_works') source = buildHowItWorksReel(voiceoverUrl)
    else if (reelType === 'numerology_explainer') source = buildNumerologyExplainer(data, voiceoverUrl)
    else source = buildMatchReveal(data, voiceoverUrl)

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

    const renders = Array.isArray(result) ? result : [result]
    const mp4Render = renders.find(r => r.output_format === 'mp4') || renders[0]

    return NextResponse.json({
      renderId: mp4Render.id,
      status: mp4Render.status,
      url: mp4Render.url || null,
      hasVoiceover: !!voiceoverUrl,
      caption,
      allRenders: renders.map(r => ({ id: r.id, format: r.output_format, status: r.status }))
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function audioElements(voiceoverUrl) {
  const els = [{
    type: 'audio',
    source: MUSIC_URL,
    time: 0,
    duration: null,
    audio_fade_in: 1,
    audio_fade_out: 2,
    volume: voiceoverUrl ? '25%' : '60%', // lower music if voiceover present
  }]
  if (voiceoverUrl) {
    els.push({
      type: 'audio',
      source: voiceoverUrl,
      time: 0.5,
      volume: '100%',
      audio_fade_in: 0.3,
      audio_fade_out: 0.5,
    })
  }
  return els
}

function rect(fill_color, opts = {}) {
  return { type: 'shape', path: 'M 0 0 L 100 0 L 100 100 L 0 100 L 0 0 Z', fill_color, width: opts.width || '100%', height: opts.height || '100%', x: opts.x || '50%', y: opts.y || '50%', x_anchor: '50%', y_anchor: '50%', time: opts.time ?? 0, duration: opts.duration ?? 15 }
}

function txt(text, y, opts = {}) {
  const el = { type: 'text', text, y, x: opts.x || '50%', x_anchor: '50%', y_anchor: '50%', width: opts.width || '80%', font_size: opts.fontSize || '40px', font_weight: opts.fontWeight || '400', fill_color: opts.color || '#F5EDE8', text_align: 'center', x_alignment: '50%', time: opts.time ?? 0, duration: opts.duration ?? 15 }
  if (opts.fontFamily) el.font_family = opts.fontFamily
  if (opts.animations) el.animations = opts.animations
  return el
}

function buildHowItWorksReel(vo) {
  return { output_format: 'mp4', width: 1080, height: 1920, duration: 15, frame_rate: 30, emoji_style: 'apple', elements: [
    ...audioElements(vo),
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
  ]}
}

function buildNumerologyExplainer({ lifePathNumber = 3, traits = [], compatibleWith = [] }, vo) {
  const colors = { 1:'#FF6B6B',2:'#4ECDC4',3:'#FFD700',4:'#95A5A6',5:'#E8A87C',6:'#C84B31',7:'#9C6FDE',8:'#2ECC71',9:'#E74C3C' }
  const color = colors[lifePathNumber] || '#FFD700'
  return { output_format: 'mp4', width: 1080, height: 1920, duration: 12, frame_rate: 30, emoji_style: 'apple', elements: [
    ...audioElements(vo),
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
  ]}
}

function buildMatchReveal({ name1='Priya', name2='Arjun', lifePathNumber1=3, lifePathNumber2=6, compatibilityScore=87, city='Mumbai' }, vo) {
  const scoreColor = compatibilityScore >= 75 ? '#4CAF50' : compatibilityScore >= 60 ? '#FFD700' : '#C84B31'
  return { output_format: 'mp4', width: 1080, height: 1920, duration: 12, frame_rate: 30, emoji_style: 'apple', elements: [
    ...audioElements(vo),
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
  ]}
}

// This is appended - we need to add caption generation to the POST handler
// Let's rewrite the POST handler only

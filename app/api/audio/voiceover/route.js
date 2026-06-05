import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { text, voiceId } = await request.json()
    const voice = voiceId || '21m00Tcm4TlvDq8ikWAM' // Rachel - warm English female

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true }
      })
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `ElevenLabs: ${err}` }, { status: 400 })
    }

    const audioBuffer = await res.arrayBuffer()

    // Upload to file.io for a temporary public URL (1 day expiry)
    const formData = new FormData()
    formData.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'voiceover.mp3')

    const uploadRes = await fetch('https://file.io/?expires=1d', { method: 'POST', body: formData })
    const uploadData = await uploadRes.json()

    if (uploadData.success && uploadData.link) {
      return NextResponse.json({ url: uploadData.link })
    }

    // Fallback: base64
    const base64 = Buffer.from(audioBuffer).toString('base64')
    return NextResponse.json({ url: `data:audio/mpeg;base64,${base64}`, base64: true })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

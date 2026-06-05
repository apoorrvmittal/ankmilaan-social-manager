import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { text } = await request.json()
    
    // Rachel voice - warm, professional English female
    const voiceId = '21m00Tcm4TlvDq8ikWAM'

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.substring(0, 500), // stay within free tier
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true,
        }
      })
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('ElevenLabs error:', err)
      return NextResponse.json({ error: `ElevenLabs: ${err}`, url: null }, { status: 200 })
      // Return 200 so reel still generates without voiceover
    }

    const audioBuffer = await res.arrayBuffer()

    // Upload to imgbb won't work for audio
    // Use tmpfiles.org which supports any file type
    const formData = new FormData()
    formData.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'voiceover.mp3')

    // Try file.io first
    try {
      const uploadRes = await fetch('https://file.io/?expires=1d', {
        method: 'POST',
        body: formData,
      })
      const uploadData = await uploadRes.json()
      if (uploadData.success && uploadData.link) {
        console.log('Voiceover uploaded to file.io:', uploadData.link)
        return NextResponse.json({ url: uploadData.link })
      }
    } catch (e) {
      console.error('file.io failed:', e.message)
    }

    // Fallback: tmpfiles.org
    try {
      const tmpForm = new FormData()
      tmpForm.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'voiceover.mp3')
      const tmpRes = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: tmpForm,
      })
      const tmpData = await tmpRes.json()
      if (tmpData.status === 'success') {
        // Convert tmpfiles URL to direct download
        const directUrl = tmpData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
        console.log('Voiceover uploaded to tmpfiles:', directUrl)
        return NextResponse.json({ url: directUrl })
      }
    } catch (e) {
      console.error('tmpfiles failed:', e.message)
    }

    // Last fallback: no voiceover (music only)
    console.log('All upload methods failed, continuing without voiceover')
    return NextResponse.json({ url: null })

  } catch (error) {
    console.error('Voiceover route error:', error)
    return NextResponse.json({ url: null, error: error.message }, { status: 200 })
  }
}

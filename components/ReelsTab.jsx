import { useState } from "react"

const BRAND = {
  colors: {
    primary: "#C84B31", secondary: "#E8A87C", accent: "#FFD700",
    bg: "#0D0A0B", surface: "#1A1318", card: "#221A1E",
    border: "#3A2830", text: "#F5EDE8", muted: "#8A7070",
  },
};

const NUMEROLOGY = {
  1: { traits: ['Leadership', 'Independent', 'Ambitious'], compatible: [3, 5, 6, 9] },
  2: { traits: ['Harmony', 'Sensitive', 'Diplomatic'], compatible: [2, 4, 6, 8] },
  3: { traits: ['Creative', 'Expressive', 'Joyful'], compatible: [1, 3, 5, 9] },
  4: { traits: ['Stable', 'Hardworking', 'Loyal'], compatible: [2, 4, 6, 8] },
  5: { traits: ['Adventurous', 'Freedom-loving', 'Versatile'], compatible: [1, 3, 5, 9] },
  6: { traits: ['Nurturing', 'Responsible', 'Loving'], compatible: [1, 2, 4, 6, 9] },
  7: { traits: ['Spiritual', 'Analytical', 'Wise'], compatible: [2, 7] },
  8: { traits: ['Powerful', 'Ambitious', 'Successful'], compatible: [2, 4, 8] },
  9: { traits: ['Compassionate', 'Idealistic', 'Generous'], compatible: [1, 3, 5, 6, 9] },
}

const REEL_TEMPLATES = [
  {
    id: 'how_it_works', icon: '📱', title: 'How AankMilaan Works',
    desc: 'Show the 3-step process — enter details, get numerology score, find match',
    caption: '✨ Finding your soulmate is now as simple as 1-2-3! AankMilaan uses the ancient wisdom of Chaldean Numerology to match you with your perfect partner 🔢💕\n\nStep 1: Enter your details\nStep 2: We calculate your Life Path number\nStep 3: Meet your compatible matches!\n\n#AankMilaan #NumerologyLove #MatrimonyApp #Shaadi #NumerologyMatch #LifePath #ChaldeanNumerology',
    color: '#C84B31',
  },
  {
    id: 'numerology_explainer', icon: '🔢', title: 'Life Path Number Explainer',
    desc: 'Educational reel — what each Life Path number means and who they match with',
    caption: '🔢 Did you know your birth date reveals your perfect match? Each Life Path number has unique traits and compatible partners!\n\nWhich number are you? Comment below 👇\n\n#NumerologyFacts #LifePathNumber #ChaldeanNumerology #AankMilaan #NumerologyLove #Shaadi #SpiritualLove',
    color: '#FFD700', hasNumberPicker: true,
  },
  {
    id: 'match_reveal', icon: '💕', title: 'Couple Match Reveal',
    desc: 'Reveal compatibility score between two people using their Life Path numbers',
    caption: '💕 Numbers never lie! Here\'s what Chaldean numerology says about this match 🔢✨\n\nFind your compatibility score on AankMilaan — link in bio!\n\n#AankMilaan #NumerologyMatch #Compatibility #Shaadi #NumerologyLove #MatrimonyApp #ChaldeanNumerology',
    color: '#9C6FDE', hasMatchForm: true,
  },
]

function StatusBadge({ state }) {
  if (!state) return null
  const isReady = state.status === 'succeeded' || (state.url && state.url.includes('.mp4'))
  const configs = {
    generating: { color: '#FFD700', label: '⏳ Generating voiceover...' },
    rendering: { color: '#E8A87C', label: `🎬 Rendering video...` },
    succeeded: { color: '#4CAF50', label: '✅ Ready to Post!' },
    failed: { color: '#f44336', label: '❌ Failed' },
    error: { color: '#f44336', label: `❌ ${state.error?.slice(0,40) || 'Error'}` },
  }
  const effectiveStatus = isReady ? 'succeeded' : state.status
  const c = configs[effectiveStatus]
  if (!c) return null
  return <span style={{ background: `${c.color}22`, color: c.color, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{c.label}</span>
}

export default function ReelsTab() {
  const [reelStates, setReelStates] = useState({})
  const [posting, setPosting] = useState(null)
  const [postResults, setPostResults] = useState({})
  const [selectedNumber, setSelectedNumber] = useState(3)
  const [matchForm, setMatchForm] = useState({ name1: 'Priya', name2: 'Arjun', lp1: 3, lp2: 6, score: 87, city: 'Mumbai' })
  const [copiedCaption, setCopiedCaption] = useState(null)

  const isReady = (state) => state && (state.status === 'succeeded' || (state.url && state.url.includes('.mp4')))

  const generateReel = async (template) => {
    const id = template.id
    setReelStates(prev => ({ ...prev, [id]: { status: 'generating', progress: 0 } }))

    let data = {}
    if (id === 'numerology_explainer') {
      data = { lifePathNumber: selectedNumber, traits: NUMEROLOGY[selectedNumber].traits, compatibleWith: NUMEROLOGY[selectedNumber].compatible }
    } else if (id === 'match_reveal') {
      data = { name1: matchForm.name1, name2: matchForm.name2, lifePathNumber1: matchForm.lp1, lifePathNumber2: matchForm.lp2, compatibilityScore: matchForm.score, city: matchForm.city }
    }

    try {
      const res = await fetch('/api/reel/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reelType: id, data })
      })
      const result = await res.json()

      if (result.error) {
        setReelStates(prev => ({ ...prev, [id]: { status: 'error', error: result.error } }))
        return
      }

      setReelStates(prev => ({ ...prev, [id]: { status: 'rendering', renderId: result.renderId, progress: 10, hasVoiceover: result.hasVoiceover } }))
      pollStatus(id, result.renderId)
    } catch (e) {
      setReelStates(prev => ({ ...prev, [id]: { status: 'error', error: e.message } }))
    }
  }

  const pollStatus = (id, renderId) => {
    let attempts = 0
    const maxAttempts = 40 // 2 mins max

    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`/api/reel/status?id=${renderId}`)
        const data = await res.json()

        const done = data.status === 'succeeded' || data.status === 'failed' || 
                     (data.url && data.url.includes('.mp4')) ||
                     attempts >= maxAttempts

        setReelStates(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            // If URL has .mp4, treat as succeeded regardless of status field
            status: (data.url && data.url.includes('.mp4')) ? 'succeeded' : data.status,
            url: data.url,
            progress: data.progress || prev[id]?.progress,
          }
        }))

        if (done) clearInterval(interval)
      } catch (e) {
        if (attempts >= maxAttempts) clearInterval(interval)
      }
    }, 3000)
  }

  const postToInstagram = async (template) => {
    const state = reelStates[template.id]
    if (!state?.url) return
    setPosting(template.id)
    try {
      const res = await fetch('/api/instagram/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: state.url, caption: template.caption, mediaType: 'REELS' })
      })
      const data = await res.json()
      setPostResults(prev => ({ ...prev, [template.id]: data.success ? '✅ Posted to Instagram!' : `❌ ${data.error}` }))
    } catch (e) {
      setPostResults(prev => ({ ...prev, [template.id]: '❌ Failed to post' }))
    }
    setPosting(null)
  }

  const copyCaption = (id, caption) => {
    navigator.clipboard.writeText(caption)
    setCopiedCaption(id)
    setTimeout(() => setCopiedCaption(null), 2000)
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>🎬 Auto Reel Generator</div>
        <div style={{ color: BRAND.colors.muted, fontSize: 13 }}>Reels with AI voiceover + background music — ready to post to Instagram</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto' }}>
        {['1. Choose reel type', '2. Customize content', '3. Generate video + voice', '4. Post to Instagram'].map((s, i) => (
          <div key={i} style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: i < 2 ? BRAND.colors.secondary : BRAND.colors.muted, whiteSpace: 'nowrap', borderLeft: `3px solid ${BRAND.colors.primary}` }}>{s}</div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {REEL_TEMPLATES.map((template) => {
          const state = reelStates[template.id]
          const ready = isReady(state)
          const isRendering = state && !ready && (state.status === 'generating' || state.status === 'rendering')

          return (
            <div key={template.id} style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 14, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '18px 20px', borderBottom: `1px solid ${BRAND.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${template.color}22`, border: `2px solid ${template.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {template.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}>{template.title}</div>
                    <div style={{ fontSize: 12, color: BRAND.colors.muted, marginTop: 2 }}>{template.desc}</div>
                  </div>
                </div>
                <StatusBadge state={state} />
              </div>

              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Number picker */}
                {template.hasNumberPicker && (
                  <div>
                    <div style={{ fontSize: 12, color: BRAND.colors.muted, marginBottom: 8 }}>Select Life Path Number:</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <button key={n} onClick={() => setSelectedNumber(n)}
                          style={{ width: 40, height: 40, borderRadius: 10, background: selectedNumber === n ? template.color : BRAND.colors.surface, border: `2px solid ${selectedNumber === n ? template.color : BRAND.colors.border}`, color: selectedNumber === n ? '#fff' : BRAND.colors.muted, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Playfair Display', serif" }}>
                          {n}
                        </button>
                      ))}
                    </div>
                    {NUMEROLOGY[selectedNumber] && (
                      <div style={{ marginTop: 8, background: BRAND.colors.surface, borderRadius: 8, padding: '8px 12px', fontSize: 12, color: BRAND.colors.muted }}>
                        <span style={{ color: BRAND.colors.secondary, fontWeight: 700 }}>LP {selectedNumber}: </span>
                        {NUMEROLOGY[selectedNumber].traits.join(' · ')} · Compatible: {NUMEROLOGY[selectedNumber].compatible.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Match form */}
                {template.hasMatchForm && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { key: 'name1', label: 'Person 1 Name', placeholder: 'Priya' },
                      { key: 'name2', label: 'Person 2 Name', placeholder: 'Arjun' },
                      { key: 'lp1', label: 'Life Path 1', placeholder: '3', type: 'number' },
                      { key: 'lp2', label: 'Life Path 2', placeholder: '6', type: 'number' },
                      { key: 'score', label: 'Compatibility %', placeholder: '87', type: 'number' },
                      { key: 'city', label: 'City', placeholder: 'Mumbai' },
                    ].map(field => (
                      <div key={field.key}>
                        <div style={{ fontSize: 11, color: BRAND.colors.muted, marginBottom: 4 }}>{field.label}</div>
                        <input type={field.type || 'text'} value={matchForm[field.key]}
                          onChange={e => setMatchForm(prev => ({ ...prev, [field.key]: field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
                          style={{ width: '100%', background: BRAND.colors.surface, border: `1px solid ${BRAND.colors.border}`, borderRadius: 8, padding: '8px 12px', color: BRAND.colors.text, fontSize: 13, outline: 'none', fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Caption */}
                <div>
                  <div style={{ fontSize: 11, color: BRAND.colors.muted, marginBottom: 6 }}>📝 Instagram Caption:</div>
                  <div style={{ background: BRAND.colors.surface, borderRadius: 8, padding: '10px 14px', fontSize: 11, color: BRAND.colors.muted, lineHeight: 1.6, maxHeight: 80, overflow: 'hidden', borderLeft: `3px solid ${template.color}` }}>
                    {template.caption.slice(0, 140)}...
                  </div>
                  <button onClick={() => copyCaption(template.id, template.caption)}
                    style={{ marginTop: 6, background: 'transparent', border: 'none', fontSize: 11, color: copiedCaption === template.id ? '#4CAF50' : BRAND.colors.secondary, cursor: 'pointer', padding: 0, fontFamily: "'Nunito', sans-serif" }}>
                    {copiedCaption === template.id ? '✅ Copied!' : '📋 Copy full caption'}
                  </button>
                </div>

                {/* Video preview */}
                {ready && state?.url && (
                  <div>
                    <video src={state.url} controls style={{ width: '100%', borderRadius: 10, maxHeight: 280, background: '#000' }} />
                    {state.hasVoiceover && <div style={{ fontSize: 11, color: '#4CAF50', marginTop: 4 }}>🎙️ AI voiceover + 🎵 background music included</div>}
                    {!state.hasVoiceover && <div style={{ fontSize: 11, color: BRAND.colors.muted, marginTop: 4 }}>🎵 Background music included</div>}
                  </div>
                )}

                {/* Progress bar */}
                {isRendering && (
                  <div>
                    <div style={{ background: BRAND.colors.border, borderRadius: 4, height: 6 }}>
                      <div style={{ width: `${state.progress || 20}%`, height: '100%', background: `linear-gradient(90deg, ${template.color}, ${template.color}88)`, borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                    <div style={{ fontSize: 11, color: BRAND.colors.muted, marginTop: 4 }}>
                      {state.status === 'generating' ? '🎙️ Generating voiceover...' : '🎬 Creatomate rendering video... ~30 seconds'}
                    </div>
                  </div>
                )}

                {/* Error */}
                {state?.status === 'error' && (
                  <div style={{ background: '#f4433622', border: '1px solid #f44336', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#f44336' }}>
                    ❌ {state.error}
                  </div>
                )}

                {/* Post result */}
                {postResults[template.id] && (
                  <div style={{ background: postResults[template.id].includes('✅') ? '#4CAF5022' : '#f4433622', border: `1px solid ${postResults[template.id].includes('✅') ? '#4CAF50' : '#f44336'}`, borderRadius: 8, padding: '10px 14px', fontSize: 12, color: postResults[template.id].includes('✅') ? '#4CAF50' : '#f44336' }}>
                    {postResults[template.id]}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => generateReel(template)} disabled={isRendering}
                    style={{ flex: 1, background: isRendering ? BRAND.colors.border : BRAND.colors.surface, border: `1px solid ${isRendering ? BRAND.colors.border : template.color}`, borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, color: isRendering ? BRAND.colors.muted : template.color, cursor: isRendering ? 'default' : 'pointer', fontFamily: "'Nunito', sans-serif" }}>
                    {isRendering ? '🎬 Rendering...' : ready ? '🔄 Regenerate' : '🎬 Generate Reel'}
                  </button>
                  {ready && (
                    <button onClick={() => postToInstagram(template)} disabled={posting === template.id}
                      style={{ flex: 1, background: posting === template.id ? BRAND.colors.border : BRAND.colors.primary, border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, color: '#fff', cursor: posting === template.id ? 'default' : 'pointer', fontFamily: "'Nunito', sans-serif" }}>
                      {posting === template.id ? '📤 Posting...' : '🚀 Post to Instagram'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

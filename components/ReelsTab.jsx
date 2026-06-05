import { useState, useEffect } from "react"

const BRAND = {
  colors: {
    primary: "#C84B31", secondary: "#E8A87C", accent: "#FFD700",
    bg: "#0D0A0B", surface: "#1A1318", card: "#221A1E",
    border: "#3A2830", text: "#F5EDE8", muted: "#8A7070",
  },
};

// Chaldean numerology calculation
function chaldeanNumber(name) {
  const map = { a:1,i:1,j:1,q:1,y:1, b:2,k:2,r:2, c:3,g:3,l:3,s:3, d:4,m:4,t:4, e:5,h:5,n:5,x:5, u:6,v:6,w:6, o:7,z:7, f:8,p:8 }
  const sum = name.toLowerCase().split('').reduce((acc, c) => acc + (map[c] || 0), 0)
  if (sum < 10) return sum
  const reduced = Math.floor(sum/10) + (sum%10)
  return reduced < 10 ? reduced : Math.floor(reduced/10) + (reduced%10)
}

function lifePathNumber(dob) {
  if (!dob) return 1
  const digits = dob.replace(/-/g,'').split('').map(Number)
  let sum = digits.reduce((a,b) => a+b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum).split('').map(Number).reduce((a,b)=>a+b,0)
  }
  return sum
}

function compatibilityScore(n1, n2) {
  const compatible = {
    1:[1,3,5,6,9], 2:[2,4,6,8], 3:[1,3,5,9], 4:[2,4,6,8],
    5:[1,3,5,6,9], 6:[1,2,4,5,6,9], 7:[2,7], 8:[2,4,8], 9:[1,3,5,6,9]
  }
  const base = compatible[n1]?.includes(n2) ? 75 : 45
  const bonus = n1 === n2 ? 10 : Math.abs(n1-n2) <= 2 ? 5 : 0
  return Math.min(99, base + bonus + Math.floor(Math.random()*10))
}

const DUMMY_MATCHES = [
  { id:1, name1:"Priya Sharma", name2:"Arjun Mehta", dob1:"1995-03-15", dob2:"1993-07-22", city:"Mumbai" },
  { id:2, name1:"Neha Gupta", name2:"Rahul Singh", dob1:"1997-11-08", dob2:"1994-05-14", city:"Delhi" },
  { id:3, name1:"Anjali Verma", name2:"Karan Patel", dob1:"1996-06-30", dob2:"1992-09-03", city:"Pune" },
  { id:4, name1:"Pooja Jain", name2:"Vikram Nair", dob1:"1998-02-19", dob2:"1995-12-27", city:"Bangalore" },
]

export default function ReelsTab() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [reelStatus, setReelStatus] = useState({}) // { matchId: { status, url, renderId, progress } }
  const [posting, setPosting] = useState(null)
  const [postResult, setPostResult] = useState({})
  const [creatomateKey, setCreatomateKey] = useState("")
  const [templateId, setTemplateId] = useState("")
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/supabase/matches")
      const data = await res.json()
      if (data.data?.length > 0) {
        if (data.source === 'matches') {
          setMatches(data.data)
        } else if (data.source === 'profiles') {
          // Pair profiles into matches
          const profiles = data.data
          const paired = []
          for (let i = 0; i < profiles.length - 1; i += 2) {
            paired.push({ 
              id: i, 
              name1: profiles[i].full_name || "User " + (i+1),
              name2: profiles[i+1].full_name || "User " + (i+2),
              dob1: profiles[i].date_of_birth,
              dob2: profiles[i+1].date_of_birth,
              city: profiles[i].city || "India",
              life_path_1: profiles[i].life_path_number,
              life_path_2: profiles[i+1].life_path_number,
            })
          }
          setMatches(paired.length > 0 ? paired : DUMMY_MATCHES)
        }
      } else {
        setMatches(DUMMY_MATCHES)
      }
    } catch (e) {
      setMatches(DUMMY_MATCHES)
    }
    setLoading(false)
  }

  const generateReel = async (match) => {
    const lp1 = match.life_path_1 || lifePathNumber(match.dob1 || "1995-01-01")
    const lp2 = match.life_path_2 || lifePathNumber(match.dob2 || "1993-01-01")
    const score = match.compatibility_score || compatibilityScore(lp1, lp2)

    setReelStatus(prev => ({ ...prev, [match.id]: { status: "generating", progress: 0 } }))

    try {
      const res = await fetch("/api/reel/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name1: match.name1,
          name2: match.name2,
          lifePathNumber1: lp1,
          lifePathNumber2: lp2,
          compatibilityScore: score,
          city: match.city || "India"
        })
      })
      const data = await res.json()

      if (data.error) {
        setReelStatus(prev => ({ ...prev, [match.id]: { status: "error", error: data.error } }))
        return
      }

      setReelStatus(prev => ({ ...prev, [match.id]: { status: "rendering", renderId: data.renderId, progress: 10 } }))
      pollStatus(match.id, data.renderId)
    } catch (e) {
      setReelStatus(prev => ({ ...prev, [match.id]: { status: "error", error: e.message } }))
    }
  }

  const pollStatus = async (matchId, renderId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/reel/status?id=${renderId}`)
        const data = await res.json()
        setReelStatus(prev => ({ ...prev, [matchId]: { ...prev[matchId], status: data.status, url: data.url, progress: data.progress } }))
        if (data.status === "succeeded" || data.status === "failed") {
          clearInterval(interval)
        }
      } catch (e) { clearInterval(interval) }
    }, 3000)
  }

  const postReelToInstagram = async (match) => {
    const reel = reelStatus[match.id]
    if (!reel?.url) return
    setPosting(match.id)
    try {
      const lp1 = match.life_path_1 || lifePathNumber(match.dob1 || "1995-01-01")
      const lp2 = match.life_path_2 || lifePathNumber(match.dob2 || "1993-01-01")
      const score = match.compatibility_score || compatibilityScore(lp1, lp2)

      const caption = `✨ ${match.name1.split(' ')[0]} & ${match.name2.split(' ')[0]} — matched by Chaldean numerology!\n\n🔢 Life Path ${lp1} meets Life Path ${lp2}\n💯 Compatibility Score: ${score}%\n\nNumbers don't lie 💕 Find your match on AankMilaan!\n\n#AankMilaan #NumerologyLove #${match.city?.replace(' ','')||'India'} #Shaadi #NumerologyMatch #ChaldeanNumerology #MatrimonyApp`

      const res = await fetch("/api/instagram/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: reel.url, caption, mediaType: "REELS" })
      })
      const data = await res.json()
      setPostResult(prev => ({ ...prev, [match.id]: data.success ? "✅ Posted to Instagram!" : `❌ ${data.error}` }))
    } catch (e) {
      setPostResult(prev => ({ ...prev, [match.id]: "❌ Failed to post" }))
    }
    setPosting(null)
  }

  const getStatusBadge = (matchId) => {
    const s = reelStatus[matchId]
    if (!s) return null
    const configs = {
      generating: { color: "#FFD700", label: "⏳ Generating..." },
      rendering: { color: "#E8A87C", label: `🎬 Rendering ${s.progress||0}%` },
      succeeded: { color: "#4CAF50", label: "✅ Ready" },
      failed: { color: "#f44336", label: "❌ Failed" },
      error: { color: "#f44336", label: `❌ ${s.error?.slice(0,30)}` },
    }
    const c = configs[s.status]
    if (!c) return null
    return (
      <span style={{ background: `${c.color}22`, color: c.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
        {c.label}
      </span>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>🎬 Auto Reel Generator</div>
          <div style={{ color: BRAND.colors.muted, fontSize: 13 }}>Generate & post Match Reveal Reels from AankMilaan data</div>
        </div>
        <button onClick={() => setShowSetup(!showSetup)}
          style={{ background: BRAND.colors.surface, border: `1px solid ${BRAND.colors.border}`, borderRadius: 8, padding: "8px 14px", color: BRAND.colors.secondary, fontSize: 12, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
          ⚙️ Setup
        </button>
      </div>

      {/* Setup Panel */}
      {showSetup && (
        <div style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 12, padding: 18, marginBottom: 20 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 14 }}>Creatomate Setup</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: BRAND.colors.muted, marginBottom: 4 }}>Creatomate API Key</div>
              <input value={creatomateKey} onChange={e => setCreatomateKey(e.target.value)} placeholder="Get from creatomate.com/dashboard"
                style={{ width: "100%", background: BRAND.colors.surface, border: `1px solid ${BRAND.colors.border}`, borderRadius: 8, padding: "10px 14px", color: BRAND.colors.text, fontSize: 13, outline: "none", fontFamily: "'Nunito', sans-serif", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: BRAND.colors.muted, marginBottom: 4 }}>Template ID</div>
              <input value={templateId} onChange={e => setTemplateId(e.target.value)} placeholder="After creating template on Creatomate"
                style={{ width: "100%", background: BRAND.colors.surface, border: `1px solid ${BRAND.colors.border}`, borderRadius: 8, padding: "10px 14px", color: BRAND.colors.text, fontSize: 13, outline: "none", fontFamily: "'Nunito', sans-serif", boxSizing: "border-box" }} />
            </div>
            <div style={{ background: BRAND.colors.surface, borderRadius: 8, padding: 12, fontSize: 12, color: BRAND.colors.muted, lineHeight: 1.6 }}>
              <strong style={{ color: BRAND.colors.secondary }}>Steps to set up Creatomate:</strong><br />
              1. Sign up at <strong>creatomate.com</strong> (free trial = 10 renders)<br />
              2. Create a new template → choose "Video" → 9:16 (Reel size)<br />
              3. Add text elements named exactly: <strong>Name-1, Name-2, Life-Path-1, Life-Path-2, Score, City, Tagline</strong><br />
              4. Copy the Template ID and API Key → add both to <strong>Vercel env vars</strong>:<br />
              &nbsp;&nbsp;CREATOMATE_API_KEY and CREATOMATE_TEMPLATE_ID
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {["1. Pick a match from Supabase", "2. Click Generate Reel", "3. Creatomate renders video", "4. One click → Post to Instagram"].map((step, i) => (
          <div key={i} style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: i < 2 ? BRAND.colors.secondary : BRAND.colors.muted, whiteSpace: "nowrap", borderLeft: `3px solid ${BRAND.colors.primary}` }}>
            {step}
          </div>
        ))}
      </div>

      {/* Match Cards */}
      {loading ? (
        <div style={{ color: BRAND.colors.muted, fontSize: 13, padding: 20 }}>Loading matches from Supabase...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {matches.map((match) => {
            const lp1 = match.life_path_1 || lifePathNumber(match.dob1 || "1995-01-01")
            const lp2 = match.life_path_2 || lifePathNumber(match.dob2 || "1993-01-01")
            const score = match.compatibility_score || compatibilityScore(lp1, lp2)
            const reel = reelStatus[match.id]

            return (
              <div key={match.id} style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 14, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    {/* Person 1 */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${BRAND.colors.primary}, ${BRAND.colors.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, margin: "0 auto 6px" }}>
                        {match.name1?.[0] || "?"}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.colors.text }}>{match.name1?.split(' ')[0]}</div>
                      <div style={{ fontSize: 11, color: BRAND.colors.muted }}>LP {lp1}</div>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: score >= 75 ? "#4CAF50" : score >= 60 ? BRAND.colors.accent : BRAND.colors.primary }}>
                        {score}%
                      </div>
                      <div style={{ fontSize: 10, color: BRAND.colors.muted }}>compatibility</div>
                      {match.city && <div style={{ fontSize: 10, color: BRAND.colors.muted }}>📍 {match.city}</div>}
                    </div>

                    {/* Person 2 */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, #9C6FDE, ${BRAND.colors.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, margin: "0 auto 6px" }}>
                        {match.name2?.[0] || "?"}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.colors.text }}>{match.name2?.split(' ')[0]}</div>
                      <div style={{ fontSize: 11, color: BRAND.colors.muted }}>LP {lp2}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                    {getStatusBadge(match.id)}
                    {postResult[match.id] && (
                      <span style={{ fontSize: 11, color: postResult[match.id].includes("✅") ? "#4CAF50" : "#f44336" }}>
                        {postResult[match.id]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reel preview if ready */}
                {reel?.status === "succeeded" && reel?.url && (
                  <div style={{ marginBottom: 12 }}>
                    <video src={reel.url} controls style={{ width: "100%", borderRadius: 8, maxHeight: 200 }} />
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  {(!reel || reel.status === "error") && (
                    <button onClick={() => generateReel(match)}
                      style={{ flex: 1, background: BRAND.colors.surface, border: `1px solid ${BRAND.colors.border}`, borderRadius: 8, padding: "9px", fontSize: 12, fontWeight: 600, color: BRAND.colors.secondary, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
                      🎬 Generate Reel
                    </button>
                  )}
                  {(reel?.status === "generating" || reel?.status === "rendering") && (
                    <div style={{ flex: 1, background: BRAND.colors.surface, border: `1px solid ${BRAND.colors.border}`, borderRadius: 8, padding: "9px", fontSize: 12, color: BRAND.colors.muted, textAlign: "center" }}>
                      <div style={{ background: BRAND.colors.border, borderRadius: 4, height: 4, marginBottom: 6 }}>
                        <div style={{ width: `${reel.progress||10}%`, height: "100%", background: BRAND.colors.accent, borderRadius: 4, transition: "width 0.5s" }} />
                      </div>
                      Rendering your reel...
                    </div>
                  )}
                  {reel?.status === "succeeded" && (
                    <>
                      <button onClick={() => generateReel(match)}
                        style={{ background: BRAND.colors.surface, border: `1px solid ${BRAND.colors.border}`, borderRadius: 8, padding: "9px 14px", fontSize: 12, color: BRAND.colors.muted, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
                        🔄 Regenerate
                      </button>
                      <button onClick={() => postReelToInstagram(match)} disabled={posting === match.id}
                        style={{ flex: 1, background: posting === match.id ? BRAND.colors.border : BRAND.colors.primary, border: "none", borderRadius: 8, padding: "9px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: posting === match.id ? "default" : "pointer", fontFamily: "'Nunito', sans-serif" }}>
                        {posting === match.id ? "📤 Posting..." : "🚀 Post to Instagram"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button onClick={fetchMatches} style={{ marginTop: 16, background: BRAND.colors.surface, border: `1px solid ${BRAND.colors.border}`, borderRadius: 8, padding: "9px 18px", fontSize: 12, color: BRAND.colors.muted, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
        🔄 Refresh from Supabase
      </button>
    </div>
  )
}

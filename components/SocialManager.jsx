import { useState, useRef } from "react";

const BRAND = {
  name: "AankMilaan",
  colors: {
    primary: "#C84B31",
    secondary: "#E8A87C",
    accent: "#FFD700",
    bg: "#0D0A0B",
    surface: "#1A1318",
    card: "#221A1E",
    border: "#3A2830",
    text: "#F5EDE8",
    muted: "#8A7070",
  },
};

const SAMPLE_POSTS = [
  { id: 1, type: "image", caption: "🔢 Your life path number reveals your perfect match! What's yours? #AankMilaan #NumerologyLove #Shaadi", scheduled: "Today 9:00 AM", status: "posted", likes: 342, comments: 28, reach: 4200, mediaHint: "couple silhouette with numerology symbols" },
  { id: 2, type: "reel", caption: "✨ How we matched Priya & Arjun using Chaldean numerology — a love story written in numbers 💕 #NumerologyCouple", scheduled: "Today 6:00 PM", status: "scheduled", likes: 0, comments: 0, reach: 0, mediaHint: "reel: couple testimonial with number animations" },
  { id: 3, type: "story", caption: "Poll: Do you believe numbers decide destiny? 🔮", scheduled: "Tomorrow 11:00 AM", status: "draft", likes: 0, comments: 0, reach: 0, mediaHint: "story poll background" },
  { id: 4, type: "carousel", caption: "The 9 Life Path Numbers and who they're compatible with — save this! 📌 #LifePath #NumerologyMatch", scheduled: "Tomorrow 7:00 PM", status: "draft", likes: 0, comments: 0, reach: 0, mediaHint: "9 slides, one per life path number" },
];

const METRICS = {
  followers: 12840, followersGrowth: 234, reach: 48200, reachGrowth: 12.4,
  engagement: 6.8, engagementGrowth: 1.2, impressions: 91500, impressionsGrowth: 8.7,
  weeklyData: [820, 1200, 940, 1600, 1100, 1800, 1540],
  followerWeek: [12420, 12490, 12550, 12610, 12690, 12760, 12840],
};

const CAMPAIGNS = [
  { id: 1, name: "Sawan Season Launch", status: "active", budget: "₹8,000", spent: "₹3,200", reach: 28000, clicks: 1420, conversions: 87, start: "Jun 1", end: "Jun 30", color: "#C84B31" },
  { id: 2, name: "Life Path Quiz Campaign", status: "active", budget: "₹5,000", spent: "₹1,800", reach: 14500, clicks: 890, conversions: 42, start: "Jun 3", end: "Jun 15", color: "#FFD700" },
  { id: 3, name: "Diwali Match Special", status: "planned", budget: "₹15,000", spent: "₹0", reach: 0, clicks: 0, conversions: 0, start: "Oct 15", end: "Nov 5", color: "#E8A87C" },
];

const CONTENT_IDEAS = [
  "🔢 'Your birth date compatibility score' quiz post",
  "💍 Testimonial reel: Real AankMilaan couple story",
  "📊 Infographic: Top 3 most compatible number pairs",
  "🎯 'Which number should you marry?' interactive story",
  "✨ Behind-the-scenes: How our algorithm works",
  "🌙 Astro + Numerology crossover post for engagement",
];

const statusColor = (s) => s === "posted" ? "#4CAF50" : s === "scheduled" ? "#FFD700" : "#8A7070";
const typeIcon = (t) => t === "image" ? "🖼️" : t === "reel" ? "🎬" : t === "story" ? "⭕" : "📑";

function MiniBarChart({ data, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: i === data.length - 1 ? color : `${color}55`, borderRadius: 2 }} />
      ))}
    </div>
  );
}

function MetricCard({ label, value, growth, data, color }) {
  return (
    <div style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 160 }}>
      <div style={{ color: BRAND.colors.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ color: BRAND.colors.text, fontSize: 24, fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 4 }}>
        {typeof value === "number" ? value.toLocaleString() : value}{label.includes("Engagement") ? "%" : ""}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ color: "#4CAF50", fontSize: 12 }}>▲ {Math.abs(growth)}{typeof growth === "number" && !Number.isInteger(growth) ? "%" : ""}</span>
        <span style={{ color: BRAND.colors.muted, fontSize: 11 }}>this week</span>
      </div>
      <MiniBarChart data={data} color={color} />
    </div>
  );
}

function PostCard({ post, onGenerate, generating }) {
  return (
    <div style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 18 }}>{typeIcon(post.type)}</span>
          <span style={{ background: `${statusColor(post.status)}22`, color: statusColor(post.status), borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>{post.status}</span>
        </div>
        <span style={{ color: BRAND.colors.muted, fontSize: 11 }}>{post.scheduled}</span>
      </div>
      <div style={{ background: BRAND.colors.surface, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: BRAND.colors.text, lineHeight: 1.5, border: `1px dashed ${BRAND.colors.border}` }}>
        <div style={{ color: BRAND.colors.muted, fontSize: 10, marginBottom: 4 }}>📸 Media: {post.mediaHint}</div>
        {post.caption}
      </div>
      {post.status === "posted" && (
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: BRAND.colors.muted }}>
          <span>❤️ {post.likes}</span><span>💬 {post.comments}</span><span>👁️ {post.reach.toLocaleString()}</span>
        </div>
      )}
      {post.status === "draft" && (
        <button onClick={() => onGenerate(post.id)} disabled={generating === post.id}
          style={{ background: generating === post.id ? BRAND.colors.border : BRAND.colors.primary, color: BRAND.colors.text, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: generating === post.id ? "default" : "pointer", fontFamily: "'Nunito', sans-serif" }}>
          {generating === post.id ? "✨ Generating caption..." : "🤖 AI Generate Caption"}
        </button>
      )}
    </div>
  );
}

export default function AankMilaanSocialManager() {
  const [tab, setTab] = useState("dashboard");
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [generating, setGenerating] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [newPostType, setNewPostType] = useState("image");
  const [newPostTime, setNewPostTime] = useState("");

  const callAI = async (messages) => {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "";
  };

  const generateCaption = async (postId) => {
    setGenerating(postId);
    const post = posts.find((p) => p.id === postId);
    try {
      const caption = await callAI([{ role: "user", content: `You are a social media manager for AankMilaan, a numerology-based matrimony app for the Indian market. Write an engaging Instagram caption for a ${post.type} about: "${post.mediaHint}". Requirements: Use 2-3 relevant emojis, include 5-7 hashtags like #AankMilaan #NumerologyLove #Shaadi, be warm and spiritual in tone, max 150 words, end with a call to action. Return ONLY the caption text.` }]);
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, caption, status: "scheduled", scheduled: "Tomorrow 9:00 AM" } : p));
    } catch (e) { console.error(e); }
    setGenerating(null);
  };

  const askAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const response = await callAI([{ role: "user", content: `You are a senior social media strategist for AankMilaan, a numerology-based matrimony app targeting young Indian users (18-35). User question: ${aiPrompt}. Give a specific, actionable answer. Max 200 words. Use bullet points if listing items.` }]);
      setAiResponse(response);
    } catch (e) { setAiResponse("Error connecting to AI."); }
    setAiLoading(false);
  };

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "posts", label: "📅 Content Queue" },
    { id: "campaigns", label: "🎯 Campaigns" },
    { id: "ai", label: "🤖 AI Strategist" },
  ];

  const tabStyle = (id) => ({
    padding: "10px 20px", background: tab === id ? BRAND.colors.primary : "transparent",
    color: tab === id ? "#fff" : BRAND.colors.muted,
    border: `1px solid ${tab === id ? BRAND.colors.primary : BRAND.colors.border}`,
    borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: tab === id ? 700 : 400,
    fontFamily: "'Nunito', sans-serif",
  });

  return (
    <div style={{ minHeight: "100vh", background: BRAND.colors.bg, color: BRAND.colors.text, fontFamily: "'Nunito', sans-serif", paddingBottom: 60 }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND.colors.surface} 0%, #2A1520 100%)`, borderBottom: `1px solid ${BRAND.colors.border}`, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${BRAND.colors.primary}, ${BRAND.colors.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔢</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>AankMilaan</div>
            <div style={{ fontSize: 11, color: BRAND.colors.muted }}>Social Media Manager</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: BRAND.colors.secondary, fontWeight: 700 }}>📸 Instagram</div>
            <div style={{ fontSize: 11, color: BRAND.colors.muted }}>@aankmilaan.app</div>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4CAF50", boxShadow: "0 0 8px #4CAF50" }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "16px 28px", display: "flex", gap: 8, borderBottom: `1px solid ${BRAND.colors.border}` }}>
        {tabs.map((t) => <button key={t.id} style={tabStyle(t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      <div style={{ padding: "24px 28px" }}>
        {tab === "dashboard" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Weekly Overview</div>
              <div style={{ color: BRAND.colors.muted, fontSize: 13 }}>Jun 1 – Jun 7, 2026 · Instagram</div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <MetricCard label="Followers" value={METRICS.followers} growth={METRICS.followersGrowth} data={METRICS.followerWeek} color={BRAND.colors.primary} />
              <MetricCard label="Weekly Reach" value={METRICS.reach} growth={METRICS.reachGrowth} data={[3200,5100,4200,7800,5600,8200,7400]} color={BRAND.colors.secondary} />
              <MetricCard label="Engagement %" value={METRICS.engagement} growth={METRICS.engagementGrowth} data={[4.2,5.1,4.8,6.2,5.8,7.1,6.8]} color={BRAND.colors.accent} />
              <MetricCard label="Impressions" value={METRICS.impressions} growth={METRICS.impressionsGrowth} data={[9800,12100,10500,15200,13100,16800,14000]} color="#9C6FDE" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 14 }}>Today's Content</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {posts.slice(0, 2).map((p) => <PostCard key={p.id} post={p} onGenerate={generateCaption} generating={generating} />)}
              </div>
            </div>
            <div style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 12 }}>💡 AI Content Ideas for This Week</div>
              {CONTENT_IDEAS.map((idea, i) => (
                <div key={i} style={{ background: BRAND.colors.surface, borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 8, borderLeft: `3px solid ${i % 2 === 0 ? BRAND.colors.primary : BRAND.colors.secondary}` }}>{idea}</div>
              ))}
            </div>
          </div>
        )}

        {tab === "posts" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Content Queue</div>
                <div style={{ color: BRAND.colors.muted, fontSize: 13 }}>Schedule & manage your Instagram posts</div>
              </div>
              <button onClick={() => setPosts([...posts, { id: posts.length + 1, type: newPostType, caption: "Draft — click AI Generate.", scheduled: newPostTime || "Unscheduled", status: "draft", likes: 0, comments: 0, reach: 0, mediaHint: `${newPostType} for AankMilaan` }])}
                style={{ background: BRAND.colors.primary, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
                + New Post
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {["image","reel","story","carousel"].map((t) => (
                <button key={t} onClick={() => setNewPostType(t)}
                  style={{ background: newPostType === t ? `${BRAND.colors.primary}33` : BRAND.colors.card, border: `1px solid ${newPostType === t ? BRAND.colors.primary : BRAND.colors.border}`, borderRadius: 8, padding: "6px 14px", color: newPostType === t ? BRAND.colors.primary : BRAND.colors.muted, fontSize: 12, cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
                  {typeIcon(t)} {t}
                </button>
              ))}
              <input type="text" placeholder="Schedule time (e.g. Tomorrow 6PM)" value={newPostTime} onChange={(e) => setNewPostTime(e.target.value)}
                style={{ flex: 1, background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 8, padding: "6px 14px", color: BRAND.colors.text, fontSize: 12, outline: "none", fontFamily: "'Nunito', sans-serif" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {posts.map((p) => <PostCard key={p.id} post={p} onGenerate={generateCaption} generating={generating} />)}
            </div>
          </div>
        )}

        {tab === "campaigns" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Campaign Tracker</div>
              <div style={{ color: BRAND.colors.muted, fontSize: 13 }}>Monitor your Instagram ad performance</div>
            </div>
            {CAMPAIGNS.map((c) => {
              const spentPct = parseInt(c.budget.replace(/[₹,]/g,"")) > 0 ? Math.round((parseInt(c.spent.replace(/[₹,]/g,"")) / parseInt(c.budget.replace(/[₹,]/g,""))) * 100) : 0;
              return (
                <div key={c.id} style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: BRAND.colors.muted }}>{c.start} → {c.end}</div>
                    </div>
                    <span style={{ background: c.status === "active" ? "#4CAF5022" : "#8A707022", color: c.status === "active" ? "#4CAF50" : BRAND.colors.muted, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{c.status}</span>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: BRAND.colors.muted, marginBottom: 6 }}>
                      <span>Budget: {c.budget}</span><span>Spent: {c.spent} ({spentPct}%)</span>
                    </div>
                    <div style={{ background: BRAND.colors.border, borderRadius: 4, height: 6 }}>
                      <div style={{ width: `${spentPct}%`, height: "100%", background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`, borderRadius: 4 }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    {[{label:"Reach",value:c.reach.toLocaleString()},{label:"Clicks",value:c.clicks.toLocaleString()},{label:"Conversions",value:c.conversions},{label:"CTR",value:c.clicks>0?`${((c.clicks/c.reach)*100).toFixed(1)}%`:"—"}].map((stat) => (
                      <div key={stat.label}>
                        <div style={{ fontSize: 11, color: BRAND.colors.muted, marginBottom: 2 }}>{stat.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "ai" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>🤖 AI Social Media Strategist</div>
              <div style={{ color: BRAND.colors.muted, fontSize: 13 }}>Ask anything about growing AankMilaan on Instagram</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {["Best posting times for Indian matrimony audience?","How to get more profile visits from reels?","Content calendar for next 7 days","How to increase story views?","Hashtag strategy for numerology niche"].map((q) => (
                <button key={q} onClick={() => setAiPrompt(q)}
                  style={{ background: BRAND.colors.surface, border: `1px solid ${BRAND.colors.border}`, borderRadius: 20, padding: "6px 14px", color: BRAND.colors.secondary, fontSize: 12, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
                  {q}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askAI()} placeholder="Ask your AI strategist..."
                style={{ flex: 1, background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 10, padding: "12px 16px", color: BRAND.colors.text, fontSize: 14, outline: "none", fontFamily: "'Nunito', sans-serif" }} />
              <button onClick={askAI} disabled={aiLoading}
                style={{ background: aiLoading ? BRAND.colors.border : BRAND.colors.primary, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: aiLoading ? "default" : "pointer", fontFamily: "'Nunito', sans-serif", minWidth: 80 }}>
                {aiLoading ? "..." : "Ask →"}
              </button>
            </div>
            {(aiLoading || aiResponse) && (
              <div style={{ background: BRAND.colors.card, border: `1px solid ${BRAND.colors.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 12, color: BRAND.colors.muted, marginBottom: 10 }}>🤖 AI Strategist Response</div>
                {aiLoading ? <div style={{ color: BRAND.colors.muted, fontSize: 13 }}>Thinking strategically for AankMilaan...</div>
                  : <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiResponse}</div>}
              </div>
            )}
            {!aiResponse && !aiLoading && (
              <div style={{ background: BRAND.colors.card, border: `1px dashed ${BRAND.colors.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 12 }}>📌 AankMilaan Growth Playbook</div>
                {[{title:"Post Frequency",tip:"1 Feed post + 3-5 Stories + 2 Reels per week"},{title:"Best Times",tip:"8-9 AM, 1-2 PM, 7-9 PM IST (Indian audience)"},{title:"Top Content",tip:"Reels > Carousels > Stories"},{title:"Hashtag Mix",tip:"3 niche + 3 medium + 2 broad per post"},{title:"Growth Hack",tip:"Collab reels with astrology/kundali creators"}].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <div style={{ color: BRAND.colors.primary, fontWeight: 700, minWidth: 130, fontSize: 13 }}>{item.title}</div>
                    <div style={{ color: BRAND.colors.muted, fontSize: 13 }}>{item.tip}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

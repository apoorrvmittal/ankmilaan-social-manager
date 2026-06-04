# AankMilaan Social Media Manager

AI-powered Social Media Manager dashboard for **AankMilaan** — a numerology-based matrimony app.

## Features

- 📊 **Dashboard** — Weekly metrics: Followers, Reach, Engagement, Impressions
- 📅 **Content Queue** — Schedule Instagram posts with AI caption generation
- 🎯 **Campaign Tracker** — Monitor ad budgets, reach, clicks & conversions
- 🤖 **AI Strategist** — Ask Claude for Instagram growth strategies tailored to AankMilaan

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Anthropic Claude API (claude-sonnet-4-20250514)

## Setup

```bash
npm install
```

Create a `.env.local` file:
```
ANTHROPIC_API_KEY=your_api_key_here
```

```bash
npm run dev
```

## Deploy on Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` in Vercel Environment Variables
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

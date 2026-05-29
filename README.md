# JalSutra 🌊
**Ancient Wisdom. Living Rivers.**

A community platform for river conservation — report biodiversity, share indigenous knowledge, participate in eco-missions, and become a River Guardian.

---

## Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Frontend  | Next.js 14, React, TypeScript, Tailwind CSS |
| Database  | PostgreSQL via **NeonDB** (serverless) |
| Deploy FE | **Vercel**                            |
| Deploy BE | API routes are in Next.js (same Vercel deploy). For a separate Node backend → **Railway** |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up NeonDB
1. Go to [console.neon.tech](https://console.neon.tech) and create a new project named `jalsutra`
2. Copy the **Connection String** (looks like `postgresql://user:pass@ep-xxx.aws.neon.tech/jalsutra?sslmode=require`)
3. Run the schema SQL from `lib/db.ts` (copy the CREATE TABLE statements into Neon's SQL editor)

### 3. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local and paste your DATABASE_URL
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable
vercel env add DATABASE_URL
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) and it auto-deploys.

---

## Deploy Backend to Railway (optional)

If you want a separate Express/Node.js backend on Railway:

1. Create a `backend/` folder and add your Express server
2. Push to GitHub
3. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
4. Add `DATABASE_URL` as an environment variable in Railway dashboard

---

## Project Structure

```
jalsutra/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main landing page
│   ├── globals.css         # Global styles + CSS variables
│   └── api/
│       ├── alerts/route.ts       # GET/POST alerts
│       └── activities/route.ts   # GET activities
├── components/
│   ├── Sidebar.tsx         # Left navigation sidebar
│   ├── Header.tsx          # Top header with location + notifications
│   ├── HeroBanner.tsx      # Hero section with illustrated river scene
│   ├── FeatureGrid.tsx     # 8 feature action cards
│   ├── AlertsPanel.tsx     # Right panel: alerts list
│   ├── RecentActivity.tsx  # Right panel: activity feed
│   └── SeasonalTip.tsx     # Bottom seasonal tip banner
├── lib/
│   └── db.ts               # NeonDB connection + schema reference
├── .env.local.example      # Environment variable template
└── README.md
```

---

## Database Schema

The schema is documented in `lib/db.ts`. Tables:
- `users` — guardians with levels and points
- `alerts` — river/ecology alerts
- `activities` — user activity feed
- `biodiversity_reports` — species sightings with GPS
- `issues` — reported river issues
- `missions` — eco-missions / challenges
- `user_missions` — completed missions per user

---

## Design Notes

The UI follows a **Madhubani / Indian folk art aesthetic**:
- **Colors**: Forest green sidebar, warm cream/parchment backgrounds, gold accents
- **Typography**: Playfair Display (headings) + Lora (body)
- **Borders**: Repeating folk-pattern color bands in gold, orange, green, blue
- **Illustrations**: Hand-crafted SVG scenes — river, temples, ghats, dolphin, kingfisher
- **Responsive**: Desktop sidebar collapses to mobile bottom navigation bar

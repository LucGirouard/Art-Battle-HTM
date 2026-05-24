# Doodle Duel

A fast, daily art game built for Hack The Mountain.

Draw once, submit in 2 minutes, then jump into the arena and rate everyone else's artwork.

## Demo

- Live app: `doodle-duel-htm.vercel.app`
- Video: `need to film`

## What It Does

- Daily Draw: one official drawing per day, with a 2-minute timer.
- Auto-submit on timeout: if the timer hits zero, your current canvas is submitted.
- Rate It Arena: swipe/right-left (or buttons on desktop) to vote on today’s entries.
- Live leaderboard: top cards are highlighted, with full daily ranking below.
- Supabase auth: sign up, log in and keep daily submissions tied to your profile.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, Storage)
- Vercel (Frontend)

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## How It Works

- Users authenticate with Supabase Auth.
- Daily Draw allows one official submission per local day.
- Canvas image uploads to Supabase Storage (`artworks` bucket).
- Artwork metadata and Elo score save in Supabase Postgres.
- Rate It updates Elo based on swipe votes and builds a daily leaderboard.

## Data Model

- `profiles`: `id`, `username`
- `artworks`: `id`, `user_id`, `image_url`, `elo`, `username`, `created_at`
- `votes`: `id`, `user_id`, `winner_id`, `loser_id`, `created_at`

## Project Notes

- Protected routes are enforced on `/quickplay/*` and `/rate-it/*`.
- Daily entries and voting are scoped to the local day window.
- Artwork uploads are stored in Supabase Storage (`artworks` bucket).

## Core Routes

- `/` - Landing page
- `/auth` - Login / signup
- `/quickplay` - Daily draw hub
- `/quickplay/create` - Drawing canvas + submission
- `/rate-it` - Voting entry page
- `/rate-it/arena` - Swipe voting arena + leaderboard

## Built For

Hackathon speed, simple gameplay loop and a fun social judging mechanic.

## Roadmap

- Add personal stats card (submissions, average Elo, best rank).
- Real-time live 1v1 battles via (WebSocket rooms).
- Add sharing for submitted artwork.

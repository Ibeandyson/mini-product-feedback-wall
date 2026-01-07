# 🗣️ Mini Product Feedback Wall

A lightweight, real-time feedback collection app built with **Next.js** and **Supabase**. Perfect for hackathons, demos, and team collaboration.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)

## ✨ Features

- **Real-time Updates** - See new feedback and votes instantly without refresh
- **Authentication** - Magic link email or anonymous sign-in
- **Voting System** - Upvote/downvote with one-vote-per-user enforcement
- **Row Level Security** - Database-level security using Supabase RLS
- **Beautiful UI** - Modern dark theme with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone & Install

```bash
cd supabase-Product-Feedback-Wall
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Enable **Realtime** for the `feedback` and `votes` tables:
   - Go to Database → Replication
   - Enable replication for both tables

### 3. Configure Environment

Rename `env.local.example` to `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON=your-anon-key
```

Find these in your Supabase Dashboard → Settings → API.

### 4. Enable Anonymous Auth (Optional)

For quick demo access without email:
1. Go to Authentication → Providers
2. Enable "Anonymous Sign-in"

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎬 Demo Script (For Judges)

1. **Submit Feedback** - Open Tab A, sign in, create feedback
2. **Real-time Sync** - Open Tab B, see feedback appear instantly
3. **Vote** - Upvote in Tab B
4. **Live Update** - Watch vote count update in Tab A
5. **RLS Demo** - Try voting twice → blocked by database policy!

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│    Supabase     │
│   (Frontend)    │◀────│   (Backend)     │
└─────────────────┘     └─────────────────┘
        │                       │
        │                       ├── Postgres DB
        │                       ├── Auth
        │                       ├── Realtime
        └──── Websocket ───────▶└── RLS Policies
```

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── AuthModal.tsx    # Sign-in modal
│   ├── AuthProvider.tsx # Auth context
│   ├── FeedbackCard.tsx # Individual feedback item
│   ├── FeedbackForm.tsx # Submit feedback form
│   ├── FeedbackList.tsx # Real-time feedback list
│   ├── FeedbackWall.tsx # Main container
│   ├── Header.tsx       # App header
│   └── VoteButton.tsx   # Vote button component
├── lib/supabase/
│   ├── client.ts        # Browser client
│   └── server.ts        # Server client
├── types/
│   └── database.ts      # TypeScript types
└── middleware.ts        # Auth middleware
```

## 🔒 Security Features

### Row Level Security (RLS)

All data access is controlled at the database level:

| Table | Policy | Description |
|-------|--------|-------------|
| feedback | SELECT | All authenticated users can read |
| feedback | INSERT | Users can only insert their own |
| feedback | UPDATE/DELETE | Only owner can modify |
| votes | SELECT | All authenticated users can read |
| votes | INSERT | One vote per user per feedback |
| votes | UPDATE/DELETE | Only own votes |

### Unique Constraint

The `votes` table has a unique constraint on `(feedback_id, user_id)` preventing duplicate votes at the database level - not just the frontend!

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase Postgres
- **Auth**: Supabase Auth (Magic Link + Anonymous)
- **Realtime**: Supabase Realtime (Postgres Changes)
- **Language**: TypeScript

## 📝 Database Schema

```sql
-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table with unique constraint
CREATE TABLE votes (
    id UUID PRIMARY KEY,
    feedback_id UUID REFERENCES feedback(id),
    user_id UUID REFERENCES auth.users(id),
    vote_type vote_type, -- 'up' | 'down'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (feedback_id, user_id)
);
```

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.

## 📄 License

MIT

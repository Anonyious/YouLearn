# YourLearn

> Turn any YouTube playlist into a structured, distraction-free course.

YourLearn is a full-stack learning platform that converts YouTube playlists into organized, trackable courses — without ads, recommendations, or distractions.

![YourLearn Dashboard](public/screenshot-dashboard.png)

🌐 **Live:** [yourlearn.yourdomain.com](https://yourlearn.yourdomain.com)

---

## Features

- **Course Creation** — Paste any YouTube playlist URL or individual video links and instantly get a structured course
- **Distraction-Free Player** — Clean video player with no ads, no recommendations, no comments
- **Progress Tracking** — Mark lessons complete, track percentage, resume exactly where you left off
- **Smart Dashboard** — Stats overview, continue learning banner, search, and tag-based filtering
- **Authentication** — Google OAuth and email/password login
- **Course Sharing** — Every course gets a unique public link
- **Keyboard Shortcuts** — Press `C` to complete, arrow keys to navigate lessons
- **Cinema Mode** — Fullscreen distraction-free learning
- **Dark / Light Mode** — Full theme support with system preference detection
- **Mobile Responsive** — Works on all screen sizes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Auth | NextAuth.js (Google OAuth + Credentials) |
| Database | MongoDB |
| ORM | Prisma |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| External API | YouTube Data API v3 |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database (Atlas or local)
- YouTube Data API v3 key
- Google OAuth credentials (optional)

### Installation
```bash
git clone https://github.com/yourusername/yourlearn.git
cd yourlearn
npm install
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/yourlearn
NA_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
```
```bash
npx prisma db push
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure
```
yourlearn/
├── app/              # Routes + API handlers (Next.js App Router)
├── components/       # UI + feature components
├── lib/              # Auth, Prisma client, YouTube helpers
├── prisma/           # MongoDB schema
└── types/            # Shared TypeScript types
```

---

## Roadmap

Features planned for future development:

- [ ] Notes system — video-level and course-level notes with public/private toggle
- [ ] AI lesson summarizer — generate key takeaways per lesson using LLM
- [ ] Streak tracking and gamification
- [ ] Course transcripts via YouTube captions
- [ ] Public user profile pages
- [ ] Playback speed preference per user
- [ ] Quizzes and completion certificates

---

## Known Issues

- YouTube API has a daily quota limit — large playlists (100+ videos) consume more quota
- Google OAuth requires `NEXTAUTH_URL` to exactly match your production domain

---

## About

Built by **Abhinav Thakare** — a full-stack developer passionate about building tools that make learning more focused and effective.

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Abhinav Thakare](https://linkedin.com/in/yourprofile)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

---

## License

[MIT](LICENSE)

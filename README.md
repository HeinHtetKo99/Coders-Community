# Coders Community

A production-style full-stack developer Q&A platform built with Next.js App Router, MongoDB, and NextAuth v5.

## Live Demo

- **Production URL:** https://coderscommunity-eight.vercel.app/

## Overview

Coders Community allows developers to:

- create, edit, and delete questions
- post and remove answers
- upvote and downvote questions/answers
- discover content through search, filters, tags, and pagination
- browse users in community and view profile activity
- bookmark questions
- generate AI-assisted answer drafts
- read external tech news
- track reputation scores per user

## Feature Highlights

### Authentication

- NextAuth v5 with Credentials login
- OAuth providers: GitHub and Google
- Session-aware server actions and protected mutations

### Forum Core

- Question CRUD flows with tag linking
- Answer create/delete flows
- Voting system for questions and answers
- Question view counter increment flow

### Reputation System

- Reputation is stored per user in `User.reputation`
- Score changes are applied in action flows for:
  - question creation/deletion
  - answer creation/deletion
  - vote changes (add/switch/remove)
- Reputation score is visible on community cards and user profile data
- Admin rebuild endpoint exists at `/api/reputation/rebuild` (secret header protected)

### Discovery & Personalization

- Home and Questions pages with search/filter/pagination
- Tags pages with tag-specific thread browsing
- Community page with user discovery and reputation sorting
- Bookmark save/unsave with bookmark listing page

### AI + External Content

- AI answer draft generation with Google model via `@ai-sdk/google`
- Tech News feed integration with caching/revalidation

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js Server Actions + Route Handlers
- **Database:** MongoDB + Mongoose
- **Auth:** NextAuth v5 (Credentials, GitHub, Google)
- **Validation:** Zod
- **Editor/Rendering:** Tiptap + markdown rendering helpers
- **AI:** `ai` SDK + `@ai-sdk/google`

## Project Structure

```text
app/
  (auth)/                login/register
  (root)/                questions, tags, community, bookmarks, profile, tech-news
  api/                   users/accounts/auth/reputation routes
components/              reusable UI components
constant/                filter constants
database/                mongoose models
lib/
  actions/               server actions
  reputation/            reputation config + rebuild/sync service
  schemas/               zod schemas
  dbConnect.ts           mongodb connection
  response.ts            response helpers
auth.ts                  nextauth config
routes.ts                route helper map
```

## Main Routes

- `/`
- `/questions`
- `/questions/create`
- `/questions/[id]`
- `/questions/[id]/edit`
- `/tags`
- `/tags/[id]`
- `/community`
- `/bookmarks`
- `/profile/[id]`
- `/tech-news`
- `/login`
- `/register`

## API Routes (App Router)

- `/api/users`
- `/api/users/[id]`
- `/api/users/email`
- `/api/accounts`
- `/api/accounts/[id]`
- `/api/accounts/provider`
- `/api/auth/[...nextauth]`
- `/api/auth/signin-with-oauth`
- `/api/reputation/rebuild`

## Environment Variables

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string

AUTH_SECRET=your_auth_secret
AUTH_TRUST_HOST=true
AUTH_URL=http://localhost:3000

AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

REPUTATION_REBUILD_SECRET=your_reputation_rebuild_secret
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` start development server
- `npm run build` build for production
- `npm run start` run production server
- `npm run lint` run ESLint

## Deployment

The app is deployed on Vercel:

- https://coderscommunity-eight.vercel.app/

To deploy your own copy:

1. Push this project to GitHub.
2. Import it into Vercel.
3. Add required environment variables.
4. Deploy.

## Challenges & Solutions

- **Challenge:** Keeping multi-step writes consistent (question, tags, links, votes, bookmarks).  
  **Solution:** Used transactional action flows for critical write paths and atomic update operators where possible.
- **Challenge:** Preventing invalid or malformed input from reaching database logic.  
  **Solution:** Centralized validation with Zod schemas and shared `handleValidation` usage in server actions.
- **Challenge:** Maintaining responsive pages with growing data volume.  
  **Solution:** Applied pagination, indexed query paths, lean reads, and route-level loading states.
- **Challenge:** Coordinating reputation updates across create/delete/vote events.  
  **Solution:** Added rule-driven reputation updates in action files and provided a protected rebuild endpoint for recovery.
- **Challenge:** Supporting multiple auth providers without fragmenting user identity.  
  **Solution:** Unified Credentials + OAuth flows under NextAuth callbacks with user/account linking.

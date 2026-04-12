# Next.js Performance Audit & Optimization Plan (Next 15+)

## Summary
Deliver an opinionated, production-grade performance audit for this Next.js App Router app (Next 16.2) with:
- A short, sourced summary of Next.js 15+ performance mechanics (RSC/streaming/caching/images/bundles/runtime).
- A project-specific bottleneck analysis grounded in this repo’s code.
- Exact code changes to fix each issue, plus “why it works” tied to Next.js internals / browser behavior.
- A prioritized fix list (high → low) and a scaling “performance architecture plan”.

Target environment: Vercel (Node runtime). Product preference: ISR-first for feed pages + small client personalization where needed. Auth refactor allowed to remove internal /api HTTP hops.

## Current State Analysis (Repo Facts)

### Framework/runtime
- Next.js 16.2 App Router + React 19.2 + Tailwind v4 (see package.json).
- No middleware file present.
- next.config.ts only configures images.remotePatterns.

### Rendering/caching behavior (current)
- Root layout performs request-time auth work and wraps the entire app in next-auth’s SessionProvider:
  - app/layout.tsx awaits auth() and renders <SessionProvider session={session}>.
  - This makes every route pay session lookups at the top of the tree and prevents static/ISR routes from being fully cacheable.
- Shared shell components also perform request-time auth:
  - components/Navbar.tsx awaits auth() and does DB work (getUserNavData).
  - components/LeftSidebar.tsx awaits auth() to decide auth UI.
  - app/(root)/layout.tsx includes Navbar + LeftSidebar, so most “public” pages become dynamic even when their data could be cached.
- Right sidebar uses React request memoization but not cross-request caching:
  - components/RightSidebar.tsx uses react.cache() which only dedupes within a request; it still hits MongoDB each request via getQuestions/getTags.

### Data fetching
- Most reads are server actions that query MongoDB via Mongoose (good for RSC), but they are not cached across requests:
  - Example: lib/actions/getQuestions.action.ts, lib/actions/getTags.action.ts.
- Some writes call revalidatePath, but this does not help Data Cache for DB queries, and it does not invalidate “query-param variants” effectively.

### Client JS & navigation cost
- Filters and search rely on client router navigation and query-string parsing:
  - components/Filters.tsx and components/SearchInput.tsx are client components that call router.replace() / router.push() as users type/click.
  - This ships query-string parsing + navigation logic to the client and triggers frequent RSC navigations (can impact INP and server load).
- The rich text editor is a large client bundle:
  - components/TextEditor.tsx imports lowlight “all languages”, which is a major bundle-size multiplier.

### Auth implementation overhead
- NextAuth config (auth.ts) performs internal HTTP calls back into this same Next.js app via /api:
  - auth.ts imports lib/api.ts → lib/fetchHandler.ts → fetch() to `${appUrl}/api/...`.
  - On Vercel, that is an extra serverless invocation hop + JSON (de)serialization + no shared in-process DB connection.

## Step 1: Next.js 15+ Performance Optimizations (What We’ll Summarize)
In the final report, summarize (with citations from nextjs.org) the key Next.js 15+ performance levers:
- React Server Components + client boundary minimization (server-only modules, “use client” containment).
- Streaming + Suspense boundaries (what streams, what blocks; skeleton strategy; avoiding request-time work in shared layouts).
- Caching model (Data Cache, Full Route Cache, router cache semantics; default fetch no-store; unstable_cache for DB).
- Image optimization (when <Image> helps vs hurts; sizes/priority; remote patterns; unoptimized escape hatches).
- Bundle size optimization (dynamic import boundaries; library “all-in” imports; Turbopack considerations).
- Edge/runtime and platform improvements (Node middleware stable; runtime selection per route).

Primary sources for this section:
- Next.js caching guide (April 2026) and route segment config docs.
- Next.js 15.5 release notes (Turbopack build beta + runtime notes).

## Step 2–4: Project Issues → Root Causes → Exact Fixes → Impact

### P0 (Highest): Global request-time auth in shared layouts prevents caching/ISR
**What’s wrong**
- app/layout.tsx awaits auth() and wraps everything in SessionProvider.
- Navbar + LeftSidebar call auth() and are included in the (root) layout, so “public” routes cannot be statically cached.

**Why it’s slow (root cause)**
- Any use of request-time APIs (cookies/session) in a shared parent layout forces dynamic rendering and opts the route out of the Full Route Cache.
- This blocks Vercel CDN from serving a cached HTML shell for public routes, increasing TTFB and reducing streaming usefulness (the tree can’t be prepared ahead of request).

**Exact fix (code changes)**
1) Make the root layout static:
   - Update app/layout.tsx:
     - Remove `const session = await auth()`
     - Remove `<SessionProvider session={session}>` wrapper
     - Keep fonts/globals and render `{children}` directly.
2) Stop doing auth() in shared shell for public routes:
   - Update components/Navbar.tsx and components/LeftSidebar.tsx:
     - Remove auth() calls for public shell.
     - Render a non-personalized shell (login link, generic avatar) that is cache-friendly.
3) Move “auth-aware UI” behind an isolated boundary:
   - Create a small client component (e.g., components/AuthStatus.tsx) that can optionally call NextAuth client APIs later if you want personalization without making the whole route dynamic.
   - Alternatively, keep UI non-personalized (fastest) and enforce auth in server actions + protected pages.

**Why this works (internals)**
- It removes request-time dependencies from shared layouts so Next can cache HTML/RSC payloads for public routes (Full Route Cache + router cache), letting Vercel CDN serve the shell while streaming route-specific dynamic parts.

**Estimated impact**
- TTFB and cache hit rate: very high improvement for public routes (home, questions, tags, tech-news).
- LCP: improves indirectly by serving HTML faster and reducing server compute on navigation.

### P1: MongoDB reads are uncached across requests (DB load + TTFB)
**What’s wrong**
- Read actions (getQuestions, getTags, getQuestion, etc.) always hit MongoDB even for popular, repeatable queries.
- RightSidebar’s react.cache only dedupes within a single request.

**Why it’s slow (root cause)**
- Without Next’s Data Cache for DB queries, every request redoes identical DB work, increasing cold-start sensitivity and steady-state latency.
- Popular pages (home/sidebar) amplify this.

**Exact fix (code changes)**
1) Introduce cached wrappers for repeatable reads using unstable_cache:
   - Add a new module (e.g., lib/cachedReads.ts) exporting:
     - getQuestionsCached(params) with TTL (e.g., 30–120s) for non-search queries
     - getTagsCached(params) with TTL (e.g., 5–15m for popular tags)
     - getQuestionCached(id) with TTL (e.g., 30–120s)
   - Key strategy: stable JSON key from whitelisted params (avoid caching free-text search to prevent unbounded cache growth).
   - Tag strategy: tags like:
     - `questions:list:${filter}:${page}:${pageSize}`
     - `question:${id}`
     - `tags:popular`
2) Update components/RightSidebar.tsx and pages to use cached wrappers for popular lists.
3) Update write actions (vote/create/update/delete) to call revalidateTag for affected tags (in addition to or instead of revalidatePath).

**Why this works (internals)**
- unstable_cache stores results in Next’s Data Cache across requests and instances (per platform), avoiding repeated DB reads.
- Tag-based invalidation gives correctness without blowing away entire routes.

**Estimated impact**
- TTFB: high improvement on hot paths (home/sidebar/question detail).
- Server cost: high reduction in MongoDB query volume.

### P2: NextAuth uses internal HTTP calls to its own /api (extra hops on Vercel)
**What’s wrong**
- auth.ts calls lib/api.ts which uses fetch() to `${appUrl}/api/...` to read accounts/users.

**Why it’s slow (root cause)**
- On Vercel, internal HTTP to /api means:
  - additional serverless function execution
  - extra network stack + JSON parsing
  - separate DB connections and duplicate work

**Exact fix (code changes)**
1) Refactor auth.ts:
   - Replace `api.accounts.getByProviderAccountId(...)` and `api.users.getById(...)` with direct Mongoose queries using dbConnect() and the existing models under database/.
2) Remove unused internal API client:
   - Delete lib/api.ts and lib/fetchHandler.ts (and adjust any imports).

**Why this works (internals)**
- Keeps work in-process during auth callbacks, reducing request fan-out and avoiding cross-function latency.

**Estimated impact**
- Auth latency: medium-to-high improvement on sign-in flows.
- Server cost: reduced internal API invocations.

### P3: Unnecessary client JS for tag filters/search navigation
**What’s wrong**
- Filters.tsx and SearchInput.tsx ship client router navigation + query-string parsing.
- Search triggers navigations as the user types (debounced), which can cause frequent server renders and degrade INP on low-end devices.

**Why it’s slow (root cause)**
- Client navigation in App Router pulls new RSC payloads; doing this per keystroke increases CPU + network, and can compete with main thread input handling.
- query-string adds bundle weight for something URLSearchParams can do.

**Exact fix (code changes)**
1) Convert tag filter chips to server-rendered links:
   - Replace components/Filters.tsx with a server component that renders <Link href={`/?filter=...&page=1`}>.
   - Preserve active state by reading the current filter from the page and passing it down as a prop.
2) Make search submit-based (or explicit “Apply”):
   - Replace router.replace-on-type with a <form method="GET"> that writes `search` into query params.
   - Optional: keep the `/` shortcut and local input state; only navigate on submit.
3) Remove query-string dependency usage where possible.

**Why this works (internals / browser)**
- Server links are prefetchable and don’t require client-side routing logic to be shipped.
- Avoiding route transitions per keystroke reduces main-thread contention (better INP) and reduces server render churn.

**Estimated impact**
- Bundle size: small-to-medium reduction on common pages.
- INP: medium improvement on interactions (especially search typing).

### P4: TextEditor bundle is inflated by “all languages” lowlight
**What’s wrong**
- TextEditor imports `all` from lowlight and registers many languages.

**Why it’s slow (root cause)**
- Large dependency graph inflates JS, increasing download/parse/execute time and potentially harming LCP/INP on editor routes.

**Exact fix (code changes)**
1) In components/TextEditor.tsx:
   - Replace `createLowlight(all)` with `createLowlight()` and register only needed languages (html/css/js/ts).
2) Optionally lazy-load the editor:
   - Use next/dynamic to load TextEditor only when the form is visible/focused.

**Why this works**
- Smaller JS graph reduces parse/compile work; dynamic import defers cost until needed.

**Estimated impact**
- Bundle size: medium-to-high reduction on create/edit pages.
- INP/LCP on editor routes: medium improvement.

## Step 5: Final “Performance Architecture Plan” (Scaling)
Deliver a final plan that codifies:
- Route taxonomy (public ISR/SSG vs authenticated dynamic) using route groups and layout boundaries.
- Cache policy:
  - Which reads are cached (TTL + tags)
  - Invalidation strategy wired into server actions
  - Avoiding unbounded cache keys for search
- Client boundary policy:
  - “use client” only at leaves
  - heavy UI (editor) behind dynamic import boundaries
- Observability:
  - Add instrumentation hooks (where to measure TTFB/LCP/INP, server timings) and a budget.

## Verification Steps (After Implementation)
- Build validation: `npm run build` must pass.
- Render-mode sanity:
  - Confirm tech-news and other public routes can be static/ISR (no unexpected dynamic opt-outs).
- Cache correctness:
  - Verify cached reads are invalidated on vote/create/update/delete via tags.
- Bundle impact:
  - Compare route JS sizes from `next build` output before/after.
- UX regressions:
  - Ensure filters/search still work with link/form-based navigation.


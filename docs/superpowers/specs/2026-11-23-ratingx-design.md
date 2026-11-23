# RatingX — Design Specification

**Date:** 2026-11-23  
**Author:** Agent (davCreate / Antigravity)  
**Status:** Approved for implementation

---

## Intent & Why

RatingX is a cross-platform desktop application (Windows-first, Electron) that lets users discover, organize, and rate any film, series, or anime they watch. The core loop is: **Search → Add to a custom section → Rate 0–10 → Share public profile.**

People want to track what they've watched and share their taste with others. No existing free tool combines beautiful UX with fully custom organization (user-named sections) and social profiles in a lightweight desktop app.

---

## Goals

1. **Search** any title (movies, TV series, anime) via TMDB API — poster, year, synopsis shown.
2. **Library** — user creates named sections/folders (e.g. "Watched", "Plan to Watch", "2024 Favs"), moves titles between them freely.
3. **Rating** — 0–10 (integer or one decimal) per title with optional personal note.
4. **Public Profile** — editable username, avatar, bio; a shareable read-only profile URL (`ratingx://profile/<username>` deeplink shown; optionally exportable as HTML).
5. **UI Quality** — dark/light theme toggle, smooth page transitions (Framer Motion), poster carousels, glassmorphism cards, responsive layout.
6. **Check for Updates** — built-in updater button that checks the GitHub releases API and notifies the user.
7. **Local-first** — all data stored locally in SQLite via better-sqlite3; no account/server required.
8. **Export/Import** — export library as JSON; import from JSON (migration-safe).

---

## Non-Goals

- Real online multiplayer or server sync (profile is local + exportable HTML)
- Paid/subscription tiers
- Mobile app
- Streaming integration (no "watch now" links in v1)

---

## Anti-Goals

What would make this a failure:
- Cluttered UI with too many options visible at once
- Slow search (> 400 ms perceived)
- Data loss on crash (SQLite transactions prevent this)
- No offline fallback (cache last search results locally)

---

## Architecture

```
Electron (main process)
  ├── IPC handlers — search, library CRUD, profile, updater
  ├── better-sqlite3 — local DB (library, sections, ratings, profile)
  └── electron-updater — GitHub releases check

React (renderer process)
  ├── React Router v6 — pages: Home, Search, Library, Section, Profile, Settings
  ├── Zustand — global state (library, profile, theme, search results)
  ├── Framer Motion — page & card transitions
  ├── Tailwind CSS — utility styling
  └── TMDB API — search, poster images (fetched from renderer via IPC)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Shell | Electron 32 |
| UI framework | React 18 + TypeScript |
| Styling | Tailwind CSS 3 + custom CSS vars |
| Animation | Framer Motion 11 |
| State | Zustand 4 |
| Routing | React Router 6 |
| DB | better-sqlite3 (main process) |
| API | TMDB v3 (free API key required) |
| Build | Vite 5 (renderer) + electron-builder |
| Updater | electron-updater + GitHub Releases |
| Icons | Lucide React |
| Linting | ESLint + Prettier |

---

## Data Models

### Section
```ts
{ id: string, name: string, icon: string, order: number, createdAt: number }
```

### LibraryItem
```ts
{
  id: string,
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  title: string,
  posterPath: string,
  year: string,
  overview: string,
  sectionId: string,
  rating: number | null,          // 0–10, one decimal
  note: string,
  addedAt: number,
  ratedAt: number | null
}
```

### Profile
```ts
{ username: string, bio: string, avatarPath: string, createdAt: number }
```

---

## Pages

### Home (`/`)
- Welcome hero with animated gradient background
- Quick stats: total titles, sections, average rating
- Recently added titles carousel (poster cards)
- Recently rated carousel

### Search (`/search`)
- Debounced search input (300 ms) hitting TMDB
- Filter tabs: All / Movies / TV / Anime
- Infinite scroll results (20 per page)
- Each result card: poster, title, year, media type badge, "+ Add" button that opens section picker modal

### Library (`/library`)
- Left sidebar: list of user sections (drag-to-reorder)
- "+ New Section" button with name + icon picker
- Main area shows selected section's items in a grid
- Each card: poster, title, rating badge (or "Not rated"), quick-rate inline, right-click context menu (Move to section, Edit, Remove)

### Section View (`/section/:id`)
- Full section grid with sorting (by rating, by date added, alphabetical)
- Bulk-select (delete, move)

### Title Detail Modal
- Large poster, full synopsis, cast (from TMDB)
- Rating widget: star/slider (0–10) + note textarea
- Section membership shown, change section dropdown

### Profile (`/profile`)
- Editable: username, bio, avatar upload
- Stats: # titles, # sections, avg rating, top-rated list
- "Export Profile as HTML" button — generates a shareable static HTML page saved to disk

### Settings (`/settings`)
- Dark/Light/System theme
- TMDB API key input (stored in Electron safeStorage)
- Check for Updates button → calls GitHub releases API → shows modal with latest version info
- Export Library (JSON), Import Library (JSON)
- Clear all data (with confirmation)

---

## IPC API (main ↔ renderer)

| Channel | Direction | Description |
|---|---|---|
| `search:query` | renderer→main | Query TMDB search, return results |
| `library:add` | renderer→main | Add item to section |
| `library:update` | renderer→main | Update rating/note/section |
| `library:remove` | renderer→main | Remove item |
| `library:getAll` | renderer→main | Return all items |
| `library:getSection` | renderer→main | Items by section |
| `sections:create` | renderer→main | Create section |
| `sections:update` | renderer→main | Rename/reorder section |
| `sections:delete` | renderer→main | Delete section + items |
| `sections:getAll` | renderer→main | All sections |
| `profile:get` | renderer→main | Get profile |
| `profile:update` | renderer→main | Save profile |
| `profile:exportHtml` | renderer→main | Generate HTML file |
| `library:export` | renderer→main | Export JSON |
| `library:import` | renderer→main | Import JSON |
| `app:checkUpdates` | renderer→main | Check GitHub releases |

---

## UI Design Tokens

- **Primary accent:** `#7C3AED` (violet-600) — purple brand color
- **Background dark:** `#0A0A0F`
- **Surface dark:** `#13131A` (card background)
- **Background light:** `#F5F5FA`
- **Surface light:** `#FFFFFF`
- **Rating gold:** `#F59E0B`
- **Font:** Inter (bundled via Fontsource)
- **Border radius:** 12px cards, 8px inputs
- **Transition duration:** 200ms default, 350ms page

---

## Updater Flow

1. User clicks "Check for Updates" in Settings
2. Main process calls `https://api.github.com/repos/davCreate/RatingX/releases/latest`
3. Compare tag with current `app.getVersion()`
4. If newer: show modal with changelog, "Download" button opens browser to release page
5. If current: show "You're up to date" toast

---

## Constraints

- Node 24, npm 11
- Electron 32 (Chromium 128+)
- React 18 (not 19 — Framer Motion 11 compatibility)
- Tailwind 3 (not 4 — Vite plugin compatibility)
- TMDB API key stored via `safeStorage` (encrypted on disk)
- All DB operations in main process only (no direct renderer DB access)
- SQLite WAL mode for concurrent reads
- No external auth — fully local

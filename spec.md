# GeoTrust

## Current State
The app displays 15 hardcoded articles from 2024 covering various global topics (climate, trade, vaccines, etc.) seeded directly in the Motoko backend. The frontend supports source filtering, text search, and auto-refresh. There is no live news fetching.

## Requested Changes (Diff)

### Add
- HTTP outcalls from the backend to fetch live news headlines via a public RSS/news API focused on Iran, Israel, and US war/geopolitical tensions
- Backend caching layer: store fetched articles in stable memory, refresh every 30 minutes automatically
- `fetchLatestNews` public update method that triggers a fresh HTTP fetch
- `getLastFetchedAt` query to expose the last fetch timestamp to the frontend
- Frontend "Last updated X minutes ago" indicator
- Frontend banner indicating the feed is focused on Iran-Israel-US conflict coverage

### Modify
- Replace all 15 hardcoded seed articles with articles fetched live from NewsAPI (free tier) or GNews API filtered by keywords: "Iran Israel war", "Iran US military", "Israel Gaza"
- Backend: replace static `let articles = List.fromArray(...)` with stable `var articles` populated by HTTP outcall
- Frontend: update empty state copy to reflect the focused conflict topic
- Frontend: remove generic source filter tabs (BBC/Reuters etc.) since articles now come from a unified live feed; replace with keyword chips (Iran, Israel, US, All)
- Header subtitle updated to "Live Iran-Israel-US Conflict Coverage"

### Remove
- All 15 hardcoded seed articles
- Static source filter (BBC World, Reuters, AP, Al Jazeera, The Guardian) — replaced by topic chips
- `getSources()` backend method (no longer needed)
- `getArticlesBySource()` backend method (replaced by keyword filtering on live data)

## Implementation Plan
1. Select `http-outcalls` Caffeine component to enable backend HTTP calls
2. Regenerate Motoko backend:
   - Stable `var articles : [Article]` storage
   - `fetchLatestNews()` async update that calls GNews API with query "Iran Israel US war" filtered to last 24h, parses JSON response, maps to Article records
   - Timer-based auto-refresh every 30 minutes using `setTimer`
   - `getLatestArticles()` returns cached articles sorted by date descending
   - `searchArticles(term)` filters cached articles
   - `getLastFetchedAt()` returns last fetch timestamp
3. Update frontend:
   - Replace source filter chips with topic chips: All / Iran / Israel / US
   - Add "Live feed" badge and last-updated timestamp in header
   - Update empty state and header subtitle to reflect conflict focus
   - Wire `fetchLatestNews` call on mount and every 30 minutes

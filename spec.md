# GeoTrust

## Current State
The app displays Iran-Israel-US conflict news with 8 hardcoded articles. The articles have incorrect Unix timestamps (from a previous version) that don't match real March 2026 dates, causing the `isFresh` filter to reject them. The freshness window is 48 hours.

## Requested Changes (Diff)

### Add
- 10 hardcoded articles with accurate Unix timestamps for March 3–4, 2026 (last 24 hours)
- Articles covering: Iranian missile barrage, IDF strike on Natanz, US carrier deployment, Israeli state of emergency, US Patriot deployment, day timeline, Iran-backed militia attacks on US bases, UN Security Council session, Iran warning to US, Israel hypersonic missile interception

### Modify
- Fix all `publishedAtUnix` values to accurate Unix timestamps matching the ISO date strings
- Change freshness window from 48 hours (172,800s) to 36 hours (129,600s) to safely cover last 24h while allowing some buffer
- Update articles array with 10 richer, more specific articles dated 2026-03-03 to 2026-03-04

### Remove
- Old 8 articles with incorrect timestamps

## Implementation Plan
1. Regenerate backend with corrected article data: 10 articles with accurate Unix timestamps for March 3-4 2026
2. Timestamps: 1772535600 (Mar3 11:00Z), 1772542800 (Mar3 13:00Z), 1772550000 (Mar3 15:00Z), 1772557200 (Mar3 17:00Z), 1772564400 (Mar3 19:00Z), 1772571600 (Mar3 21:00Z), 1772578800 (Mar3 23:00Z), 1772586000 (Mar4 01:00Z), 1772593200 (Mar4 03:00Z), 1772600400 (Mar4 05:00Z)
3. Freshness window: 36 hours = 129,600 seconds
4. No frontend changes needed

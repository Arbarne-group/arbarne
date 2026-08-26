# FRONTEND_FEATURES_GUIDE.md  --  Arbarne Agriculture Group Frontend Feature Reference

> **Frontend feature catalog for the Future Farms Framework (FFF) Digital Platform.**
> Documents every page, screen, component, and interactive feature in the Arbarne PWA.
> Based on the source code in `src/frontend/public/` and the FastAPI backend at
> `src/backend/app/`.

---

## 1. Page Architecture

The application is a single-page application (SPA) with multiple logical screens
that are shown/hidden via CSS `hidden` attribute and JavaScript `showScreen()`.
All screens are defined in `src/frontend/public/index.html`.

### Screen Hierarchy

| Screen ID | URL Route | Description |
|---|---|---|
| `screen-auth` | `/auth` / `/` | Authentication: Login / Register new farmer |
| `screen-dashboard` | `/dashboard` | Central hub: metrics, charts, action pathways |
| `screen-assessment-choice` | `/assessment-choice` | Choose: Path A (Single Pillar) or Path B (Full 8-Pillar) |
| `screen-question` | `/question` | Individual question answering flow |
| `screen-result` | `/result` | Official scorecard with PDF download and radar chart |
| `screen-journey` | `/journey` | Transformation roadmap, quests, badges, leaderboard |
| `screen-history` | `/history` | Assessment history and compare view |
| `screen-services` | `/services` | Services portal: browse vetted agro-service providers |
| `screen-learning` | `/learning` | Learning academy: practical training modules |
| `screen-profile` | `/profile` | Farmer profile management |
| `screen-simulator` | `/simulator` | Scenario simulator for tier advancement planning |

---

## 2. Screen-by-Screen Feature Reference

### 2.1 Authentication Screen (`screen-auth`)

**Location:** Lines 79-173 of `index.html`

**Features:**
- **Dual-form toggle:** Log In / Register New Farm switchable via filter pills
- **Log In form:**
  - Email address input (required, validated)
  - Password input (required)
  - Log In button primary action
- **Register form:**
  - Farmer full name (required)
  - Phone number (optional, +254 format)
  - Email address (required, validated)
  - Password (min. 8 characters, required)
  - Farm enterprise name (optional)
  - Agro-ecological region selector (Western Kenya, Rift Valley, Central Kenya, Eastern Kenya, Coast)
  - Farm size acres input (number, step 0.5, default 5.0)
  - Primary crops/livestock text input
  - Create Account & Enter Dashboard primary action
- **Branding:** Arbarne Agriculture Group logo, Future Farms portal tagline
- **State persistence:** On successful auth, user state stored in `localStorage` via `app.js`
- **Navigation:** Hidden auth buttons revealed when authenticated (`updateAuthChrome()`)

**API Calls:**
- `POST /api/auth/login` — authenticate farmer
- `POST /api/auth/register` — register new farmer profile

---

### 2.2 Dashboard (`screen-dashboard`)

**Location:** Lines 176-456 of `index.html`

**Layout:** Hero banner + gamification teaser + 3-column pathway grid + gaps banner +
interactive analytics suite (2-row chart grid with 7 charts).

**Hero Banner:**
- Arbarne emblem watermark logo
- Greeting: "Karibu, [Farmer Name]."
- Tagline: "The Great Transition."
- Farm metadata: enterprise name, region, size
- CTA buttons: "Start Assessment" and "Transformation Journey ➔"

**Gamification Teaser:**
- Active transformation mission card showing level, total XP, streak days, badges count
- "Open Quests & Badges ➔" button

**Pathways Grid (3 columns):**
1. **Assessment Hub** (card with watermark "02")
   - Diagnostic engine description
   - "Path A: Single Pillar" & "Path B: Full 8-Pillar ➔" buttons
   - Launches assessment flow

2. **Services Portal** (card with watermark "03")
   - "Browse vetted agro-Services ➔" button
   - Links to Services screen

3. **Learning Academy** (card with watermark "04")
   - "Open Learning Modules ➔" button
   - Links to Learning screen

**Dynamic Strengths vs Gaps Banner:**
- Shows strongest pillar and priority gap
- "Explore Action Plan" button → results screen

**Interactive Analytics Suite (2-row grid with 7 charts):**

| Chart | ID | Description |
|---|---|---|
| **Chart 1** | `dash-radar-chart` | 8-pillar maturity radar chart. Dual-layer: your farm vs Western Kenya regional peer cohort average. Toggle peer benchmark visibility. |
| **Chart 2** | `dash-risk-gauge` | 12-month trajectory risk gauge. Shows risk level headline (Low/Medium/High) and subtext. Populated by `renderTrajectoryRiskGauge()`. |
| **Chart 3** | `dash-tier-ladder` | 5-tier transformation maturity ladder. Shows current tier progression with locked/completed/active step cards. |
| **Chart 4** | `dash-economic-dividend` | Projected economic dividend / yield uplift chart. ROI model per crop type and farm size. |
| **Chart 5** | `dash-gap-waterfall` | Gap-to-next-tier waterfall. Per-pillar shortfall in FFMI points toward next tier threshold. |
| **Chart 6** | `dash-priority-matrix` | Impact vs. effort priority matrix. 2×2 quadrant view of all 8 pillars — Quick Wins → Strategic Bets. |
| **Chart 7** | `dash-regional-violin` | Regional FFMI score distribution violin chart. Cohort spread per agro-ecological zone, not just averages. |

**Data Sources:**
- `state.user.pillar_scores` (object id→score 0-1, default baseline values)
- `state.user.ffmi_score` and `state.user.tier`
- API: `GET /api/portal/dashboard-summary` (delivered_services_count, completed_courses_count)
- Regional peer benchmarks: `REGIONAL_PEER_BENCHMARKS` K-Means cluster data in `app.js:1098-1103`

**Functions (app.js):**
- `refreshDashboard()` — refreshes all dashboard data and charts (called on screen show)
- `renderInteractiveRadarChart()` — renders Chart 1
- `renderTrajectoryRiskGauge()` — renders Chart 2
- `renderTierMilestoneLadder()` — renders Chart 3
- `renderEconomicDividendChart()` — renders Chart 4
- `renderGapWaterfall()` — renders Chart 5
- `renderPriorityMatrix()` — renders Chart 6
- `renderRegionalViolin()` — renders Chart 7

---

### 2.3 Transformation Journey Screen (`screen-journey`)

**Location:** Lines 459-605 of `index.html`

**Sections (5 featured features):**

**1. Hero Level Card:**
- Current level badge (e.g., "Level 3: Resilient Steward")
- Farmer name and progression tagline
- XP progress bar and remaining XP until next level

**2. 6-Tier Transformation Roadmap:**
- Dynamically rendered from `ROADMAP_TIERS` constant in `app.js:33-40`
- Step cards: locked (below current tier), active (current tier), completed (above)
- Shows score thresholds per tier (0-5.9, 6-10.9, 11-15.9, 16-20.9, 21-23.9, 24.0)

**3. Active Transformation Quests (Missions):**
- 4 hard-coded quests in `app.js:601-641`:
  - `quest_soil_baseline` (60 XP) — Assessment
  - `quest_water_service` (40 XP) — Services
  - `quest_learn_ipm` (50 XP) — Learning
  - `quest_sim_leap` (25 XP) — Simulator
- Each quest shows: XP reward, category tag, description, progress track
- Action buttons: "Take Action ➔", "Claim +XP XP" (if completed but not claimed), "✓ Claimed"

**4. Trophy Cabinet & Master Badges:**
- 12 master badges defined in `app.js:17-30` (`MASTER_BADGES_DATA`)
- Filter pills: All / Unlocked / In Progress
- Badge cards show: tier icon, title, category, description, unlocked status
- Clicking an unlocked badge opens a modal with full details

**5. Regional Smallholder Leaderboard:**
- Top 3 podium (Gold/Silver/Bronze) with farmer name, farm name, region, FFMI score, weekly XP delta
- Full table of all regional entries with rank, farmer/farm, maturity tier, FFMI score, level/XP, weekly velocity
- Region filter pills: Western Kenya / Rift Valley / Central Kenya / All Regions
- Current user highlighted with "You" badge if applicable

**6. 8-Pillar Capability Mastery Matrix:**
- Per-pillar progress cards showing icon, name, caps mastered / 5, progress percentage
- Dynamic from `state.pillars` and `state.simScores`

**Functions (app.js):**
- `loadJourneyScreen()` — loads all journey screen data, calls `syncGamificationState()`, `renderRoadmap()`, `renderQuests()`, `renderBadges()`, `renderLeaderboard()`, `renderMasteryMatrix()`
- `renderRoadmap()` — renders tier roadmap step cards
- `renderQuests()` — renders quest cards with action buttons and claim logic
- `renderBadges()` — renders badge cabinet with filtering
- `renderLeaderboard()` — renders podium + table with region filtering
- `renderMasteryMatrix()` — renders per-pillar mastery cards

---

### 2.4 Assessment Choice Screen (`screen-assessment-choice`)

**Location:** Lines 608-651 of `index.html`

**Features:**
- **Choose Assessment Pathway** heading
- **Path A: Single-Pillar Assessment** (3 min, emerald accent)
  - 25-question check focused on one capability area
  - Ideal for targeted progress review or after implementing a specific service
  - Pillar picker: dynamically populated from `state.pillars` (8 buttons)
  - "Start Assessment" implicit via button flow
- **Path B: Full 8-Pillar Comprehensive** (20 min, green accent)
  - 200-question evaluation across all 40 capabilities
  - Generates official FFMI score (0–24) and full longitudinal baseline
  - "+250 XP" reward for completion
  - Primary CTA button: "Start Full 8-Pillar Diagnostic (+250 XP) ➔"

**Flow:**
- Path A → selects pillar → `startAssessmentFlow('pillar', pId)` → fetches questions for that pillar
- Path B → `startAssessmentFlow('full', null)` → fetches full question set

**Functions (app.js):**
- `initAssessmentPathChooser()` — initializes pillar picker buttons and Path B CTA
- `startAssessmentFlow(scope, targetPillarId)` — starts assessment with given scope

---

### 2.5 Question Screen (`screen-question`)

**Location:** Lines 654-692 of `index.html`

**Features:**
- **Question progress:** Progress bar + "Question X of Y" text
- **Streak tracking:** "Streak: X (Yx XP)" — shows XP multiplier (1.0x/1.2x/1.5x based on consecutive yes answers)
- **Milestone toasts:** "🌟 Pillar N Section Completed!" at every 25th question
- **Question text** with "Why it matters" explanatory note
- **Answer buttons:** ✓ YES (Implemented) / ✕ NO (Not Yet)
- **Navigation:** Previous question / Skip / Not Applicable
- **XP awarding:** Yes answers increment streak and award bonus XP (5/6/8 based on streak length)

**Answer Flow (app.js):**
- `handleAnswer(value)` — records answer, updates streak, awards XP, advances to next question or submits
- `submitAssessmentAnswers()` — POSTs all answers to backend, receives score, shows results screen

**Scoring bonus:**
- Each consecutive "yes" answer increases XP multiplier
- Streak resets to 0 on "no" answer
- Milestone bonuses at streak 3 (6 XP) and 5 (8 XP)

---

### 2.6 Results Screen (`screen-result`)

**Location:** Lines 695-end of `index.html`

**Features:**
- **Scorecard header:** Farm tier and FFMI score (e.g., "Commercializing Farm (Tier 3) · 13.80 / 24.00")
- **Official certified badge banner:** "✓ Official Certified Farm Baseline · FFF v2.4" with Arbarne teal logo
- **Interactive analytics suite** (2-column grid):
  - **Radar chart:** 8-pillar baseline vs peer benchmark (toggleable)
  - **Pillar bars:** Per-pillar score visualization
- **Recommendations list:** Top 5 priority actions with:
  - Priority badge (Quick Win / Medium Term / Strategic)
  - Action title + description
  - "Why it matters" explanation
- **PDF download:** Button to download official scorecard PDF at `/api/assessments/{id}/pdf`
- **Journey view:** Button to view updated roadmap

**Risk badge coloring:**
- Tier ≥ 4: 🟢 Low Trajectory Risk (green)
- Tier ≥ 2: 🟡 Medium Trajectory Risk (amber)
- Tier < 2: 🔴 High Trajectory Risk (red)

**Functions (app.js):**
- `renderResultsScreen(res)` — populates all result UI from API response
- `initSectionTabs(assessmentId, res)` — initializes tab navigation within results
- PDF download handler: `window.open('/api/assessments/{id}/pdf', '_blank')`

---

### 2.7 Supporting Screens (brief overview)

**Services Portal (`screen-services`):** Browse vetted agro-service providers matching farmer gaps.
**Learning Academy (`screen-learning`):** Practical, audio-assisted training modules on regenerative IPM, farm gross-margin ledgers, composting.
**Profile (`screen-profile`):** Farmer profile management (name, farm details, contact info).
**History (`screen-history`):** Past assessment comparisons and longitudinal tracking.

All supporting screens follow the same `showScreen()` navigation pattern and use `apiCall()` for data fetching.

---

## 3. Gamification Engine

**Core Constants (`app.js:17-40`):**

| Constant | Description |
|---|---|
| `MASTER_BADGES_DATA` | 12 badge definitions with key, title, category, tier (gold/silver/bronze), icon, description |
| `ROADMAP_TIERS` | 6-tier progression with score thresholds and descriptions |

**Application State (`app.js:43-96`):**
- `token` — JWT auth token from localStorage
- `user` — farmer profile (name, contact, farm details, tier, FFMI score)
- `gamification` — level, XP, streak, unlocked badges, completed/claimed quests
- `activeScreen` — currently visible screen
- `pillars` — 8 pillar definitions with icon, name, principle
- `services`, `learning`, `history` — fetched collections
- `simScores` — per-pillar simulation scores (1-8, default 0.65)

**Key Functions:**

| Function | Purpose |
|---|---|
| `awardXP(amount, label, event)` | Adds XP, checks level-up, shows floater, triggers confetti, posts to API |
| `showXpFloater(amount, label, event)` | Floating XP notification that appears near event source |
| `triggerConfetti()` | Canvas-based confetti animation on `#confetti-canvas` |
| `showLevelUpModal(level, levelName)` | Modal animation when leveling up |
| `showBadgeUnlockedModal(badge)` | Modal when new badge unlocked |
| `updateHeaderHUD()` | Updates header: level badge, XP bar, streak, user pill, auth button |
| `syncGamificationState()` | Syncs gamification state from API (called on journey screen load) |

**XP Level Thresholds (`app.js:373-381`):**
| Level | Min XP | Max XP | Name |
|---|---|---|---|
| 1 | 0 | 200 | Seedling Farmer |
| 2 | 200 | 500 | Emerging Cultivator |
| 3 | 500 | 1000 | Resilient Steward |
| 4 | 1000 | 1800 | Commercial Grower |
| 5 | 1800 | 2800 | Agro-Ecological Leader |
| 6 | 2800 | 4000 | Future-Ready Pioneer |
| 7 | 4000 | 10000 | Agribusiness Master |

**Quest System:**
- 4 quest types with XP rewards
- Quests can be "completed" (started) or "claimed" (XP awarded)
- Claim reward posts to API and awards XP + confetti

**Leaderboard:**
- Region-filtered top entries
- Shows: rank, farmer name, farm name, region, tier/FFMI, level/XP, weekly XP delta
- Podium: Gold (1st), Silver (2nd), Bronze (3rd)

---

## 4. Charting Engine

**All charts use vanilla JS SVG canvas** — no external charting library dependency.

### Chart Types and IDs

| Chart Type | Container ID | Key Parameters |
|---|---|---|
| **Interactive Radar Chart** | `dash-radar-chart` / `result-radar-chart` | `farmScores` (id→0-1), `peerScores` (regional K-Means), `showPeer` toggle |
| **Risk Gauge** | `dash-risk-gauge` | `ffmi` score, `farmScores`, headline + driver sensitivity panel |
| **Tier Milestone Ladder** | `dash-tier-ladder` | `ffmi`, `tier` — renders 5 tier cards (locked/completed/active) |
| **Economic Dividend** | `dash-economic-dividend` | `farmScores`, `crop_type`, `farm_size_acres` — projected ROI |
| **Gap Waterfall** | `dash-gap-waterfall` | `farmScores`, `ffmi` — per-pillar shortfall to next tier |
| **Priority Matrix** | `dash-priority-matrix` | `farmScores` — 2×2 impact vs effort quadrant |
| **Regional Violin** | `dash-regional-violin` | `farmRegion` — cohort distribution per zone |
| **Result Radar** | `result-radar-chart` | `pillar_scores` from assessment result |
| **Pillar Bars** | `result-pillar-bars` | `pillar_scores` from assessment result |

**Data Flow:**
1. Dashboard charts read from `state.user.pillar_scores` + `REGIONAL_PEER_BENCHMARKS`
2. Result charts read from API response `res.pillar_scores`
3. All charts redraw on window resize (implicit via initial render at screen show)

**Peer Benchmark Data (`app.js:1098-1103`):**
```javascript
const REGIONAL_PEER_BENCHMARKS = {
    'Western Kenya': { 1: 0.55, 2: 0.48, 3: 0.52, 4: 0.60, 5: 0.45, 6: 0.58, 7: 0.50, 8: 0.46 },
    'Rift Valley': { 1: 0.62, 2: 0.50, 3: 0.55, 4: 0.58, 5: 0.52, 6: 0.60, 7: 0.54, 8: 0.50 },
    'Central Highlands': { 1: 0.68, 2: 0.56, 3: 0.62, 4: 0.65, 5: 0.58, 6: 0.64, 7: 0.60, 8: 0.55 },
    'Default': same as Western Kenya
};
```
*K-Means cluster 1 derived averages per capability pillar.*

---

## 5. Offline-First Strategy

**Service Worker (`src/frontend/public/service-worker.js`):**

| Strategy | Scope |
|---|---|
| **Shell Cache** (install) | Cache app shell: `/`, `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `icon.svg` |
| **Stale-while-revalidate** (fetch) | App shell assets: serve cached version, refresh from network background |
| **Network-first for API GETs** | All `/api/` endpoints: try network, fallback to runtime cache |
| **API POSTs bypass cache** | Mutations (answer submission, gamification actions) always hit network |
| **Offline buffer** | IndexedDB in app handles offline→online sync (backend responsibility) |

**Key Constraints:**
- Service worker `fetch` event: `if (request.method !== "GET") return;` — mutations always go to network
- Cache versioning: `VERSION = "fff-v1"` — increment on breaking changes
- Service worker must not cache `/service-worker.js` (no-cache header in nginx.conf)

**Offline Behavior (from HANDOVER.md):**
- Farmer self-assessment works without connectivity
- Answers cache locally via IndexedDB (app responsibility)
- Auto-sync on reconnect
- PWA installable (manifest.webmanifest present)

---

## 6. Brand & Aesthetic Specification

**Color Variables (CSS custom properties, referenced in inline styles):**
- `--color-green-400` / `--color-green-500` / `--color-green-600` — primary brand green
- `--color-pine-950` / `--color-pine-950` — dark background
- `--color-emerald-500` / `--color-emerald-600` — accent/positive
- `--color-amber-400` / `--color-amber-400` — warning
- `--color-warning` / `--color-success` / `--color-danger` — status colors
- `--color-text-dark` / `--color-text-muted` / `--color-canvas` — typography
- `--radius-sm` / `--radius-md` — border radius scale
- `--shadow-card` / `--shadow-soft` — shadow scale

**Typography:**
- Font: `Inter` — weights 300/400/500/600/700/800 from Google Fonts
- Base size: responsive, scales with viewport
- `font-family: 'Inter', sans-serif`

**Brand Assets (public/assets/):**
- `arbarne-emblem-white.png` — white emblem, used as watermark
- `arbarne-logo-horizontal-teal.png` — teal wordmark, header
- `arbarne-logo-horizontal-white.png` — white variant
- `nav-white.png` — navigation icon
- `logo.png` / `favicon.png` — favicon assets
- `icon-192.png` / `icon-512.png` — PWA icons

**Logo Usage:**
- Primary: Arbarne teal logo on teal/header backgrounds
- Secondary: White emblem on dark backgrounds (watermark)
- Always include `alt="Arbarne Agriculture Group"` for accessibility

---

## 7. API Integration Reference

**Base API Path:** All calls from `app.js` use `/api/` prefix, proxied via nginx to
FastAPI backend at `backend:8000`.

**Key Endpoints Used by Frontend:**

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/login` | POST | Authenticate farmer |
| `/api/auth/register` | POST | Register new farmer |
| `/api/assessments/start` | POST | Start assessment (full or pillar) |
| `/api/questions` | GET | Fetch question set for assessment scope |
| `/api/assessments/{id}/answers` | POST | Submit answer entries |
| `/api/assessments/{id}/submit` | POST | Submit assessment, get score |
| `/api/assessments/{id}/pdf` | GET | Download official PDF report |
| `/api/portal/gamification` | GET | Sync gamification state (level, XP, badges, quests) |
| `/api/portal/gamification/action` | POST | Award XP action log |
| `/api/portal/gamification/claim-quest` | POST | Claim quest reward |
| `/api/portal/gamification/leaderboard` | GET | Regional leaderboard data |
| `/api/portal/dashboard-summary` | GET | Dashboard metrics (services/courses counts) |
| `/api/portal/dashboard-summary` | — | — |

**API Response Shapes (simplified):**
- Assessment start: `{ assessment_id, scope, target_pillar_id, questions }`
- Question: `{ question_text, pillar_id, capability_id, question_number, why_it_matters }`
- Submit result: `{ ffmi_score, tier, tier_name, pillar_scores, recommendations, strongest_pillar, priority_gap_pillar }`
- Gamification: `{ total_xp, level, level_name, current_level_min_xp, next_level_xp, streak_days, badges: [{badge_key, is_unlocked}], active_quests: [{id, is_completed, is_claimed}] }`
- Leaderboard: `{ top_entries: [{rank, farmer_name, farm_name, region, tier, tier_name, ffmi_score, level, total_xp, weekly_xp_delta, is_current_user}] }`

**Error Handling (`app.js:101-112`):**
- `formatApiError()` — formats error detail from FastAPI HTTPException
- 401 Unauthorized → clear session, show auth screen
- General errors: `alert(`Error: ${msg}`)` or silent catch-and-continue

---

## 8. Development & Maintenance

### 8.1 Adding a New Screen
1. Add `<section id="screen-xxx" class="screen">...</section>` to `index.html`
2. Add to `PUBLIC_SCREENS` Set in `app.js:153` if public (no auth required)
3. Add navigation button in sidebar `.sidebar-nav` if desired
4. Add `showScreen('screen-xxx')` call in route handlers
5. Implement screen-specific logic in `app.js`

### 2. Adding a New Chart
1. Add `<div id="chart-id"></div>` to target screen in `index.html`
2. Add `renderChart-id()` function in `app.js` following existing patterns
3. Call `renderChart-id()` in the screen's on-show handler (e.g., `refreshDashboard()`, `loadJourneyScreen()`)
4. Ensure resize responsiveness (charts use fixed 320px size, consider CSS grid)

### 3. Adding a New Badge
1. Add entry to `MASTER_BADGES_DATA` array in `app.js:17-30`
2. Ensure badge card rendering in `renderBadges()` handles new entry
3. Add badge description text if new milestone narrative needed

### 4. Adding a New Quest
1. Add entry to `renderQuests()` quests array in `app.js:601-641`
2. Add quest action logic in the same function's event listeners
3. Ensure Quest ➔ button navigation targets correct screen

### 5. Running & Testing
- **Local dev:** `docker compose up -d` (per SETUP.md)
- **Frontend only:** Open `index.html` in browser; service worker requires local server (nginx)
- **API testing:** Use FastAPI test client or `docker compose exec backend pytest`
- **Build:** No build step — static files served directly by nginx

---

## 9. Reference Index

- `index.html` — all screen markup and feature definitions
- `app.js` — all application logic, gamification, charts, navigation
- `service-worker.js` — offline-first caching strategy
- `nginx.conf` — reverse proxy + static asset serving
- `MASTER_BADGES_DATA` — 12 master badge definitions
- `ROADMAP_TIERS` — 6-tier transformation roadmap definitions
- `REGIONAL_PEER_BENCHMARKS` — K-Means cluster peer cohort data
- `state` — central application state object
- CSS custom properties — brand colors and design tokens

---

**End of Guide**
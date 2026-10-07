# Chess Community — Phase 1 Product & Engineering Specification

**Working title:** ChessDNA  
**Phase:** 1 — Personal Chess Identity  
**Document status:** Product + UX + Engineering specification  
**Primary goal:** Turn a player's public Chess.com game history into a highly visual, entertaining, shareable chess identity/profile.

---

# 1. Product Vision

ChessDNA is a community-first chess product built around the idea:

> **Your chess games tell a story about the player you are.**

Phase 1 is intentionally not a replacement for Chess.com, Lichess, or a traditional chess engine.

The first release should answer one question extremely well:

> **"What kind of chess player am I?"**

A user enters a public Chess.com username. The product imports publicly available game/profile information through the supported Chess.com public API, processes the games, derives meaningful statistics and behavioral patterns, and produces a polished **Chess DNA Profile**.

The output should feel closer to:

- Spotify Wrapped
- a personality test
- a gaming profile
- a sports-card profile
- a shareable social identity

than to a boring chess statistics dashboard.

---

# 2. Phase 1 Product Scope

## Included

1. Landing page
2. Chess.com username input
3. Username validation
4. Public profile lookup
5. Game archive discovery
6. Game import
7. PGN parsing
8. Game normalization
9. Chess statistics calculation
10. Opening detection
11. Time-control analysis
12. Win/loss/draw analysis
13. Color analysis
14. Rating progression
15. Game-length analysis
16. Basic tactical/behavioral heuristics
17. Chess DNA scoring
18. Player archetype
19. Favorite opening
20. Strongest/weakest patterns
21. Biggest game-related highlights
22. Chess Graveyard preview
23. Shareable Chess DNA card
24. Public result URL
25. Responsive mobile/desktop experience
26. Loading/progress experience
27. Error/empty states
28. Privacy-conscious data handling

## Explicitly out of scope for Phase 1

Do not build:

- Live Chess.com game integration
- Chess.com move automation
- Chess.com account authentication unless later required
- Chess.com private game access
- Social feed
- Clubs
- Followers
- Community chat
- Native multiplayer
- Tournaments
- Full chess engine analysis of every move
- AI coach
- Paid subscriptions
- Mobile native application
- Admin dashboard beyond basic operational needs

Phase 1 should be small enough to ship and test.

---

# 3. Product Positioning

## Primary positioning

> **Discover the player behind your chess games.**

## Supporting line

> Import your public Chess.com games and discover your Chess DNA, playing style, habits, strengths, weaknesses, and most memorable games.

## Alternative short taglines

- **Your chess. Your patterns. Your story.**
- **What kind of chess player are you?**
- **Your games reveal more than your rating.**
- **Meet the player behind the board.**

## Product personality

The product should feel:

- intelligent
- playful
- premium
- community-oriented
- slightly humorous
- competitive
- highly visual

It should NOT feel:

- childish
- spammy
- overly AI-generated
- like a generic analytics dashboard
- like an unofficial Chess.com clone
- like a stock admin panel

---

# 4. Core User Journey

The complete Phase 1 journey:

```text
Landing Page
    |
    v
Enter Chess.com Username
    |
    v
Validate Username
    |
    v
Find Public Profile
    |
    v
Find Available Game Archives
    |
    v
Select Analysis Scope
    |
    v
Import Games
    |
    v
Parse + Normalize Games
    |
    v
Calculate Statistics
    |
    v
Calculate Chess DNA
    |
    v
Determine Archetype
    |
    v
Generate Result
    |
    v
Chess DNA Profile
    |
    +----> Chess Graveyard
    |
    +----> Game Highlights
    |
    +----> Share Card
    |
    +----> Copy Result Link
```

---

# 5. Homepage Design

## 5.1 Header

Desktop header:

```text
[♟ Logo / ChessDNA]     How It Works     About       [Analyze My Chess]
```

Mobile:

```text
[♟ ChessDNA]                         [Analyze]
```

## Header behavior

- Logo links to homepage.
- "How It Works" scrolls to explanation section.
- "About" opens a small product information section/page.
- "Analyze My Chess" focuses the username input.
- Header remains visually minimal.
- Do not overload navigation.

---

# 6. Hero Section

The hero is the most important screen.

## Layout

Desktop:

```text
---------------------------------------------------------
|                                                       |
|             YOUR CHESS HAS A PERSONALITY.             |
|                                                       |
|      Discover what your games say about you.          |
|                                                       |
|  [ ♟ Chess.com username                 ] [Analyze]   |
|                                                       |
|      No password required • Public games only         |
|                                                       |
|                  [Sample Profile]                     |
|                                                       |
---------------------------------------------------------
```

## Primary headline

> **Your Chess Has a Personality.**

## Supporting copy

> Import your public Chess.com games and discover your playing style, strengths, weaknesses, favorite openings, habits, and Chess DNA.

## Username field

Placeholder:

`Enter your Chess.com username`

Input requirements:

- minimum 1 character
- trim whitespace
- preserve valid username characters
- prevent accidental empty submissions
- Enter key submits
- autofocus only when appropriate
- visible label for accessibility

## Primary button

Label:

> **Analyze My Chess**

States:

### Default

`Analyze My Chess`

### Hover

Slight elevation / accent treatment.

### Pressed

Subtle scale feedback.

### Loading

`Finding your games...`

### Disabled

Disabled while request is active.

### Error

Button returns to active state.

---

# 7. Hero Secondary Information

Under the input:

> **No password required. Public Chess.com data only.**

Optional small trust indicators:

- Public games
- Read-only
- No Chess.com password
- No account connection required

Do not imply official Chess.com affiliation.

---

# 8. Hero Visual

The right side of desktop hero can show a sample Chess DNA card.

Example:

```text
┌─────────────────────────────┐
│ ♟ CHESSDNA                  │
│                             │
│ ALEX                        │
│                             │
│ THE CHAOS MERCHANT          │
│                             │
│ ⚔ Aggression       87       │
│ 🧠 Tactics          81       │
│ 🎲 Risk             94       │
│ 🛡 Defense           43      │
│ ♟ Endgame            61     │
│                             │
│ SICILIAN DEFENSE            │
│                             │
│ 1,284 GAMES                 │
└─────────────────────────────┘
```

This visual is illustrative and must not claim real data.

---

# 9. How It Works Section

Three steps:

### 01 — Enter your username

> Tell us your public Chess.com username.

### 02 — We analyze your games

> We look at publicly available games and calculate meaningful patterns.

### 03 — Discover your Chess DNA

> Get a personalized profile showing how you actually play.

Visual sequence:

```text
Username
   ↓
Public Games
   ↓
Game Analysis
   ↓
Chess DNA
```

---

# 10. Example Results Section

Show a preview before the user submits.

Sections:

- Chess DNA
- Playing Style
- Favorite Opening
- Game Statistics
- Biggest Habit
- Chess Graveyard
- Share Card

CTA:

> **Analyze My Chess**

---

# 11. Footer

Footer should be minimal.

```text
ChessDNA

Your chess. Your patterns. Your story.

Product
- Analyze Chess
- How It Works

Legal
- Privacy
- Terms

Data
- Public data only
- Not affiliated with Chess.com
```

Important disclaimer:

> ChessDNA is an independent third-party project and is not affiliated with or endorsed by Chess.com.

---

# 12. Username Submission Workflow

When the user clicks **Analyze My Chess**:

## Step 1

Validate input locally.

If empty:

> Please enter a Chess.com username.

If whitespace:

> Please enter a valid username.

## Step 2

Send request to backend.

Example:

```http
POST /api/analyze
Content-Type: application/json

{
  "username": "example"
}
```

## Step 3

Backend normalizes username.

Example:

```text
"  Hikaru  "
        ↓
"hikaru"
```

## Step 4

Check public Chess.com profile.

If not found:

> We couldn't find that Chess.com player.

Actions:

- Try Again
- Change Username

## Step 5

Retrieve available public game archives.

## Step 6

Determine analysis scope.

Recommended Phase 1 default:

> Analyze the most recent 100 public games.

Reason:

- predictable processing time
- reasonable server cost
- fresh representation
- avoids huge imports
- easier MVP

Optional later choices:

- Last 25 games
- Last 100 games
- Last 500 games
- Full history

Do not expose complicated choices in V1 unless performance permits.

---

# 13. Analysis Scope UI

After a valid profile is found, display:

```text
Found your profile.

♟ username
Rating: 1542
Games available: 1,284

Analyze:
(•) Recent 100 games
( ) Recent 500 games

[Analyze My Chess]
```

For the simplest MVP, skip this screen and automatically analyze the latest 100 games.

Recommended MVP:

> **Do not add an extra decision unless needed.**

The ideal flow should be:

```text
Username → Analyze → Results
```

---

# 14. Loading Experience

The analysis process should never show a generic spinner for the entire operation.

Use staged progress.

Example:

```text
Analyzing your chess...

✓ Found your Chess.com profile
✓ Found 1,284 available games
✓ Imported recent games
→ Studying your openings
→ Measuring your playing style
○ Building your Chess DNA
○ Finding your biggest chess crimes
```

Stages:

1. Finding profile
2. Finding games
3. Importing games
4. Parsing games
5. Calculating statistics
6. Detecting patterns
7. Building Chess DNA
8. Preparing your profile

Each completed stage gets a check.

---

# 15. Loading Screen Personality

Avoid:

> Loading...

Prefer:

> **Digging through your chess history...**

Alternative rotating messages:

- "Counting your blunders..."
- "Investigating that questionable queen move..."
- "Studying your opening addiction..."
- "Measuring your aggression..."
- "Looking for suspicious sacrifices..."
- "Building your Chess DNA..."

These should be deterministic or rate-limited, not annoying.

---

# 16. Data Source

Phase 1 should use Chess.com's supported public API.

The product must:

- use public endpoints appropriately
- respect API limitations
- respect rate limits
- cache responses where permitted
- avoid scraping the website
- never request Chess.com passwords
- never automate moves
- never assist users during live competitive games
- clearly distinguish itself from Chess.com

The implementation must verify the current Chess.com API documentation and terms before production launch because API capabilities and policies can change.

---

# 17. Backend Architecture

Recommended architecture:

```text
Frontend
React / Next.js
       |
       v
API Layer
       |
       +----------------------+
       |                      |
       v                      v
Chess.com API             Database
       |                      |
       v                      |
Game Archive                  |
       |                      |
       +----------+-----------+
                  |
                  v
             Game Parser
                  |
                  v
          Statistics Engine
                  |
                  v
          Chess DNA Engine
                  |
                  v
          Result Generator
                  |
                  v
               Frontend
```

---

# 18. Recommended Technology

## Frontend

Recommended:

- Next.js
- TypeScript
- Tailwind CSS
- chess.js for board/game parsing where appropriate
- Recharts or lightweight SVG charts
- Zod for validation if desired

## Backend

Possible:

- Next.js API routes / route handlers
- Node.js
- TypeScript

## Database

For MVP:

- PostgreSQL or MongoDB

Suggested MongoDB structure if using the user's existing MERN comfort zone.

## Optional analysis

- Stockfish WASM for deeper chess evaluation
- Only use engine analysis where it materially improves a feature.
- Do not run Stockfish on every move of every historical game in the initial MVP.

---

# 19. Data Model

## Player

```json
{
  "_id": "internal-id",
  "username": "example",
  "chessComUsername": "example",
  "avatarUrl": null,
  "title": null,
  "country": null,
  "lastFetchedAt": "ISO_DATE",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE"
}
```

## Game

```json
{
  "_id": "internal-id",
  "playerId": "internal-player-id",
  "gameId": "external-game-id",
  "url": "external-url",
  "white": "playerA",
  "black": "playerB",
  "whiteRating": 1500,
  "blackRating": 1520,
  "result": "1-0",
  "timeControl": "600+0",
  "rated": true,
  "rules": "chess",
  "eco": "B20",
  "opening": "Sicilian Defense",
  "termination": "normal",
  "date": "YYYY-MM-DD",
  "pgn": "PGN",
  "moveCount": 72,
  "importedAt": "ISO_DATE"
}
```

## Analysis

```json
{
  "_id": "internal-id",
  "playerId": "internal-player-id",
  "gameCount": 100,
  "wins": 54,
  "losses": 41,
  "draws": 5,
  "whiteGames": 51,
  "blackGames": 49,
  "averageOpponentRating": 1492,
  "favoriteOpening": {
    "name": "Sicilian Defense",
    "count": 24,
    "percentage": 24
  },
  "dna": {
    "aggression": 82,
    "tactics": 77,
    "risk": 88,
    "defense": 49,
    "endgame": 63,
    "speed": 71
  },
  "archetype": {
    "id": "chaos_merchant",
    "name": "The Chaos Merchant"
  },
  "createdAt": "ISO_DATE"
}
```

---

# 20. Game Statistics

Phase 1 should calculate:

## Basic

- total games
- wins
- losses
- draws
- win rate
- loss rate
- draw rate

## Color

- games as White
- games as Black
- White win rate
- Black win rate
- White draw rate
- Black draw rate

## Rating

- starting rating of analyzed period
- latest rating
- highest observed rating
- lowest observed rating
- rating change
- average opponent rating

## Time control

Group into:

- Bullet
- Blitz
- Rapid
- Daily / correspondence where applicable

Calculate:

- percentage by time control
- win rate by time control

## Game length

- average moves per game
- shortest game
- longest game
- median game length if feasible

## Openings

- most played opening
- top 5 openings
- opening frequency
- win rate by opening

---

# 21. Opening Detection

Use PGN metadata where available.

Possible fields:

- ECO
- opening name
- variation

If metadata is incomplete:

- derive opening based on move sequence using an opening database
- otherwise label as "Unknown / Other"

Never invent an opening name.

Example:

```text
Sicilian Defense
24 games
24%

Italian Game
16 games
16%

Queen's Gambit
11 games
11%
```

---

# 22. Chess DNA

This is the central feature.

The DNA should not pretend to be scientific psychological profiling.

Use language such as:

> **Chess playing style based on patterns in your analyzed games.**

## DNA dimensions

Recommended six dimensions:

1. Aggression
2. Tactical tendency
3. Risk-taking
4. Defensive tendency
5. Endgame tendency
6. Speed / time pressure behavior

Scores should be normalized to 0–100.

---

# 23. Aggression Score

Possible signals:

- frequency of early pawn advances toward the opponent king
- frequency of checks
- attacking opening choices
- sacrifices
- king-side attacking patterns
- tactical sequences

Avoid claiming an exact psychological trait.

Display:

> **Aggression — 87/100**

Supporting explanation:

> Your games frequently feature early attacks, tactical pressure, and active piece play.

---

# 24. Tactical Score

Possible signals:

- tactical positions
- forcing move frequency
- checks/captures/threat patterns
- tactical puzzle-like positions
- material swings
- engine-based tactical detection if Stockfish is enabled

Display:

> **Tactical Instinct — 81/100**

---

# 25. Risk Score

Possible signals:

- sacrifices
- sharp openings
- exchange sacrifices
- speculative attacks
- material imbalance
- highly forcing lines

Example:

> **Risk — 94/100**

Description:

> You regularly choose complicated positions instead of quiet ones.

---

# 26. Defense Score

Possible signals:

- defensive openings
- games won after being materially disadvantaged
- frequency of simplifying moves
- survival from inferior positions
- conversion after opponent attacks

Do not equate "defense" with simply playing black.

---

# 27. Endgame Score

Possible signals:

- percentage of games reaching simplified material
- games exceeding a certain move threshold
- endgame positions
- conversion rate in simplified positions

Example:

> **Endgame — 61/100**

---

# 28. Speed Score

Use available clock data when available.

Possible signals:

- average move time
- percentage of games decided by timeout
- time-control distribution
- behavior under short time controls

Example:

> **Speed — 91/100**

Description:

> Blitz is clearly your natural habitat.

---

# 29. Archetypes

The system should assign one primary archetype.

Initial archetypes:

## 1. The Chaos Merchant

Traits:

- high aggression
- high risk
- tactical
- sharp openings

Description:

> You don't just play chess. You create problems and hope your opponent runs out of answers first.

## 2. The Calculator

Traits:

- high tactical
- moderate risk
- strong forcing-move behavior

Description:

> You love positions where every move feels like a puzzle.

## 3. The Fortress

Traits:

- high defense
- low risk
- strong survival patterns

Description:

> Your opponents may attack. They may sacrifice. They may scream. You are still there.

## 4. The Technician

Traits:

- strong endgame
- moderate risk
- stable conversion

Description:

> You are happiest when the fireworks are over and there is a technical position left to convert.

## 5. The Speed Demon

Traits:

- high speed
- high blitz/bullet participation

Description:

> Thinking is optional. Clock management is not.

## 6. The Gambit Goblin

Traits:

- high sacrifice frequency
- sharp openings
- high risk

Description:

> Material is temporary. Initiative is forever.

## 7. The Strategist

Traits:

- lower tactical volatility
- stable opening choices
- positional patterns

Description:

> While everyone else is attacking, you are quietly improving your pieces.

## 8. The Wildcard

Fallback when no strong pattern dominates.

Description:

> Your games refuse to fit into a category. Even the algorithm gave up.

---

# 30. Archetype Selection

Use weighted scoring.

Example:

```text
aggression = 82
tactics = 79
risk = 91
defense = 44
endgame = 48
speed = 63
```

Map the vector to the closest archetype using predefined weighted rules.

Important:

- deterministic
- explainable
- reproducible
- no LLM required

The same game dataset should always produce the same archetype.

---

# 31. "Your Signature"

Generate 2–4 short observations.

Examples:

> You love sharp positions.

> You play significantly more aggressively with White.

> Blitz is your most successful time control.

> Your Sicilian games are your most common battles.

> You perform better in long games than bullet.

These should come from actual calculated data.

Never invent observations.

---

# 32. "Your Biggest Habit"

Pick one statistically meaningful pattern.

Examples:

> **You play fast.**

> You lose a significant percentage of games after entering time pressure.

Or:

> **You love the Sicilian.**

Or:

> **Your best results come from rapid games.**

Only show the insight when there is sufficient sample size.

Minimum recommendation:

- opening insight: >= 5 games
- time-control insight: >= 5 games
- color insight: >= 5 games
- rating insight: enough games for meaningful comparison

Otherwise use:

> Not enough games to identify a strong pattern yet.

---

# 33. Chess Graveyard — Phase 1 Preview

Phase 1 does not need a complete social graveyard.

Create a personal section:

> **Your Chess Graveyard**

Potential categories:

- shortest loss
- biggest rating upset loss
- largest evaluation swing if engine analysis is enabled
- timeout loss
- most repeated losing opening
- longest losing streak

Example:

```text
💀 THE FASTEST DISASTER

You lost in 8 moves.

Opening:
Sicilian Defense

Result:
0–1
```

Another:

```text
💀 YOUR WORST HABIT

You lost 7 of your last 11
games after entering time trouble.
```

The system should avoid insulting the user personally.

Humor should target the chess situation, not the person.

---

# 34. Game Highlights

Select up to 3 highlights.

Possible categories:

### Best win

Strongest opponent defeated relative to player's rating.

### Longest game

Highest move count.

### Biggest upset

Largest rating difference in a win.

### Best streak

Longest consecutive wins.

### Most played opening

Highest frequency.

### Most dramatic game

If engine evaluation is available, largest evaluation swing.

Without engine data, use game/result/rating heuristics.

---

# 35. Results Page

This is the most important screen.

## Header

```text
AKIL'S CHESS DNA

THE CHAOS MERCHANT

Based on 100 recent public games
```

Small data source:

> Analysis generated from publicly available Chess.com game data.

---

# 36. Results Page Layout

Desktop:

```text
---------------------------------------------------------
|                    CHESS DNA                          |
|                                                     |
|       THE CHAOS MERCHANT                            |
|                                                     |
|     [DNA visual / radar / bars]                     |
|                                                     |
|  Aggression   87     Tactics      81                |
|  Risk         94     Defense      43                |
|  Endgame      61     Speed        72                |
|                                                     |
---------------------------------------------------------

---------------------------------------------------------
| GAME STATS       | FAVORITE OPENING                 |
|                  |                                  |
| 100 Games        | Sicilian Defense                 |
| 54 Wins          | 24 Games                         |
| 41 Losses        | 56% Win Rate                     |
| 5 Draws          |                                  |
---------------------------------------------------------

---------------------------------------------------------
| YOUR CHESS SIGNATURE                                |
|                                                     |
| "You thrive in sharp positions..."                  |
---------------------------------------------------------

---------------------------------------------------------
| CHESS GRAVEYARD                                     |
|                                                     |
| 💀 Fastest Loss   💀 Biggest Upset Loss             |
---------------------------------------------------------

                    [Share My Chess DNA]
```

---

# 37. Results Header

Show:

- Username
- Chess.com profile link where appropriate
- analyzed game count
- generated date
- analysis scope

Example:

> **Based on your 100 most recent public games**

Avoid claiming "all games" if only 100 were analyzed.

---

# 38. DNA Visualization

Recommended:

- horizontal bars for accessibility
- optional radar chart for visual appeal

Use both only if they don't clutter.

Example:

```text
Aggression       █████████░ 87
Tactics          ████████░░ 81
Risk             ██████████ 94
Defense          ████░░░░░░ 43
Endgame          ██████░░░░ 61
Speed            ███████░░░ 72
```

Every score should have a short explanatory tooltip or description.

---

# 39. Statistics Card

```text
GAMES
100

WINS
54

LOSSES
41

DRAWS
5
```

Add:

- win rate
- average opponent rating
- most played time control
- favorite color if statistically meaningful

---

# 40. Opening Card

Show:

```text
YOUR OPENING

Sicilian Defense

24 / 100 games

Win rate: 58%

Your most-used opening.
```

Secondary:

> View top openings

Expandable list:

```text
1. Sicilian Defense — 24
2. Italian Game — 16
3. Queen's Gambit — 11
4. Caro-Kann — 8
5. French Defense — 7
```

---

# 41. Color Performance Card

```text
WHITE

51 games
59% score

BLACK

49 games
48% score
```

Use "score" carefully:

Chess score percentage can be:

`(wins + 0.5 * draws) / games * 100`

Clearly label the metric.

---

# 42. Time Control Card

Example:

```text
YOUR BATTLEFIELD

Blitz       61%
Rapid       27%
Bullet      12%

Best performance:
Rapid
```

Do not infer a best performance unless the sample is sufficient.

---

# 43. Rating Journey

If rating metadata exists:

Show:

```text
Rating
1600 |                         ●
     |                    ●
1500 |              ●  ●
     |        ●  ●
1400 |  ● ●
     +-------------------------
       Older              Newer
```

Features:

- starting rating
- latest rating
- peak rating
- net change

Do not draw misleading straight lines when only sparse points exist.

---

# 44. Share Experience

Primary CTA:

> **Share My Chess DNA**

On click:

1. Create shareable result state.
2. Generate/share URL.
3. Provide social-friendly card.
4. Copy link.

Buttons:

- Copy Link
- Download Card
- Share

If browser-native share is unavailable, hide the native share option.

---

# 45. Share Card

Recommended aspect ratio:

**1:1**

Example:

```text
┌──────────────────────────────┐
│ ♟ CHESSDNA                   │
│                              │
│ AKIL                         │
│                              │
│ THE CHAOS MERCHANT           │
│                              │
│ ⚔ Aggression       87        │
│ 🧠 Tactics          81        │
│ 🎲 Risk             94        │
│ 🛡 Defense           43       │
│                              │
│ Favorite: Sicilian Defense   │
│                              │
│ 100 games analyzed           │
│                              │
│ chessdna.example             │
└──────────────────────────────┘
```

Do not copy Chess.com's visual identity.

---

# 46. Public Result URL

Example:

```text
/chess-dna/hikaru
```

or:

```text
/profile/hikaru
```

Better for generated analysis:

```text
/dna/hikaru
```

If storing snapshots:

```text
/dna/hikaru/2026-10
```

But MVP can use a stable profile result.

---

# 47. Public Result Privacy

Default:

- Public result can be generated from public data.
- Do not expose private account information.
- Do not expose email addresses.
- Do not expose internal database IDs.
- Do not expose raw API responses.
- Do not expose unnecessary opponent personal data.

If users can later claim/control their profile, add privacy settings.

---

# 48. Error States

## Username not found

```text
We couldn't find that player.

Check the username and try again.

[Try Again]
```

## No games found

```text
We found the profile, but couldn't find public games to analyze.

Try another player.
```

## API unavailable

```text
Chess data is temporarily unavailable.

Please try again in a few minutes.
```

## Rate limited

```text
We're receiving too many requests right now.

Please try again shortly.
```

## Parsing failure

```text
Some games couldn't be processed.

We analyzed the games that were valid.
```

Do not fail the entire analysis because one PGN is malformed.

---

# 49. Partial Data Handling

If 100 games are requested but only 87 are valid:

Show:

> **87 games analyzed**

Never say 100.

If fewer than 10 valid games exist:

> Your profile is still forming.

Show basic stats but reduce confidence of DNA insights.

Example:

> **Early Chess DNA**
>
> We need more games before your patterns become reliable.

---

# 50. Minimum Sample Thresholds

Recommended:

## 1–4 games

No archetype.

Show:

> Play a few more games to unlock your Chess DNA.

## 5–9 games

Basic stats only.

## 10–24 games

Basic DNA with low-confidence indicator.

## 25–99 games

Normal DNA.

## 100+ games

Full Phase 1 profile.

---

# 51. Confidence

Do not present DNA scores as scientific facts.

Possible UI:

```text
Chess DNA confidence
████████░░ 82%
```

Confidence should be primarily based on sample size and signal consistency.

Suggested:

- 10 games → low
- 25 games → medium
- 50 games → good
- 100 games → high

Do not overcomplicate this in MVP.

---

# 52. API Endpoints

## Analyze

```http
POST /api/analyze
```

Request:

```json
{
  "username": "example"
}
```

Response:

```json
{
  "analysisId": "abc123",
  "status": "completed",
  "profile": {}
}
```

For long-running processing:

```json
{
  "analysisId": "abc123",
  "status": "processing"
}
```

---

## Status

```http
GET /api/analyze/:analysisId
```

Response:

```json
{
  "status": "processing",
  "progress": 62,
  "stage": "building_dna"
}
```

---

## Result

```http
GET /api/dna/:username
```

Returns normalized public result data.

---

# 53. Caching Strategy

Cache public profile/game data where allowed by the applicable API terms.

Possible keys:

```text
player:{username}
games:{username}:{archive}
analysis:{username}:{scope}
```

Recommended:

- profile cache: hours
- archive/game cache: configurable
- analysis cache: reuse until data is stale

Never blindly cache forever.

---

# 54. Duplicate Analysis Prevention

If a user repeatedly enters the same username:

1. Check recent analysis cache.
2. If current enough, return cached result.
3. Otherwise refresh.

UI:

> **Updated 2 hours ago**

Button:

> Refresh Analysis

Do not automatically re-download hundreds of games on every page load.

---

# 55. Rate Limiting

Protect:

```http
POST /api/analyze
```

Possible MVP limit:

- per IP
- per username
- per time window

Example:

> 5 analysis requests / 10 minutes / IP

Exact production limits should be tuned after observing usage.

---

# 56. Security

Never trust:

- username
- API response fields
- PGN text
- external URLs
- image URLs

Sanitize output.

Prevent:

- SSRF
- injection
- malicious PGN payloads
- oversized input
- unbounded archive processing
- API abuse

Set maximum:

- username length
- number of archives
- number of games
- PGN size
- analysis duration

---

# 57. Performance Targets

Target:

- homepage first meaningful render: fast
- username submission acknowledgement: < 500ms ideally
- result generation: preferably < 15 seconds for 100 games
- cached analysis: < 2 seconds
- mobile result page: smooth scrolling
- no unnecessary engine calculation

If processing exceeds expected time, use a background job.

---

# 58. Background Processing

Recommended if analysis grows:

```text
POST /api/analyze
        |
        v
Create Analysis Job
        |
        v
Queue
        |
        v
Worker
        |
        +--> Fetch profile
        +--> Fetch archives
        +--> Fetch games
        +--> Parse PGNs
        +--> Calculate stats
        +--> Calculate DNA
        +--> Save result
        |
        v
Completed
```

For an MVP, synchronous processing can be used if it consistently completes within acceptable limits.

---

# 59. Frontend State Machine

States:

```text
IDLE
 |
 v
SUBMITTING
 |
 +--> ERROR
 |
 v
FETCHING_PROFILE
 |
 v
FETCHING_GAMES
 |
 v
ANALYZING
 |
 v
COMPLETED
```

Possible additional:

```text
PARTIAL_SUCCESS
```

---

# 60. Button Inventory

Every primary interactive element must be defined.

## Header

- Logo
- How It Works
- About
- Analyze My Chess

## Hero

- Username input
- Analyze My Chess

## Results

- View Chess.com Profile
- View Top Openings
- View Rating Journey
- View Graveyard
- Share My Chess DNA
- Copy Link
- Download Card
- Analyze Another Player

## Errors

- Try Again
- Change Username

Do not add buttons that don't have implemented behavior.

---

# 61. Keyboard Interaction

Username input:

- Enter → submit
- Escape → clear optional

Accessibility:

- visible focus
- proper label
- keyboard accessible buttons
- semantic headings
- alt text for meaningful images
- chart data should have text equivalents

---

# 62. Responsive Design

## Mobile

Primary layout:

```text
Hero
↓
Username input
↓
Analyze button
↓
DNA
↓
Stats
↓
Opening
↓
Insights
↓
Graveyard
↓
Share
```

Cards become single-column.

## Tablet

2-column cards where appropriate.

## Desktop

2–3 column composition.

Never allow critical information to require horizontal scrolling.

---

# 63. Visual Design System

## Overall

Premium dark chess aesthetic.

Suggested base:

```text
Background: near-black / deep charcoal
Surface: dark graphite
Text: warm white
Muted text: cool gray
Accent: one recognizable brand accent
```

Avoid copying Chess.com's exact color system.

## Typography

Use:

- modern sans-serif for UI
- optional serif/display font for major identity headline

Typography hierarchy:

```text
Hero: 56–72px desktop
Page title: 40–48px
Section title: 24–32px
Card title: 18–22px
Body: 15–17px
Metadata: 12–14px
```

Mobile:

```text
Hero: 38–44px
Page title: 30–36px
Section title: 22–26px
```

---

# 64. Visual Language

Use:

- subtle borders
- restrained gradients
- clean cards
- large numbers
- progress bars
- chess-piece motifs
- minimal grid textures
- small motion

Avoid:

- excessive neon
- excessive glassmorphism
- huge shadows
- noisy chessboard backgrounds
- too many animations

---

# 65. Animation

Use motion only where it reinforces discovery.

Examples:

- DNA bars animate from 0 → score
- result cards fade in sequentially
- archetype reveal
- number count-up

Respect:

```css
prefers-reduced-motion
```

Do not animate the entire page.

---

# 66. Archetype Reveal

This can be the emotional climax.

Loading screen:

```text
Your Chess DNA is ready.

You are...

...
...
...

THE CHAOS MERCHANT
```

Then:

> **You thrive when the position gets complicated.**

Follow with DNA metrics.

The reveal should be fast and tasteful.

---

# 67. Humor Rules

Humor is important, but it must be:

- playful
- chess-specific
- non-abusive
- generated from actual data
- never humiliating

Good:

> Your queen appears to enjoy sightseeing.

Bad:

> You're terrible at chess.

Good:

> Your clock seems to be your strongest opponent.

Bad:

> You're stupid.

---

# 68. Data Accuracy Rules

The product must distinguish:

## Facts

Example:

> You played 24 Sicilian games.

## Calculated metrics

Example:

> Your win rate was 58%.

## Heuristics

Example:

> Your playing style leans aggressive.

## Entertainment

Example:

> You're a Chaos Merchant.

The UI should not blur these categories.

---

# 69. AI Usage

AI is optional in Phase 1.

Prefer deterministic calculations for:

- statistics
- scoring
- archetype
- rankings
- openings
- win rates

Use AI only for:

- rewriting already-calculated insights into natural language
- generating playful commentary
- future game summaries

Never let an LLM invent statistics.

Recommended pipeline:

```text
Raw games
   ↓
Deterministic analysis
   ↓
Structured facts
   ↓
Optional LLM wording
   ↓
UI
```

---

# 70. Stockfish Usage

Do not require Stockfish for the initial release.

If included:

Use it selectively for:

- biggest blunder
- biggest evaluation swing
- best move
- most dramatic game

Do NOT:

- analyze every move of every imported game by default
- provide live-game assistance
- suggest moves during active Chess.com games

Phase 1 should remain primarily historical and retrospective.

---

# 71. Chess.com Integration Boundary

The product should be clearly independent.

Do:

- use supported public APIs
- link back to Chess.com where useful
- attribute public game data appropriately
- respect current API terms
- respect rate limits

Do not:

- scrape pages
- automate Chess.com
- submit moves to Chess.com
- request passwords
- imitate Chess.com's official branding
- imply partnership
- provide live competitive assistance

Before launch, verify current API documentation, branding requirements, terms, and attribution requirements.

---

# 72. Analytics

Track product events, not sensitive data.

Events:

```text
landing_viewed
username_submitted
username_validation_failed
profile_found
profile_not_found
analysis_started
analysis_completed
analysis_failed
result_viewed
share_clicked
share_link_copied
card_downloaded
analyze_another_clicked
```

Useful properties:

- analysis scope
- game count
- processing duration
- success/failure category

Avoid logging raw PGNs or unnecessary personal data.

---

# 73. Success Metrics

Phase 1 success should be measured by:

## Activation

Percentage of visitors who submit a username.

## Completion

Percentage of submitted analyses that finish.

## Result engagement

Percentage that scroll through the results.

## Share rate

Percentage that click Share.

## Repeat usage

Percentage that return and analyze again.

## Viral loop

Percentage of shared-result visitors who analyze their own username.

The most important early metric:

> **Share rate per completed analysis.**

If people share their Chess DNA, the concept is working.

---

# 74. SEO

Initial public pages:

```text
/
 /how-it-works
 /dna/:username
```

Homepage metadata:

Title:

> ChessDNA — Discover Your Chess Personality

Description:

> Analyze your public Chess.com games and discover your chess playing style, strengths, habits, favorite openings, and Chess DNA.

Public profile metadata should be dynamically generated.

Example:

> Akil's Chess DNA — ChessDNA

Avoid exposing unnecessary game data in search snippets.

---

# 75. OG / Social Preview

Every public DNA result should generate a social preview.

Example:

```text
Akil is...

THE CHAOS MERCHANT 🔥

ChessDNA

100 games analyzed
Aggression 87
Tactics 81
Risk 94
```

Use Open Graph image generation if infrastructure permits.

---

# 76. Empty States

## No profile

Friendly, direct.

## Not enough games

```text
Your Chess DNA is still loading...

We need a few more games to find reliable patterns.
```

## Unsupported game types

Skip unsupported games and report the count.

Example:

> 93 standard chess games analyzed.
> 7 unsupported games skipped.

---

# 77. Partial Failure

If 100 games are requested and 12 fail parsing:

Do not show a hard error.

Show:

> **88 games successfully analyzed**

Optional:

> 12 games couldn't be processed.

Keep technical details hidden unless useful.

---

# 78. Result Refresh

Button:

> **Refresh Analysis**

When clicked:

1. confirm if needed
2. fetch current data
3. invalidate stale cache
4. regenerate analysis
5. update timestamp

Do not refresh automatically every page load.

---

# 79. Analyze Another Player

At bottom:

> **Curious about someone else?**

Button:

> Analyze Another Player

Returns to username input.

No confirmation needed.

---

# 80. Component Architecture

Suggested components:

```text
app/
  page.tsx

  analyze/
    page.tsx

  dna/
    [username]/
      page.tsx

components/
  Header
  Hero
  UsernameInput
  HowItWorks
  SampleDNA
  AnalysisProgress
  DNAProfile
  DNAStat
  ArchetypeCard
  GameStats
  OpeningCard
  ColorPerformance
  TimeControlCard
  RatingChart
  SignatureInsights
  ChessGraveyard
  HighlightCard
  ShareCard
  ShareActions
  Footer
  ErrorState
```

---

# 81. Backend Modules

```text
server/
  chess/
    profile.service.ts
    archives.service.ts
    games.service.ts
    pgn.parser.ts

  analysis/
    statistics.service.ts
    openings.service.ts
    dna.service.ts
    archetype.service.ts
    highlights.service.ts
    graveyard.service.ts

  cache/
    cache.service.ts

  api/
    analyze.controller.ts
    result.controller.ts
```

---

# 82. Analysis Pipeline

```text
1. Normalize username

2. Fetch profile

3. Validate profile

4. Fetch archive list

5. Select latest archives

6. Fetch games

7. Filter supported games

8. Normalize game metadata

9. Parse PGNs

10. Calculate basic statistics

11. Calculate opening statistics

12. Calculate time-control statistics

13. Calculate rating statistics

14. Calculate behavioral heuristics

15. Calculate DNA scores

16. Determine archetype

17. Generate insights

18. Generate graveyard highlights

19. Save analysis snapshot

20. Return result
```

---

# 83. Deterministic Result Example

Input:

```text
100 games
54 wins
41 losses
5 draws

Sicilian: 24 games
Blitz: 61 games
Rapid: 27 games

Aggression: 82
Tactics: 79
Risk: 91
Defense: 44
Endgame: 48
Speed: 72
```

Output:

```json
{
  "archetype": "chaos_merchant",
  "confidence": 0.89,
  "headline": "THE CHAOS MERCHANT",
  "insights": [
    "You frequently choose sharp positions.",
    "The Sicilian is your most-used opening.",
    "Blitz is your most common battlefield."
  ]
}
```

---

# 84. Testing Requirements

## Unit tests

Test:

- username normalization
- win/loss/draw calculation
- color calculation
- opening frequency
- time-control classification
- rating calculation
- DNA scoring
- archetype selection
- confidence calculation

## Integration tests

Test:

- Chess.com profile retrieval
- archive retrieval
- PGN parsing
- complete analysis pipeline

## UI tests

Test:

- empty input
- invalid username
- loading state
- success state
- partial failure
- no games
- mobile layout
- share interaction

---

# 85. Critical Edge Cases

Handle:

- username case differences
- renamed/deleted users
- players with no public games
- malformed PGN
- unsupported game types
- missing rating
- missing opening metadata
- missing clock data
- extremely large archive history
- duplicate games
- API timeout
- API rate limit
- temporary Chess.com outage
- partial game retrieval
- games with unusual termination
- abandoned games
- timeout games
- draw by repetition
- insufficient sample size

---

# 86. Abuse Prevention

A public username endpoint can be abused.

Implement:

- request rate limiting
- caching
- maximum analysis size
- concurrency limits
- request timeout
- job cancellation where practical
- monitoring

Do not expose raw upstream error details.

---

# 87. MVP Definition of Done

Phase 1 is complete when a user can:

1. Open homepage.
2. Enter a Chess.com username.
3. Submit with one button.
4. Receive clear loading progress.
5. Have public games retrieved.
6. Have valid games parsed.
7. See accurate basic statistics.
8. See favorite openings.
9. See time-control distribution.
10. See color performance.
11. See rating movement where available.
12. Receive Chess DNA scores.
13. Receive a deterministic archetype.
14. Receive meaningful insights.
15. See Chess Graveyard highlights.
16. Share the result.
17. Open a public result URL.
18. Analyze another player.
19. Use the experience on mobile.
20. Encounter graceful errors when data is unavailable.

---

# 88. Recommended Build Order

## Sprint 1 — Foundation

- project setup
- design system
- homepage
- username input
- API integration
- profile lookup

## Sprint 2 — Data

- archive retrieval
- game retrieval
- PGN parsing
- normalization
- database/cache

## Sprint 3 — Analytics

- statistics
- openings
- time controls
- rating
- color performance

## Sprint 4 — Chess DNA

- scoring engine
- archetypes
- confidence
- insights
- graveyard

## Sprint 5 — Results UX

- results page
- animations
- charts
- responsive layout
- loading experience
- error states

## Sprint 6 — Sharing

- public result route
- OG image
- share card
- copy link
- download card

## Sprint 7 — Polish

- accessibility
- performance
- rate limiting
- API error handling
- analytics
- SEO
- final testing

---

# 89. Recommended MVP Cut

If development starts becoming too large, keep only:

```text
Homepage
   ↓
Username
   ↓
Chess.com Public Data
   ↓
100 Games
   ↓
Statistics
   ↓
Chess DNA
   ↓
Archetype
   ↓
Share Card
```

Everything else can wait.

The product's first test is not:

> "Can we build a massive chess community?"

It is:

> **"Will chess players care enough about their Chess DNA to share it?"**

---

# 90. Phase 1 Product Experience in One Screen

The final experience should feel like this:

```text
                    ♟ CHESSDNA

              YOUR CHESS HAS A
                 PERSONALITY.

        [ Enter Chess.com username ]

                [ ANALYZE MY CHESS ]

                 ↓

        "Analyzing your chess..."

          ✓ 100 games found
          ✓ Openings analyzed
          ✓ Playing patterns found
          ✓ Chess DNA calculated

                 ↓

              AKIL

         THE CHAOS MERCHANT

      ⚔ Aggression       87
      🧠 Tactics          81
      🎲 Risk             94
      🛡 Defense           43
      ♟ Endgame            61
      ⏱ Speed              72

                 ↓

          YOUR SIGNATURE

     "You thrive in sharp positions.
      Your games are rarely boring."

                 ↓

          FAVORITE OPENING

          SICILIAN DEFENSE

                 ↓

          CHESS GRAVEYARD

       💀 Fastest Disaster
       💀 Biggest Upset Loss
       💀 Worst Habit

                 ↓

        [ SHARE MY CHESS DNA ]

                 ↓

          "Analyze Another Player"
```

---

# 91. Final Product Principle

The product should not try to prove that it is the smartest chess engine.

It should make the user say:

> **"Holy shit, that's actually me."**

That is the Phase 1 goal.

The engine/data layer creates credibility.

The personality layer creates entertainment.

The visual profile creates identity.

The share card creates distribution.

The Chess.com integration creates the initial data source.

The future community layer creates retention.

Therefore the strategic progression is:

```text
PHASE 1
Personal Identity
        ↓
PHASE 2
Daily Challenges + Chess Graveyard
        ↓
PHASE 3
Community + Profiles + Clubs
        ↓
PHASE 4
Competition + Tournaments
        ↓
PHASE 5
Full Chess Social Network
```

**Phase 1 should be polished enough that one player can generate their profile and immediately want to send it to another chess player.**

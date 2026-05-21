# Power Line — Development Log & Blueprint

This document captures every feature, fix, pattern, and decision made during development of the Power Line Producer Workflow app. It serves as a blueprint for applying the same work to other LMOC ministry apps.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5 |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 4 + custom glass-panel theme |
| UI components | Radix UI via shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner (toast) |
| Confetti | react-confetti |
| State persistence | localStorage (no backend needed) |
| Monorepo | pnpm workspaces |
| Deployment target | GitHub Pages (static) |

---

## Architecture Decisions

### localStorage over a Database
For a single-user rotating-producer tool, localStorage is the right call. No Neon/PostgreSQL needed. Reasons:
- One producer per week, one device
- Slack reports serve as the permanent historical record
- GitHub Pages is static — no server possible anyway
- Export/Import JSON fills the gap for cross-device or backup needs

### Slack as the Archive
The app generates two formatted Slack reports (Pre-Show and Broadcast Complete) that the producer copy-pastes to `#Power-Line-General`. Slack becomes the permanent record. This eliminates the need for database history.

### PWA for Team Distribution
The app is a Progressive Web App — team members install it to their phone home screen via Safari/Chrome without an app store. Works offline after first load.

---

## Features Built

### Core Checklist
- 49 tasks across 4 phases (Schedule, Connect, Prepare, Produce)
- Task tags: Slack, Restream, Run Sheet, Producer Lead, New Host/Guest, A/V Check, Time-sensitive
- Per-task notes (expandable)
- Section grouping within phases
- Check All / Uncheck All per phase
- Phase reset with undo toast
- Phase completion confetti celebration
- Overall progress bar + per-phase progress indicators

### Session Info Panel
- Stream Date (date picker, defaults to next Wednesday)
- Host name + Producer name fields
- Guest / Co-Host management: add, remove, rename inline, toggle New/Returning
- New guest flag highlights all related tasks in red throughout the checklist

### Smart Banner
- Context-aware banner that changes message based on day/time (CST)
- Sunday before noon: Phase 1 deadline reminder
- Sunday after noon: deadline passed warning
- Mon–Tue: next broadcast reminder
- Wednesday pre-show: countdown with specific prep instructions
- Wednesday 8 PM – 9:15 PM: LIVE NOW indicator
- Post-broadcast: completion message
- Fixed: replaced undefined Tailwind tokens (`bg-warning`, `bg-success`) with concrete `amber`/`green` classes

### Countdown Timer
- Live countdown to next Wednesday 8:00 PM CST (updates every second)
- Format: days + hrs:min:sec → hrs:min:sec (same day) → min:sec (under 1 hour)
- Shows "Today", "Tomorrow", or full date label
- LIVE NOW badge during broadcast (8:00 PM – 9:15 PM)
- Color: normal → amber (same day) → red pulsing (under 1 hour)

### Wednesday Timeline
- Full Wednesday night schedule with live "You Are Here" marker
- Marker advances based on real clock time (CST), not checkbox completion
- Past events shown as strikethrough/dimmed
- Active event highlighted in red
- Resets to neutral after Wednesday 9 PM (fixed frozen-timeline bug)

### Bumper List
- Full preset bumper list + custom bumper support
- Add/remove custom bumpers
- Check off which bumper was used
- Reset with confirm dialog
- Red border flash on empty add attempt

### Session Notes
- Freeform textarea, auto-saved to localStorage
- Clear button (fixed: now shows for any non-empty string, including whitespace)
- Included in Slack reports

### Slack Reports (SessionRecap)
Two staged reports that unlock based on phase completion:

**Pre-Show Setup Report**
- Unlocks when Phase 1 (Schedule) + Phase 2 (Connect) are both 100% complete
- Includes: stream date, host, producer, guests, all Phase 1+2 tasks with completion status, notes
- Send to Slack after scheduling is done, before Wednesday

**Broadcast Complete Report**
- Unlocks when all 4 phases are 100% complete
- Includes: full session summary, all phases with completion status, any incomplete items, bumper used, session notes
- Send to Slack after the stream ends

Both reports: Preview & Copy button → expandable text preview → Copy for Slack button → paste to `#Power-Line-General`

### New Week Detection
- Tracks current broadcast week in localStorage via the upcoming Wednesday date
- On page load and tab visibility change: checks if a new week has started
- If new week detected: shows banner with options:
  - **Export Last Week** (amber, recommended first step)
  - **Start Fresh** (clears all data, resets to new week)
  - **Keep Last Week's Data** (dismisses banner)

### Export / Import
- **Export**: snapshots all localStorage data (checklist state, notes, bumpers, guests, session info, week ID) into a dated `.json` file (e.g. `powerline-2026-03-25.json`)
- **Import**: reads a `.json` file, restores all data to localStorage, reloads the page
- Buttons in the Overall Progress section alongside Reset All
- Acts as a manual save point — cross-device transfer, accidental-clear recovery

### Export Prompts (Safety Net)
- New Week banner: "Export Last Week" button with amber warning before "Start Fresh"
- Reset All: confirm dialog explicitly mentions using Export as a backup first

### Browser Notifications
7 scheduled notifications across the broadcast week:
| Time | Alert |
|------|-------|
| Sunday 11:30 AM CST | Stream scheduling deadline in 30 min |
| Wednesday 6:30 PM CST | Go-live in 90 minutes |
| Wednesday 7:55 PM CST | Pre-broadcast prayer NOW |
| Wednesday 7:58 PM CST | Queue Intro Video — 2 min to broadcast |
| Wednesday 8:00 PM CST | GO LIVE |
| Wednesday 8:28 PM CST | Bumper Video in 2 minutes |
| Wednesday 8:55 PM CST | Wrap-up: final prayer coming |

- Toggle on/off in the Overall Progress section
- Requests browser permission on first enable
- Fixed: moved fired Set to useRef so it persists across effect re-runs (deduplication)

### Live Clock
- Displays current time in CST in the page header

### Stats Widget
- Tasks completed / total
- Phases completed count
- Next incomplete task with phase label

---

## Bugs Fixed

| Bug | File | Fix |
|-----|------|-----|
| Undefined CSS tokens (`bg-warning`, `bg-success`) | SmartBanner.tsx | Replaced with `amber-500` / `green-500` Tailwind classes |
| Notification fired Set recreated on effect re-run | use-notifications.ts | Moved to `useRef` so it persists across enable/disable toggles |
| No way to edit guest name after adding | SessionHeader.tsx | Added inline edit mode per guest (pencil icon → input → Enter/blur saves) |
| Phase reset had no undo | PhaseView.tsx | Replaced `confirm()` with undo toast (consistent with Check All) |
| Bumper reset had no confirmation | BumperList.tsx | Added `confirm()` before reset |
| No feedback when adding empty bumper | BumperList.tsx | Red border flash on empty submit attempt |
| Timeline frozen after Wednesday 9 PM | Timeline.tsx | Reset `activeIndex` to -1 when outside broadcast window |
| Clear button hidden for whitespace-only notes | SessionNotes.tsx | Changed `notes.trim()` check to `notes.length > 0` |

---

## UX Patterns Established

### Undo Toast vs. Confirm Dialog
- **Undo toast** (sonner): for reversible actions — phase reset, check all. Non-blocking, modern feel.
- **Confirm dialog**: for irreversible actions — Reset All, bumper reset, clear notes.

### Export Before Destructive Actions
Any button that wipes data should warn the user to export first. Implemented in:
- New Week banner (Export Last Week button + amber warning)
- Reset All confirm dialog (mentions Export in the message)

### Tag-Based Task Highlighting
Tasks tagged `New Host/Guest` are highlighted in red when any guest is marked as new. Pattern: boolean flag from state → highlight class on TaskCard. Applicable to any conditional task visibility need.

### Phase-Aware Slack Reports
Generate formatted text reports that unlock only when relevant phases are complete. Copy-to-clipboard with visual feedback (Check icon after copy). Paste into team Slack channel.

---

## Documentation Created

### TEAM_GUIDE.md
Plain-language guide for non-technical volunteers covering:
- PWA installation (iPhone + Android)
- Weekly rotation concept
- All 4 phases step by step with timing
- Every feature explained
- Notification matrix (time, alert, action)
- Export/Import as save feature
- Task tag reference
- Tips for new producers

---

## Applying This to Another App (Blueprint)

To replicate this setup for a new LMOC ministry checklist app:

1. **Structure**: 4 phases or logical groupings → sections within each → individual tasks
2. **State**: `useWorkflow` hook with localStorage persistence for all data
3. **Smart Banner**: context-aware message based on day/time relevant to that ministry's schedule
4. **Countdown**: target time specific to that ministry's event
5. **Timeline**: key milestones for that event's schedule
6. **Slack Reports**: one or two staged reports that unlock at logical completion points
7. **New Week Detection**: track week via next occurrence of the recurring event date
8. **Export/Import**: same pattern — export all localStorage keys to dated JSON
9. **Notifications**: schedule alerts at key pre-event times
10. **Team Guide**: document tailored to that ministry's team and workflow
11. **Deploy**: GitHub Pages via Vite with `base: basePath`

---

*Power Line Producer Workflow · Living Manna Church · Built March 2026*

---

## LMOC Broadcast Workflow — Checklist Update (May 2026)

Updated all three role checklists from the "LMOC Broadcast Team Checklist updated.docx" source document.

### Technical Director — New & Updated Tasks
| Change | Detail |
|--------|--------|
| New task | Power on Cameras 1–4 and cooling fans via web power switch (IP 192.168.1.102 from Alabama servers) |
| Updated | SD card minimum storage: 1hr 20min → **2 hours** per card |
| Updated | Audio monitor list now explicitly names Ivor's mic, Atonte's mic, and Stream Out as OFF; clarifies all others stay ON so crew can hear via Slack |
| Updated | Virtual guest communication: 'red' the "Broadcast Team (Slack)" audio channel to speak to guests in the LS6 waiting room; physical studio comms routed through Comms role |
| New task (post) | Leave cameras powered on ~10 minutes after sermon ends before shutting down — cameras need time to write footage to SD cards |
| Updated | Camera recording during sermon now explicitly split: Comms records via each camera server; TD records LS6 |

### Comms / Backup Director — New & Updated Tasks
| Change | Detail |
|--------|--------|
| Updated | Audio input specifics: LMC-Comms = "MG-XU" mic; LS6-Audio = "Cable Creation" mic |
| New task | Refresh sermon slides link moments before sermon starts (ideally during bumper video) |
| New task | Mute/unmute Slack and LS6 audio in earpiece and/or studio on TD's command via LMC-Earpiece server |
| New tasks | RECORD Cameras 1–4 from each server at sermon start; adjust remotely on TD's command; stop when sermon ends |
| New task | Work with Graphics to sync table and wall backdrop for sermon (rotating slides) — start both presentations simultaneously |
| New task | Danny & Jackie Clark setup: launch Vimeo guest link in Chrome on LMC-Clark server; video = CamLink 4k, audio = Volt |

### Graphics Host — New & Updated Tasks
| Change | Detail |
|--------|--------|
| **Deadline changed** | Graphics prep deadline moved from **Thursday** night → **Wednesday** night (9 PM CST) |
| New task | Work with Comms to set up table and wall backdrop for the sermon |
| New task | Be ready to take over Slides via Slides server using arrow keys if pastor's clicker fails |

### Notifications Updated
- Graphics deadline notification moved from Thursday 8:30 PM → **Wednesday 8:30 PM**
- Team setup reminder corrected to 10:30 AM (30 min before 11 AM arrival)
- Wrap-up notification corrected to 3:45 PM (15 min before 4 PM service end)

### BumperList Wired Up
- `BumperListWidget` was built but not connected. Added bumper state (used set + custom bumpers) to `useWorkflow`, with localStorage persistence, export/import inclusion, and Reset All clearing.
- Widget now appears in the sidebar on the Home page.

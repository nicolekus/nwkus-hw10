# Working Notes — Student Stress & Sleep Survey

> **Internal document. Not public-facing. Do not commit sensitive values. Update the Session Log at the end of every working session.**

---

## How to Use This File (For AI Assistants)

1. Read this entire file before doing anything else in this project.
2. Read `README.md` for the public-facing description, installation steps, and project structure overview.
3. Do not change the folder structure, naming conventions, or tech stack without discussing it with the developer first.
4. Follow all conventions in the **Conventions** section exactly — do not introduce new patterns without agreement.
5. Do not suggest anything listed in **What Was Tried and Rejected**. Those decisions are final.
6. Ask before making large structural changes (moving files, adding new libraries, refactoring routing, changing the database schema).
7. This project was built with AI assistance. Refactor conservatively — prefer targeted edits over broad rewrites.
8. The Supabase table must exist before the results page works. If testing, assume the table may not be created yet.
9. `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required at build time. They are defined in `artifacts/survey-app/.env.local` (git-ignored) and in `.replit` `[userenv.shared]` (system-managed, cannot be edited via code).

---

## Current State

**Last Updated:** 2026-03-26

The survey app is feature-complete and deployed via GitHub Actions to Azure Static Web Apps. The Supabase database must be set up manually by running the SQL in `artifacts/survey-app/SUPABASE_SETUP.md` before responses can be saved or results displayed.

### What Is Working
- [x] Home page with welcome copy and navigation
- [x] Six-question survey form with Zod validation and inline error messages
- [x] Conditional "Other" coping method text input with auto-focus
- [x] Supabase insert on submit (anonymous, no auth required)
- [x] Thank-you confirmation screen with full answer summary
- [x] Results page with four Recharts bar charts (stress frequency, stress source, coping methods, sleep hours)
- [x] "Other" coping entries replaced with user-entered text in the results chart
- [x] Shared layout with nav bar and required footer text
- [x] Azure Static Web Apps routing config (`staticwebapp.config.json`)
- [x] GitHub Actions CI/CD workflow (`.github/workflows/azure-static-web-apps.yml`)
- [x] TypeScript passes with zero errors
- [x] `README.md` and `SUPABASE_SETUP.md` documentation

### What Is Partially Built
- [ ] Results page error state — shows a generic error if the Supabase table does not exist yet; no friendly "setup required" prompt

### What Is Not Started
- [ ] Date-range filtering on results
- [ ] CSV export of raw responses
- [ ] Admin password gate on results page
- [ ] Rate limiting on submissions
- [ ] Server-side aggregation query (currently fetches all rows client-side)

---

## Current Task

The app is complete. The last actions were adding the GitHub Actions deployment workflow and generating documentation (`README.md`, `WORKING_NOTES.md`). The developer needs to run the SQL in `SUPABASE_SETUP.md` in their Supabase SQL Editor to create the `survey_responses` table, then push the repo to GitHub to trigger the first Azure deployment.

**Next step:** Run the Supabase setup SQL, add the three GitHub Secrets (`AZURE_STATIC_WEB_APPS_API_TOKEN`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), and push to `main` to trigger the first deployment.

---

## Architecture and Tech Stack

| Technology | Version | Why It Was Chosen |
|---|---|---|
| React | 19.1.0 | UI component model; required for the Replit pnpm workspace template |
| TypeScript | ~5.9.2 | Static typing; enforced across all source files |
| Vite | ^7.3.0 | Fast dev server and bundler; native ESM; works in the workspace template |
| Tailwind CSS | ^4.1.14 | Utility-first styling; v4 used via `@tailwindcss/vite` plugin (no config file) |
| Supabase JS | ^2.100.0 | Direct browser-to-database client; no backend server needed |
| Recharts | ^2.15.4 | Declarative, React-native chart library; easiest to use without a backend |
| React Hook Form | ^7.71.2 | Performant uncontrolled form state; pairs naturally with Zod |
| Zod | 3.25.76 | Schema validation; `@hookform/resolvers` bridges it to RHF |
| Framer Motion | 12.35.1 | Animated reveal of the conditional "Other" input field |
| Wouter | ^3.3.5 | Lightweight client-side router; no need for React Router's full API surface |
| React Query | ^5.90.21 | Data fetching, caching, and loading/error state management for results page |
| pnpm | 10.x (workspace) | Monorepo package manager; all packages use a shared catalog for version pinning |
| Azure Static Web Apps | — | Deployment target specified by the developer; free tier sufficient |

---

## Project Structure Notes

```
/                                       ← repo root (pnpm workspace)
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  ← CI/CD — must not be edited without Azure Portal sync
├── artifacts/
│   └── survey-app/                    ← the only production artifact in this repo
│       ├── public/
│       │   ├── staticwebapp.config.json  ← Azure SPA fallback — must stay here
│       │   ├── favicon.svg
│       │   └── opengraph.jpg
│       ├── src/
│       │   ├── App.tsx                ← router + QueryClientProvider (no Toaster/Tooltip)
│       │   ├── main.tsx
│       │   ├── index.css              ← Tailwind v4 @theme + CSS custom properties (design tokens)
│       │   ├── components/
│       │   │   ├── layout.tsx         ← nav bar + footer wrapper used by all pages
│       │   │   └── ui-custom.tsx      ← hand-written form primitives (Input, Select, Button, etc.)
│       │   ├── hooks/
│       │   │   ├── use-survey.ts      ← Zod schema, useSurveyResponses(), useSubmitSurvey()
│       │   │   └── use-mobile.tsx     ← viewport width breakpoint hook
│       │   ├── lib/
│       │   │   ├── supabase.ts        ← createClient() with hard env-var guard (throws on missing)
│       │   │   └── utils.ts           ← cn() (clsx + tailwind-merge)
│       │   └── pages/
│       │       ├── home.tsx
│       │       ├── survey.tsx         ← main form; Q2 and Q4 use fieldset/legend
│       │       ├── results.tsx        ← four Recharts charts; aggregation done client-side
│       │       └── not-found.tsx
│       ├── .env.example               ← lists required vars; safe to commit
│       ├── .env.local                 ← actual dev credentials; git-ignored
│       ├── SUPABASE_SETUP.md          ← SQL DDL + RLS — developer must run this manually
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── pnpm-workspace.yaml                ← workspace packages + catalog version pins
├── .gitignore                         ← includes .env.local, .env.*.local
├── README.md
└── WORKING_NOTES.md                   ← this file
```

### Non-obvious decisions

- **`ui-custom.tsx` instead of shadcn/radix** — all form primitives are plain HTML + Tailwind. No Radix dependency in production. See **What Was Tried and Rejected**.
- **Tailwind v4 with no `tailwind.config.js`** — v4 reads design tokens from `@theme` blocks in `index.css`. There is no config file to look for.
- **`app_location: "/"` in the GitHub Actions workflow** — must be the repo root, not `artifacts/survey-app/`, so that `pnpm install` runs with the full workspace context.
- **`output_location: "artifacts/survey-app/dist/public"`** — Vite is configured to output to `dist/public` inside the artifact directory.
- **`BASE_PATH` defaults to `/`** — the Vite config reads `process.env.BASE_PATH ?? '/'`; no special config needed for Azure root deployment.

### Files that must not be changed without discussion

- `artifacts/survey-app/public/staticwebapp.config.json` — Azure routing depends on this exact structure
- `artifacts/survey-app/vite.config.ts` — `outDir` and `base` settings must stay consistent with the GitHub Actions `output_location`
- `artifacts/survey-app/src/lib/supabase.ts` — the env-var guard must not be silently removed
- `.github/workflows/azure-static-web-apps.yml` — changing `app_location` or `output_location` will break deployments
- `pnpm-workspace.yaml` — catalog versions are shared across all workspace packages

---

## Data / Database

**Database:** Supabase (hosted PostgreSQL). Project URL: `https://ljvgbfnugrnfozdkvpxc.supabase.co`

### Table: `survey_responses`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `bigint` (identity) | auto | Primary key, auto-incremented |
| `created_at` | `timestamptz` | auto | Defaults to `now()` |
| `year_in_school` | `text` | yes | One of: Freshman, Sophomore, Junior, Senior, Graduate Student |
| `stress_frequency` | `text` | yes | One of: Never, Rarely, Sometimes, Often, Very Often |
| `stress_source` | `text` | yes | One of: Classes / Homework, Exams, Work / Internship, Money, Family, Social Life, Future / Career |
| `coping_methods` | `text[]` | yes | Array; valid values: Sleep, Exercise, Talking to Friends, Watching TV / Movies, Listening to Music, Other |
| `other_coping_text` | `text` | no | Populated only when `coping_methods` includes "Other"; stored and displayed verbatim |
| `sleep_hours` | `text` | yes | One of: Less than 4 hours, 4-5 hours, 6-7 hours, 8-9 hours, More than 9 hours |
| `additional_comments` | `text` | yes | Free-form textarea; required at form level |

**Row Level Security:** Enabled. Two policies in place: anonymous insert (`to anon with check (true)`) and anonymous select (`to anon using (true)`). No authenticated access configured.

**Known data quality gap:** `other_coping_text` values are not normalized at the database level. "yoga", "Yoga", and "YOGA" appear as three separate chart entries. Normalization happens only for display (first-letter capitalize, rest lowercase) in `results.tsx`. This is a known limitation — see **Known Issues**.

---

## Conventions

### Naming Conventions

- **Files:** `kebab-case.tsx` / `kebab-case.ts` for all source files
- **Components:** `PascalCase` exports
- **Hooks:** `use-` prefix, camelCase file name (`use-survey.ts`)
- **Pages:** one default export per file, named to match the route (e.g., `Home`, `Survey`, `Results`)
- **CSS custom properties:** `--color-*`, `--font-*` following Tailwind v4 `@theme` convention
- **Environment variables:** `VITE_` prefix for all client-side vars (baked in at build time by Vite)

### Code Style

- TypeScript strict mode; no `any`, no `@ts-ignore`
- Tailwind utility classes only — no inline `style={}` attributes
- `cn()` (from `lib/utils.ts`) for all conditional class merging
- `forwardRef` used on all primitive components in `ui-custom.tsx`
- No default prop values via destructuring defaults for boolean flags — use explicit `?:` optional types

### Framework Patterns

- **Routing:** Wouter `<Switch>` + `<Route>`; base path set from `import.meta.env.BASE_URL`
- **Data fetching:** React Query `useQuery` for results, `useMutation` for submission
- **Form state:** React Hook Form + Zod resolver; no controlled inputs except the watch-based conditional "Other" field
- **Accessibility:** `<fieldset>/<legend>` for radio and checkbox groups; unique `id` per input; `aria-describedby` on `fieldset` pointing to error message `id`
- **Animations:** Framer Motion `<AnimatePresence>` + `<motion.div>` for the "Other" input reveal only

### Git Commit Style

`type: short description` (conventional commits, lowercase)

Types used: `feat`, `fix`, `docs`, `refactor`, `chore`

Examples:
```
feat: add conditional Other coping input with auto-focus
fix: move aria-describedby to fieldset level for radio groups
docs: add README with 16 sections
chore: remove unused radix-ui dependencies
```

---

## Decisions and Tradeoffs

- **No backend server.** Supabase JS client used directly from the browser. This means the anon key is exposed client-side — which is by design; Supabase's anon key is public and security is enforced entirely by Row Level Security policies. Do not suggest adding a backend proxy for this.
- **Supabase chosen over Replit's built-in PostgreSQL.** The app targets Azure Static Web Apps (static hosting, no Node server). The Replit DB would require a server. Do not suggest migrating to Replit's DB.
- **Q6 (additional_comments) is required.** The developer confirmed this explicitly. Do not make it optional.
- **"Other" coping text is required when "Other" is selected.** The Zod schema enforces this. A superRefine conditional check is used. Do not relax this.
- **All chart aggregation is done client-side.** React Query fetches all rows; `results.tsx` maps and counts them in-memory. Acceptable at current scale. A server-side `GROUP BY` query would be needed at high volume — but that is a roadmap item, not a current concern.
- **Tailwind v4 with no config file.** Design tokens live in `index.css`. Do not create a `tailwind.config.js` — it is not needed and may conflict with v4's plugin-based setup.
- **`fieldset/legend` for radio and checkbox groups.** This was added after an accessibility code review. Do not revert to plain `div` wrappers for Q2 or Q4.
- **Coping chart shows all entries, not top N.** An earlier version used `.slice(0, 10)`. This was removed after code review — all categories must always be visible.

---

## What Was Tried and Rejected

- **shadcn/radix UI component library.** Fifty-plus Radix components were auto-generated into `src/components/ui/` but none were used. The entire directory was deleted. All UI primitives are in `ui-custom.tsx` (plain HTML + Tailwind). Do not suggest adding shadcn or any Radix component.
- **`use-toast.ts` / Toaster / TooltipProvider.** These were generated but never imported. Deleted. Do not add toast notifications or a Tooltip wrapper to this app.
- **Hard-coded PORT / BASE_PATH with throw in Vite config.** The original config threw an error if those env vars were not set, which broke `pnpm run build` in Azure CI. Replaced with `?? '5173'` and `?? '/'` defaults.
- **Custom ref callback with `@ts-ignore` for the "Other" input.** An earlier version used a dual-ref pattern (`register().ref` + `otherInputRef.current`) with a `@ts-ignore`. This was replaced by `{...register("other_coping_text")}` spread alone, with auto-focus handled via `document.getElementById` in a `useEffect`.
- **Using `any` for the Recharts CustomTooltip.** Replaced with `TooltipProps<ValueType, NameType>` from Recharts types.
- **`aria-describedby` on the inner grid `div` inside radio/checkbox groups.** Moved to the `fieldset` element itself, which is the correct semantic boundary.

---

## Known Issues and Workarounds

### Results page shows an error before the Supabase table is created

- **Problem:** If the developer has not yet run the SQL in `SUPABASE_SETUP.md`, the `survey_responses` table does not exist. The React Query `useQuery` call fails and the results page displays a generic error state.
- **Workaround:** None in code. Developer must run the setup SQL manually.
- **Do not remove** the error state UI — it is the only signal that setup is incomplete.

### "Other" coping text is not normalized at the database level

- **Problem:** `other_coping_text` is stored exactly as typed. "yoga" and "Yoga" appear as separate entries in the coping methods chart.
- **Workaround:** `results.tsx` capitalizes the first letter and lowercases the rest before aggregating, but this is imperfect (e.g., "Listening to music" vs "listening to Music" would still differ).
- **Do not remove** the display normalization in `results.tsx` (lines around the `allCoping` flatMap) — it is better than nothing.

### No rate limiting on submissions

- **Problem:** The anon RLS policy allows unlimited inserts. A single user can submit the form many times, skewing results.
- **Workaround:** None. Supabase free tier does not support rate-limiting at the RLS level without additional infrastructure.
- This is a known acceptable risk for a small classroom survey.

### `.replit` `[userenv.shared]` contains live Supabase credentials

- **Problem:** Replit's environment variable system writes shared env vars to `.replit`, which is committed. The Supabase URL and anon key are visible in the repo.
- **Workaround:** The anon key is explicitly designed to be public (Supabase's security model relies on RLS, not key secrecy). `artifacts/survey-app/.env.local` (git-ignored) is the canonical credential location for local dev. `.replit` cannot be edited via code — it is system-managed.
- **Do not attempt to remove values from `.replit` via code edits** — the tool will reject it.

---

## Browser / Environment Compatibility

### Frontend

- **Tested in:** Chrome (latest), Edge (latest)
- **Expected support:** All modern evergreen browsers (Chrome, Firefox, Safari, Edge) — no IE11 support, no polyfills added
- **Known incompatibilities:** None observed
- **CSS:** Tailwind v4 uses modern CSS features (cascade layers, `@property`). Requires browsers released after ~2023.

### Build / Development Environment

- **OS:** Linux (Replit NixOS container); also expected to work on macOS and Windows WSL
- **Node.js:** 20+ required (workspace catalog uses features from Node 20)
- **pnpm:** 10.x (`pnpm/action-setup@v4` in CI uses version 10)
- **Environment variables:** Must be present at `vite build` time (`VITE_` prefix means they are baked into the JS bundle — they are not runtime env vars)

---

## Open Questions

- Should the results page be password-protected so only the researcher can view it? Currently anyone with the URL can see results.
- Should there be a submission limit per IP or session cookie to reduce gaming?
- Should `other_coping_text` values be normalized (lowercased, trimmed) at insert time via a Supabase trigger rather than at display time?
- Is a "close the survey" toggle needed — e.g., to stop accepting responses after a certain date or count?
- Should the results page show a "last updated" timestamp so the researcher knows how fresh the data is?

---

## Session Log

### 2026-03-26

**Accomplished:**
- Built the full survey app: home page, six-question form with Zod validation, Supabase insert, thank-you screen, results page with four Recharts charts
- Configured Supabase JS client with env var guard
- Added `staticwebapp.config.json` for Azure SPA routing
- Fixed all code review issues: Vite config defaults, removed all unused Radix/shadcn components, fixed `any` typing, removed `@ts-ignore`, added `fieldset/legend` with unique IDs for radio/checkbox groups, fixed coping chart truncation, fixed SUPABASE_SETUP.md code fence
- Created `.env.local` (git-ignored) and updated `.gitignore`
- Generated `README.md` (16 sections) and `WORKING_NOTES.md`
- Added GitHub Actions workflow for Azure Static Web Apps CI/CD

**Left incomplete:**
- Developer has not yet run the Supabase setup SQL (table does not exist yet)
- First Azure deployment has not been triggered (awaiting GitHub Secrets setup)

**Decisions made:**
- Q6 (additional_comments) is required
- "Other" coping text displayed verbatim in results chart
- No backend server; Supabase anon key is public by design

**Next step:** Developer runs `SUPABASE_SETUP.md` SQL in Supabase, adds three GitHub Secrets, pushes to `main` to trigger first Azure deployment.

---

## Useful References

- [Supabase Row Level Security docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript client docs](https://supabase.com/docs/reference/javascript/introduction)
- [Recharts API reference](https://recharts.org/en-US/api)
- [React Hook Form + Zod resolver](https://react-hook-form.com/get-started#SchemaValidation)
- [Tailwind CSS v4 docs — `@theme`](https://tailwindcss.com/docs/theme)
- [Vite environment variables](https://vitejs.dev/guide/env-and-mode.html) — explains why `VITE_` prefix is required for client-side vars
- [Azure Static Web Apps — build configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
- [Azure Static Web Apps — custom build commands](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration?tabs=github-actions#custom-build-commands)
- [pnpm workspace filtering (`--filter`)](https://pnpm.io/filtering)
- [Wouter — client-side routing for React](https://github.com/molefrog/wouter)
- [Framer Motion — AnimatePresence](https://www.framer.com/motion/animate-presence/)
- **AI tools used:** Replit AI (agent mode) — used to scaffold the entire project, fix code review findings, generate documentation. All significant structural decisions were confirmed with the developer.

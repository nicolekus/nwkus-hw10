# Student Stress & Sleep Survey

## Description

A lightweight, anonymous web survey built to collect and visualize student stress and sleep data for academic research. Respondents answer six targeted questions about their academic year, stress frequency, stress sources, coping methods, sleep habits, and any additional thoughts. Results are aggregated in real time and displayed as interactive charts — no login required. Built for Nicole Kus as a data-collection tool for BAIS:3300 (Business Analytics & Information Systems) at the University of Iowa, spring 2026.

## Badges

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Azure Static Web Apps](https://img.shields.io/badge/Azure_Static_Web_Apps-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## Features

- **Fully anonymous** — no account or personal information required to participate
- **Six-question survey** covering year in school, stress frequency, stress sources, coping methods, sleep hours, and open comments
- **"Other" coping method** — respondents who select Other are prompted for a custom text description, which appears verbatim in the results charts
- **Live results dashboard** — bar charts update in real time as new responses are submitted
- **Inline validation** — every required field gives immediate, accessible feedback before submission is allowed
- **Thank-you confirmation screen** — shows a summary of the respondent's own answers after submitting
- **Mobile-friendly** — responsive single-column layout works on phones, tablets, and desktops
- **Zero backend** — data flows directly from the browser to Supabase; no custom server to maintain

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI component tree and state management |
| TypeScript | Static typing across the entire codebase |
| Vite | Development server and production bundler |
| Tailwind CSS v4 | Utility-first styling and design tokens |
| Supabase (PostgreSQL) | Hosted database with Row Level Security for anonymous insert/select |
| Recharts | Declarative bar charts on the results page |
| React Hook Form + Zod | Form state management and schema validation |
| Framer Motion | Animated transitions (conditional "Other" input reveal) |
| Wouter | Lightweight client-side routing |
| pnpm | Package manager in a monorepo workspace |
| Azure Static Web Apps | Production hosting with SPA fallback routing |

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/en/download) — JavaScript runtime
- [pnpm 9+](https://pnpm.io/installation) — package manager (`npm install -g pnpm`)
- [Supabase account](https://supabase.com) — free tier is sufficient
- A Supabase project with the `survey_responses` table created (see **Usage** below)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```

2. Install all workspace dependencies:
   ```bash
   pnpm install
   ```

3. Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp artifacts/survey-app/.env.example artifacts/survey-app/.env.local
   ```

4. Open `artifacts/survey-app/.env.local` and set your values:
   ```env
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

5. Create the database table — open the **SQL Editor** in your Supabase dashboard and run the contents of `artifacts/survey-app/SUPABASE_SETUP.md`.

6. Start the development server:
   ```bash
   pnpm --filter @workspace/survey-app run dev
   ```

7. Open your browser at `http://localhost:5173`.

## Usage

### Running the app

```bash
# Development (hot reload)
pnpm --filter @workspace/survey-app run dev

# Production build
pnpm --filter @workspace/survey-app run build

# Preview the production build locally
pnpm --filter @workspace/survey-app run serve
```

### App routes

| Route | Description |
|---|---|
| `/` | Home page — welcome message and navigation |
| `/survey` | Six-question survey form |
| `/results` | Aggregated charts of all submitted responses |

### Configuration

All runtime configuration is handled through environment variables in `artifacts/survey-app/.env.local`:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon (public) key |

For Azure Static Web Apps deployment, set these same two variables in the **Configuration** panel of your Static Web App resource in the Azure Portal.

## Project Structure

```
artifacts/survey-app/
├── public/
│   ├── staticwebapp.config.json  # Azure SPA fallback routing config
│   ├── favicon.svg               # Browser tab icon
│   └── opengraph.jpg             # Social share preview image
├── src/
│   ├── App.tsx                   # Root component: router + query client setup
│   ├── main.tsx                  # React DOM entry point
│   ├── index.css                 # Tailwind base + design token CSS variables
│   ├── components/
│   │   ├── layout.tsx            # Shared page shell: nav bar + footer
│   │   └── ui-custom.tsx         # Reusable form controls (Input, Select, Button, etc.)
│   ├── hooks/
│   │   ├── use-survey.ts         # Zod schema, React Query fetcher, submit mutation
│   │   └── use-mobile.tsx        # Viewport width breakpoint hook
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client initialization with env var guard
│   │   └── utils.ts              # Tailwind class merge utility (cn)
│   └── pages/
│       ├── home.tsx              # Landing page with hero and feature cards
│       ├── survey.tsx            # Multi-field survey form with validation
│       ├── results.tsx           # Recharts bar charts aggregating all responses
│       └── not-found.tsx         # 404 fallback page
├── .env.example                  # Template listing required environment variables
├── .env.local                    # Local dev credentials — git-ignored, never committed
├── SUPABASE_SETUP.md             # SQL DDL + RLS policies to run in Supabase SQL Editor
├── package.json                  # Workspace package config and scripts
├── tsconfig.json                 # TypeScript compiler options
└── vite.config.ts                # Vite build config with Tailwind and Replit plugins
```

## Changelog

### v1.0.0 — 2026-03-26

- Initial release
- Six-question anonymous survey form with Zod validation
- Supabase PostgreSQL backend with Row Level Security (anonymous insert + select)
- Live results page with four Recharts bar charts
- "Other" coping method: conditional text input stored and displayed verbatim in results
- Thank-you confirmation screen with full answer summary
- Shared layout with nav bar and required course footer
- Azure Static Web Apps routing config (`staticwebapp.config.json`)
- Supabase database setup documentation (`SUPABASE_SETUP.md`)

## Known Issues / To-Do

- [ ] Results page currently shows an error state if the Supabase table has not been created yet — a friendlier "setup required" prompt would improve the experience
- [ ] The "Other" coping method text is not normalized for case or whitespace at the database level, so "yoga" and "Yoga" appear as separate chart entries
- [ ] No rate limiting on survey submissions — a single user could submit many responses and skew the results
- [ ] The results page re-fetches all rows on every visit; as response volume grows, a server-side aggregation query would be more efficient
- [ ] No timestamp-based filtering on the results page — there is no way to view results from a specific date range

## Roadmap

- **Date-range filtering on results** — let the researcher filter charts by submission date window
- **CSV export** — one-click download of all raw responses for offline analysis in Excel or R
- **QR code sharing** — generate a scannable QR code on the home page to distribute the survey link in class or on printed materials
- **Admin password gate on results** — optionally restrict the results page to the researcher only
- **Demographic cross-tabs** — charts that break down stress frequency or sleep hours by year in school

## Contributing

This project was created for a specific course assignment, but pull requests for bug fixes or accessibility improvements are welcome. Please open an issue first to discuss the change you would like to make.

1. Fork the repository
2. Create a feature branch: `git checkout -b fix/your-fix-name`
3. Commit your changes: `git commit -m "fix: describe the change"`
4. Push the branch: `git push origin fix/your-fix-name`
5. Open a Pull Request against `main` and describe what the change does and why

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, copy, modify, and distribute this software with attribution.

## Author

**Nicole Kus**
University of Iowa
BAIS:3300 — Business Analytics & Information Systems, spring 2026

## Contact

GitHub: [github.com/nicolekus](https://github.com/nicolekus)

## Acknowledgements

- [Supabase](https://supabase.com/docs) — database, auth, and Row Level Security documentation
- [Recharts](https://recharts.org/en-US/) — composable charting library documentation and examples
- [React Hook Form](https://react-hook-form.com/) — performant form state management
- [Zod](https://zod.dev/) — TypeScript-first schema validation
- [Tailwind CSS](https://tailwindcss.com/docs) — utility-first CSS framework documentation
- [Framer Motion](https://www.framer.com/motion/) — animation library for the conditional "Other" field
- [shields.io](https://shields.io/) — badge generation for this README
- [Replit AI](https://replit.com/) — AI-assisted development environment used to scaffold and build this project
- [Vite](https://vitejs.dev/) — next-generation frontend tooling

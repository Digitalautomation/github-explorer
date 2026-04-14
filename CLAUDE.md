# GitHub Explorer

A tool to search GitHub repos, generate summaries, and save them locally.

## Setup

Copy `.env.example` to `.env` and set `GITHUB_TOKEN` to a GitHub Personal Access Token.

```bash
npm install
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run search -- --query <term> [--limit N]` | Search GitHub and save results |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run type-check` | Type-check without emitting |
| `npm test` | Run all tests with vitest |

## Output

Results are written to `./output/` as:
- `<query>-<timestamp>.json` — structured repo data
- `<query>-<timestamp>.md` — human-readable Markdown summary

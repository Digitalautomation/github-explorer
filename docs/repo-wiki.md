# GitHub Explorer — Codebase Wiki

## 1. Project Overview

GitHub Explorer is a CLI tool that searches GitHub repositories by keyword, presents results interactively, generates AI-powered summaries via Claude, and saves those summaries locally. It is built with Bun and TypeScript, using the Anthropic SDK to call Claude for repo summarisation.

## 2. Tech Stack

| Technology | Purpose |
|---|---|
| [Bun](https://bun.sh/) | Runtime, package manager, script runner |
| TypeScript | Primary language (strict mode, ESNext target) |
| `@anthropic-ai/sdk` | Claude API client for generating summaries |
| Biome | Linting and code formatting |
| GitHub REST API | Repo search (unauthenticated, via `fetch`) |

## 3. Project Structure

```
.
├── src/
│   ├── index.ts      — Entry point; orchestrates search → select → summarise → save
│   ├── cli.ts        — Interactive CLI prompts (keyword input, repo selection)
│   ├── claude.ts     — Anthropic SDK integration; generates repo summaries
│   └── storage.ts    — Writes summary files to saved-repos/
├── saved-repos/      — Output directory for generated repo summaries
├── package.json      — Scripts and dependencies
├── tsconfig.json     — TypeScript config (bundler resolution, strict)
├── CLAUDE.md         — Setup and usage instructions
└── .env              — Local env vars (ANTHROPIC_API_KEY); not committed
```

## 4. Key Files

- `src/index.ts` — Main pipeline: parse CLI args → search GitHub → prompt user → call Claude → save result.
- `src/cli.ts` — Handles all terminal I/O: keyword prompt, numbered repo list, selection input.
- `src/claude.ts` — Wraps `@anthropic-ai/sdk`; takes repo metadata and returns a markdown summary string.
- `src/storage.ts` — Creates `saved-repos/` if needed and writes per-repo `.md` files.
- `.env` — Must contain `ANTHROPIC_API_KEY`; auto-loaded by Bun at startup.
- `package.json` — Defines `start`, `validate`, `typecheck`, and `lint` scripts.

## 5. Recent Activity

No `TODO`, `FIXME`, or `INCOMPLETE` comments were found in the scanned source files. No files appear to be obviously incomplete works-in-progress based on available data.

## 6. Unknown Directories

- `saved-repos/` — Output directory for Claude-generated repo summary files; populated at runtime, not source code.

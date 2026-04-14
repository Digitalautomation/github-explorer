# GitHub Explorer

A tool to search GitHub repos, generate summaries, and save them locally.

## Prerequisites

- [Bun](https://bun.sh/) runtime
- `ANTHROPIC_API_KEY` environment variable set

## Setup

```sh
bun install
```

## Scripts

- `bun run start <keyword>` — search GitHub, pick a repo, generate and save a summary
- `bun run validate` — run type-check and lint
- `bun run typecheck` — TypeScript type-check only
- `bun run lint` — Biome linter only

## Usage

```sh
export ANTHROPIC_API_KEY=sk-...
bun run start react
```

Select a repo from the results, and a Claude-generated summary will be saved to `saved-repos/`.

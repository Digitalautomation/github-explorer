# GitHub Explorer

A CLI tool to search GitHub repos, generate summaries, and save them locally.

## Prerequisites

- Node.js 18+
- A GitHub Personal Access Token ([create one](https://github.com/settings/tokens))

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and set GITHUB_TOKEN=your_token_here
```

## Usage

```bash
npm run search -- --query <search-term> [--limit <number>]
```

**Options**:
- `--query` (required): Search term for GitHub repositories
- `--limit` (optional): Max number of results to return (default: 10, max: 100)

**Example**:
```bash
npm run search -- --query "typescript cli" --limit 5
```

Results are saved to `./output/` as both JSON and Markdown files.

## Development

```bash
npm run type-check   # TypeScript type-check
npm test             # Run tests
npm run build        # Compile to dist/
```

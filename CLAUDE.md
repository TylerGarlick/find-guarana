# CLAUDE.md

This file provides guidance for AI assistants working on the find-guarana repository.

## Project Overview

**find-guarana** is a Node.js project in its initial bootstrap stage. The repository currently contains only foundational files (`.gitignore`, `README.md`) and has no source code, dependencies, or build tooling configured yet.

- **Repository:** TylerGarlick/find-guarana
- **Primary branch:** `main`
- **Author:** Tyler Garlick

## Repository Structure

```
find-guarana/
├── .gitignore       # Comprehensive Node.js gitignore template
├── README.md        # Project title only
└── CLAUDE.md        # This file
```

No source code, configuration files, or dependencies exist yet.

## Technology Stack (Anticipated)

Based on the `.gitignore` configuration, this project is set up for:

- **Runtime:** Node.js
- **Package management:** npm, yarn, or pnpm
- **Language:** JavaScript/TypeScript (`.tsbuildinfo` ignored)
- **Bundler:** Likely Vite (Vite timestamp files ignored)
- **Possible frameworks:** Next.js, Nuxt.js, Gatsby, SvelteKit, or Vitepress patterns are all covered in `.gitignore`

## Development Commands

No `package.json` exists yet. Once the project is initialized, update this section with available scripts.

<!-- Example (update when package.json is created):
```
npm install          # Install dependencies
npm run build        # Build the project
npm run dev          # Start development server
npm test             # Run tests
npm run lint         # Lint the codebase
```
-->

## Git Conventions

- **Default branch:** `main`
- **Commit style:** Follow conventional commit messages (e.g., `feat:`, `fix:`, `docs:`, `chore:`)
- **Environment files:** `.env` files are gitignored; use `.env.example` for templates

## Key Guidelines for AI Assistants

1. **This is a new project** — there is no existing code to preserve or maintain backward compatibility with.
2. **Check for updates** — before making changes, verify the current state of the repo as it may have evolved since this file was written.
3. **Keep it simple** — avoid over-engineering; add only what is directly needed.
4. **Environment secrets** — never commit `.env` files or credentials. The `.gitignore` already excludes them.
5. **Update this file** — when adding build tooling, dependencies, or source code structure, update the relevant sections of this document to keep it current.

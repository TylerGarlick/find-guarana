# Find Guarana - Implementation Plan

## Purpose
**AI Research Discovery Tool** - A companion to Abraxas for finding, tracking, and organizing emerging AI safety/alignment research. Supports the AI Research Briefing Service business and Task #75 (Feature Discovery).

## Core Features

### Phase 1: Research Discovery
- [ ] ArXiv API integration for AI safety papers
- [ ] Paper search by keywords, date range, citations
- [ ] RSS feed ingestion for key researchers/conferences (NeurIPS, ICML, ICLR)

### Phase 2: Tracking & Organization
- [ ] Save papers to personal library
- [ ] Tag/categorize by technique (RLHF, Constitutional AI, etc.)
- [ ] Track implementation status (not started, in research, prototyping, implemented)

### Phase 3: Integration
- [ ] Export to Abraxas research format
- [ ] Weekly digest generation for AI Research Briefing Service
- [ ] Connect to OpenClaw as a skill for proactive research

## Tech Stack
- Node.js + TypeScript
- Vite for bundling
- Simple SQLite or JSON file storage (no complex DB needed)
- ArXiv API (free, no auth required)

## Next Steps
1. Initialize Node.js project with TypeScript
2. Add basic paper search via ArXiv API
3. Create simple CLI or web interface
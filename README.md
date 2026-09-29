# ChessOp

Fast, client-side chess opening repertoire trainer built with React, TypeScript, and Tailwind CSS.

[![Version](https://img.shields.io/badge/version-1.0.8-blue.svg)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

ChessOp is an offline-capable web application designed to help chess players memorize and master opening lines through active recall, spaced repetition, and post-theory AI sparring. It runs entirely in the browser with zero backend requirements—all progress, analytics, and custom repertoires persist in `localStorage`.

---

## Features

- **Active Recall Training**: Practice opening lines from memory with instant move feedback, book move annotations, and guided demonstration mode.
- **Campaign Mode**: Interactive winding roadmap connecting variations into themed worlds (Vienna Gambit, Asymmetric Defenses, Open Classics) with end-of-world Boss Battles.
- **Post-Theory AI Sparring**: In-browser Minimax bot with Alpha-Beta pruning to test whether you can convert theoretical advantages into full game wins across 3 skill levels (~1200, ~1600, ~2000+ ELO).
- **Spaced Repetition System (SRS)**: Adaptive review scheduling based on the SM-2 algorithm to prioritize lines that need reinforcement.
- **Learning Diagnostics**: Automatic tracking of theoretical weak spots (Achilles' Heel) by move coordinates and a 15-week activity consistency heatmap.
- **Calibrated Tactical Evaluation**: Real-time evaluation bar calibrated for opening gambits, center control heuristics, development tempo, and king safety.
- **Custom PGN Support**: Import opening repertoires and studies directly from Lichess or Chess.com, with one-click JSON backup export and restore.
- **Customization**: Multiple board color palettes, SVG piece sets (Classic, Wood, Neo, Glass), optional blindfold mode, and synthesized Web Audio sound effects.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Chess Rules** | [chess.js](https://github.com/jhlywa/chess.js) |
| **Board UI** | [react-chessboard](https://github.com/Clariity/react-chessboard) |
| **Bot Engine** | Minimax with Alpha-Beta Pruning + PST evaluation (custom in-browser) |
| **Audio** | Web Audio API (procedural synthesized chimes and chords) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ZekeogHanabi/ChessOP.git
   cd ChessOP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## Project Structure

```
ChessOP/
├── public/
│   ├── vienna.pgn          # Default master repertoire study
│   └── vite.svg
├── src/
│   ├── components/         # Views (Main Menu, Training, Campaign, Analytics, Changelog, Modals)
│   ├── data/               # Default opening variations data
│   ├── utils/
│   │   ├── analytics.ts    # Weak spots tracking and daily activity logs
│   │   ├── campaignData.ts # Worlds, levels, and boss battle definitions
│   │   ├── chessBot.ts     # Minimax sparring engine with alpha-beta pruning
│   │   ├── evaluator.ts    # Tactical position heuristic evaluation bar
│   │   ├── gamification.ts # XP levels, ranks, 3-star ratings, and precision engine
│   │   ├── pgnParser.ts    # PGN file and study parser
│   │   ├── pieceSets.ts    # SVG piece set rendering
│   │   ├── sound.ts        # Synthesized Web Audio sound manager
│   │   └── srs.ts          # Spaced repetition scheduling (SM-2)
│   ├── types.ts            # Domain TypeScript models
│   ├── App.tsx             # Root application orchestrator
│   └── main.tsx            # React entrypoint
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Deployment

Because ChessOp builds to pure static HTML/JS/CSS assets, it can be deployed on any static hosting provider.

### Cloudflare Pages

1. Link your GitHub repository in the Cloudflare dashboard under **Workers & Pages**.
2. Set the build configuration:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Deploy.

The same settings apply to Vercel, Netlify, or GitHub Pages.

---

## License

This project is licensed under the [MIT License](LICENSE).

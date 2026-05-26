# ♟️ ChessOp - Chess Opening Trainer

An **open-source**, **ultra-lightweight** (low resource consumption) web application designed with a **minimalist, timeless aesthetic**. Built for chess players looking to memorize and perfect their opening repertoires through active recall and muscle memory.

Designed entirely as a static single-page application, ready to be deployed for free and immediately on **Cloudflare Pages** (or GitHub Pages, Vercel, Netlify).

---

## ✨ Key Features

1. **Minimalist & Timeless Aesthetic**: Inspired by *Chessreps*, *Lichess*, and clean interfaces like *Substack* or *Linear*. Features a curated palette of warm earth, soft sepia, and carbon tones. No aggressive neon lights or heavy futuristic animations.
2. **Low Resource Consumption**:
   - All state, progress metrics, and repertoires are evaluated and saved locally in the browser using `localStorage`.
   - Zero servers, zero databases, zero heavy API calls.
   - 100% performance on Google Lighthouse.
3. **Optimized Training Loop**:
   - **Demonstration Mode**: Guides the user by dynamically drawing translucent helper arrows on the board showing the expected move. Once completed, the system registers the line as introduced.
   - **Practice Mode**: Challenges the user to play the theoretical lines entirely from memory. In case of an incorrect or non-theoretical move, the board immediately triggers subtle visual feedback (soft red flash and lateral vibration) and reverts the move, allowing you to try again.
4. **Auto-Opponent Responses**: When you execute a correct theoretical move, after a natural delay of 400ms, the machine automatically plays the pre-configured opponent response.
5. **Educational Strategic Comments**: Every move in a variation contains strategic annotations and educational commentary, explaining the *why* behind every position.
6. **Adaptive Theme**: Toggle easily between a soft warm sepia light mode and a deep carbon dark mode.

---

## 🛠️ Technology Stack

- **Core**: React 18 + TypeScript + Vite.
- **Styling**: Tailwind CSS v3 (highly optimized and production-ready).
- **Chess Logic**: `chess.js` (for full move validation and rule compliance).
- **Graphical Board**: `react-chessboard` v5 (utilizing the new unified options API, ultra-responsive and fast).
- **Icon Set**: `lucide-react`.

---

## 📂 Data Structure (TypeScript)

Repertoire variations are modeled linearly in `src/types.ts`:

```typescript
export interface MoveNode {
  from: string;      // Source square, e.g., "e2"
  to: string;        // Target square, e.g., "e4"
  notation: string;  // Algebraic notation, e.g., "e4"
  comment?: string;  // Educational comment explaining the move
}

export interface OpeningVariant {
  id: string;
  name: string;        // Variation name
  openingName: string; // Main opening name
  description: string; // Repertoire context/strategy explanation
  side: 'white' | 'black'; // The side played by the user
  moves: MoveNode[];   // Ordered list of repertoire moves
}
```

---

## 🚀 Deployment to Cloudflare Pages (Free & Instant!)

As ChessOp compiles entirely down to static assets, deploying to **Cloudflare Pages** is incredibly straightforward through GitHub:

1. Create a repository on your **GitHub** account and upload the code.
2. Log into your **Cloudflare** dashboard.
3. Go to **Workers & Pages** -> **Create application** -> **Pages** tab -> **Connect to Git**.
4. Select your newly created repository.
5. In the build settings, select the **Vite** preset:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
6. Click **Save and Deploy**. Your site will be online in seconds on a subdomain like `https://your-project.pages.dev/` with free SSL and global CDN.

---

## 💻 Local Development

To modify the openings database, add your own repertoires, or tweak styling:

1. **Clone the repository**:
   ```bash
   git clone <REPOSITORY_URL>
   cd ChessOp
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📜 License

This project is open-source and released under the **MIT License**. Feel free to fork it, adapt it to your own opening repertoire, and play! 🚀

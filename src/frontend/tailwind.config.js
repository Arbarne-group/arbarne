/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── 1. FFF Official Brand Colors (from FFF - Branding.md) ──────
        fff: {
          cyan: '#045D61',        // FFF Primary Dark Cyan
          cyanDark: '#023c3f',    // Deep Dark Cyan base
          green: '#009924',       // FFF Vivid Green (Growth & Quick Wins)
          blue: '#1565C0',        // FFV Verification Royal Blue
          gold: '#FFD700',        // FFMI Maturity Index Gold
          goldDark: '#B88917',    // Future-Ready Achievement Gold
          orange: '#EF6C00',      // Recommendation Engine Orange
          grey: '#8E99A2',        // Informal Farm Classification Grey
        },

        // ─── 2. 8-Pillar Distinct Permanent Colors ───────────────────────
        pillar: {
          1: '#1E88E5',           // Pillar 1: Blue (Smart Farming & Digital)
          2: '#FDD835',           // Pillar 2: Yellow/Amber (P.U.R.E)
          3: '#43A047',           // Pillar 3: Green (Food Safety & Quality)
          4: '#2E7D32',           // Pillar 4: Dark Green (Indigenous & Climate)
          5: '#8E24AA',           // Pillar 5: Purple (Farm Business & Growth)
          6: '#3949AB',           // Pillar 6: Indigo (Human Capital & Ops)
          7: '#FB8C00',           // Pillar 7: Orange (Market Access)
          8: '#683C21',           // Pillar 8: Brown (Investment Readiness)
        },

        // ─── 3. Capability Status / Maturity Levels ──────────────────────
        status: {
          nonExistent: '#D32F2F',  // Red
          emerging: '#F57C00',     // Orange
          basic: '#FBC02D',        // Yellow
          developing: '#7CB342',   // Light Green
          established: '#388E3C',  // Green
          advanced: '#1B5E20',     // Dark Green
        },

        // ─── 4. Farm Classification Tiers ────────────────────────────────
        tier: {
          1: '#8E99A2',           // Tier 1: Informal Farm (Grey)
          2: '#FB8C00',           // Tier 2: Emerging Agribusiness (Orange)
          3: '#1E88E5',           // Tier 3: Structured Farm (Blue)
          4: '#045D61',           // Tier 4: Investment Ready (Dark Cyan)
          5: '#B88917',           // Tier 5: Future-Ready Farm (Gold)
        },

        // ─── 5. UI Canvas & Neutral Tokens ───────────────────────────────
        canvas: '#f6f8f7',
        surface: {
          white: '#ffffff',
          soft: '#f0f4f2',
          muted: '#e8efec',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
};

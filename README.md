# Future Farms 🌾

> **Cultivating the Future of African Agriculture**  
> An intelligent digital platform empowering commercial and expanding farms across Africa with diagnostic maturity assessments, benchmark analytics, tailored recommendations, and access to capital and technical services.

---

## 🌟 Key Features

### 1. Diagnostic Assessment Framework (Pillar 1)
- **5 Core Digital Capabilities (25 Self-Assessment Questions)**:
  - `1.1`: Technology Readiness
  - `1.2`: Digital Capability
  - `1.3`: Farm Information & Data Management
  - `1.4`: Data-Driven Decision Making
  - `1.5`: Continuous Improvement & Innovation
- **Real-Time Scoring Engine**: Calculates live capability percentages and overall pillar maturity (0–100%).
- **Maturity Tiers**:
  - `0% – 39%`: **Emerging Stage**
  - `40% – 59%`: **Developing Stage**
  - `60% – 79%`: **Advancing Stage**
  - `80% – 100%`: **Leading Stage**
- **Strict Conditional Recommendations**:
  - Selecting **"No"** reveals the specific intervention recommendation, why it matters, an immediate quick win, support channel, priority badge (`🟢 Quick Win`, `🟡 Medium Term`, `🔵 Strategic`), and audit evidence required.
  - Selecting **"Yes"** hides recommendations throughout the assessment to keep focus sharp on capabilities in place.
- **Action Plan Roadmap**: Prioritized gap analysis modal grouping all "No" items by urgency for farm implementation.

### 2. My Farm Radar Dashboard
- **8-Pillar Farm Maturity Spider Diagram**: Interactive Chart.js radar canvas comparing farm scores with regional commercial benchmarks:
  1. Soil & Crops
  2. Water & Irrigation
  3. Technology & Mechanization
  4. Business & Financials
  5. Labor & Team Management
  6. Climate Resilience
  7. Market Access & Contracts
  8. Post-Harvest Quality & Cold Chain
- **Priority Opportunities**: Highlighting high-impact projects such as automated drip irrigation scheduling and solar cold chain storage.
- **PDF Export**: One-click farm transformation plan generation.

### 3. Commercial Hub & Payments
- **Assessment Pricing**: Transparent side-by-side comparison between Individual Pillar Assessment ($1) and the Full Future Farm Assessment ($10 "BEST VALUE").
- **Kenyan M-Pesa & Card Checkout**:
  - Interactive **Safaricom M-Pesa STK Push** simulation with Kenyan country code `+254`.
  - Secure Credit/Debit Card payments tab.
  - Automatic order creation and instant dashboard unlock.

### 4. Onboarding Questionnaire Wizard
- 5-step guided profile:
  - `Step 1`: Farmer Profile (Job title radio cards, value chain)
  - `Step 2`: Management Experience (Management abilities, operators checklist, desired involvement)
  - `Step 3`: Operating Style (Decision bento, failure response, top 3 obstacles, update channels)
  - `Step 4`: Digital Platforms (Support reasons, remote management confidence, segmented toggles)
  - `Step 5`: Aspirations (12-month goals, delegation checklist, 25-year vision for African farming)

### 5. Specialized Farm Services
- **Digital Learning Hub (`/learning`)**: Filterable agricultural masterclasses and video lessons (Irrigation Telemetry, GlobalGAP Standards, Solar Cold Storage).
- **Opportunity Desk (`/opportunities`)**: Matched agri-grants ($25,000 clean energy), supermarket buyer contracts, and carbon credit programs.
- **Service Desk (`/service-desk`)**: On-demand dispatch of licensed agronomists, soil/water laboratory testing, cold transport vans, and manager recruitment.
- **Help Center (`/help`)**: Searchable FAQs regarding assessment scoring methodology, M-Pesa billing, and data confidentiality.
- **Contact Us (`/contact`)**: WhatsApp farmer hotline, toll-free call center, and regional innovation hubs in Nairobi and Eldoret.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Language** | TypeScript |
| **Database & ORM** | SQLite (`prisma/dev.db`) + [Prisma ORM 6](https://www.prisma.io/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design Tokens |
| **Data Visualization** | [Chart.js](https://www.chartjs.org/) + `react-chartjs-2` |
| **Typography & Icons** | Google Fonts ([Outfit](https://fonts.google.com/specimen/Outfit)) + Google Material Symbols Outlined |
| **Authentication** | Custom credentials authentication with bcrypt password hashing |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or later
- npm (or yarn / pnpm)

### 1. Clone the Repository
```bash
git clone https://github.com/Arbarne-group/arbarne.git
cd arbarne
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
Inside `.env`:
```env
DATABASE_URL="file:./dev.db"
```

### 4. Initialize and Seed the Database
Push the Prisma schema to create the local SQLite database and populate it with initial benchmark data:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Account Credentials

A fully-seeded farm account is available for immediate testing:

| Field | Demo Credential |
| :--- | :--- |
| **Email** | `keziah@futurefarms.africa` |
| **Password** | `Password123!` |
| **Farm Name** | Highland Greens Organic Farm |
| **Location** | Kiambu / Central Highlands, Kenya |
| **Assessment Score** | 82 / 100 (Advancing Stage) |

> 💡 **Quick Login**: You can also click the **"Quick Demo Login"** button on [`/login`](http://localhost:3000/login) to log in with one click.

---

## 🧭 Application Directory & Routes

```
src/
├── app/
│   ├── page.tsx                    # Landing / Navigation Directory
│   ├── signup/                     # Sign Up with Password Strength Meter
│   ├── login/                      # Sign In with Quick Demo Login
│   ├── onboarding/                 # Onboarding Hub (8-Section Progress Tracker)
│   │   ├── step-1/                 # Farmer Profile
│   │   ├── step-2/                 # Farm Management Experience
│   │   ├── step-3/                 # Operating Style
│   │   ├── step-4/                 # Digital Platforms
│   │   └── step-5/                 # Aspirations
│   ├── assessment/                 # 25-Question Pillar 1 Assessment & Scoring Engine
│   ├── pricing/                    # Assessment Pricing ($1 vs $10)
│   ├── checkout/                   # M-Pesa STK Push & Card Checkout
│   ├── dashboard/                  # My Farm Dashboard (Chart.js Radar Diagram)
│   ├── learning/                   # Digital Learning & Masterclasses
│   ├── opportunities/              # Opportunity Desk (Grants & Off-Take)
│   ├── service-desk/               # Field Service Booking (Agronomists, Soil Labs)
│   ├── help/                       # Help Center & Searchable FAQs
│   ├── contact/                    # Contact Us & WhatsApp Desk
│   └── api/                        # Backend REST Endpoints
│       ├── auth/login/             # Session Authentication
│       ├── auth/signup/            # User Registration
│       ├── onboarding/step/        # Step Persistence (GET / POST)
│       └── checkout/               # Order & Payment Verification
├── components/
│   ├── dashboard/RadarChart.tsx    # Interactive Chart.js Spider Diagram
│   └── layout/
│       ├── AppShell.tsx            # Application Layout Wrapper
│       ├── Header.tsx              # Notifications & Profile Dropdown
│       ├── Sidebar.tsx             # Desktop Navigation
│       └── MobileNav.tsx           # Sticky Bottom Mobile Navigation
└── data/
    └── pillar1Questions.ts         # Pillar 1 Capabilities, Questions & Evidence
```

---

## 🧪 Build & Verification

Verify the entire application build and static generation:
```bash
npm run build
```
Expected output:
```
▲ Next.js 16.3.4 (Turbopack)
✓ Compiled successfully
✓ Running TypeScript ...
✓ Generating static pages (25/25)
All routes compiled with 0 errors.
```

---

## 📄 License
This project is proprietary and confidential to Future Farms Ltd. All rights reserved.

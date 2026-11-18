# 💎 SmartSpend AI – Intelligent Expense Tracker

![SmartSpend AI Banner](https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80)

<p align="center">
  <strong>An intelligent personal finance and expense velocity engine designed for modern wealth building.</strong><br>
  Built with React, Vite, TypeScript, Tailwind CSS, Recharts, and InsForge PostgreSQL Cloud.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Backend-InsForge_Cloud-6366F1?style=for-the-badge" alt="InsForge" />
</p>

---

## 🌟 Executive Summary

**SmartSpend AI** is an enterprise-grade fintech personal finance management web application. It transforms traditional transaction recording into automated financial intelligence, offering predictive expense categorization, dynamic budget overspend guardrails, subscription audits, daily safe-spend velocity tracking, and an algorithmic spending health score.

### 🌐 Live Production Deployment
- **Live URL**: Hosted on InsForge Cloud / Vercel Edge Hosting
- **Backend**: InsForge Multi-Tenant PostgreSQL 16 with Row-Level Security (RLS)
- **Authentication**: JWT-based session management (`auth.uid()` security barrier)

---

## 📸 Interface & Visual Walkthrough

| Dashboard Overview | Transaction Ledger |
| :---: | :---: |
| ![Dashboard Placeholder](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80) | ![Transactions Placeholder](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80) |
| *Real-time cashflow, health score & category breakdown* | *Smart filters, instant AI categorization & CSV export* |

| Budget & Overspend Controls | AI Intelligence & Insights |
| :---: | :---: |
| ![Budgets Placeholder](https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80) | ![AI Insights Placeholder](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80) |
| *Threshold progress bars with green/amber/red alerts* | *Recurring subscription audits & 50/30/20 rule optimization* |

---

## 🚀 Key Features

### 1. 🔐 Enterprise Authentication & Data Isolation
- Email and password sign-up / sign-in with InsForge Auth.
- Multi-tenant PostgreSQL isolation enforced at the database level via Row Level Security (`auth.uid() = user_id`).
- One-click **Demo / Guest Workspace** for instant exploration without requiring upfront credentials.
- Secure session tokens stored and refreshed automatically.

### 2. 📊 Executive Financial Dashboard
- **Financial Summary Cards**: Total Net Worth, Monthly Inflow, Monthly Outflow, and Net Savings with live savings rate percentage.
- **Estimated Spending Health Score**: Evaluates savings rate (45%), budget adherence (35%), and expense-to-income ratios (20%).
- **Interactive Cashflow Trend**: Area charts mapping income versus expense velocity over time.
- **Category Distribution**: Responsive donut chart breaking down top expense drivers.
- **Budget Threshold Mini-Tracker**: Live progress bars displaying immediate budget status.
- **Recent Activity Ledger**: Quick actions to edit or delete latest transactions.

### 3. ⚡ Smart Expense Management
- Full CRUD operations with instant optimistic UI updates and PostgreSQL persistence.
- **AI Auto-Categorization**: Heuristically suggests categories and transaction types as the user types merchants (e.g. "Starbucks" &rarr; Food & Dining, "Whole Foods" &rarr; Groceries, "Uber" &rarr; Transportation).
- Comprehensive search across titles, merchants, categories, and personal notes.
- Multi-dimensional filters: Inflow vs. Outflow, Category selector, Payment Method, and Sort by Date / Amount.
- **One-Click CSV Export**: Formatted download of filtered or full transaction records.

### 4. 🧠 AI Expense Intelligence Engine
- **Subscription Audit**: Detects recurring digital memberships (Netflix, Spotify, Gym, Cloud services) and estimates potential annual savings.
- **Dining Out & Impulse Spend Analyzer**: Flags excessive dining velocity and generates concrete weekly meal-prep savings targets.
- **50/30/20 Rule Alignment**: Audits discretionary spending against essential living costs.
- **Daily Safe Spend Velocity**: Calculates exact daily safe spend remaining in the month without compromising monthly savings targets.
- **Transparent Execution**: Clear distinction between rule-based heuristic intelligence and optional generative LLM keys.

### 5. 🎯 Budgets & Financial Guardrails
- Custom monthly spending limits per category.
- Dynamic color-coded progress bars:
  - 🟢 **On Track** (< 70% utilized)
  - 🟡 **Nearing Limit** (70% – 90% utilized)
  - 🔴 **Overbudget Alert** (> 100% utilized with exact dollar overrun)
- Overspending alerts integrated throughout dashboard and AI feed.

### 6. 📈 Deep Analytics & Target Milestone Goals
- Filter metrics by Weekly, Monthly, or Yearly horizons.
- Comparative bar charts analyzing Inflow vs Outflow vs Net Retained wealth.
- **Savings Milestone Tracker**: Set targeted wealth goals (Emergency Fund, Travel, Vehicle, Home) with deposit simulators and progress rings.

---

## 🛠️ Architecture & Tech Stack

```
smartspend-ai-expense-tracker/
├── migrations/                # InsForge PostgreSQL migrations & RLS policies
├── src/
│   ├── components/
│   │   ├── ai/               # AI Insights & pattern analysis views
│   │   ├── analytics/        # Timeframe charts & milestone trackers
│   │   ├── auth/             # Modal authentication dialogs
│   │   ├── budgets/          # Category limits & overspend alert cards
│   │   ├── dashboard/        # Summary KPI cards, Recharts cashflow, donut
│   │   ├── layout/           # Glassmorphic sidebar & responsive header
│   │   ├── savings/          # Savings goals modal
│   │   ├── settings/         # Preferences, currency, cloud status
│   │   └── transactions/     # Transaction table & AI-assisted modal
│   ├── context/
│   │   ├── AuthContext.tsx   # InsForge auth state & profile management
│   │   └── FinanceContext.tsx# Real-time state, InsForge CRUD, CSV export
│   ├── lib/
│   │   ├── aiEngine.ts       # Categorization, health score, pattern engine
│   │   ├── demoData.ts       # Realistic sample financial data
│   │   └── insforge.ts       # InsForge SDK client initialization
│   ├── types/
│   │   └── index.ts          # Strongly typed domain models
│   ├── App.tsx               # Primary application router & layout
│   └── main.tsx              # DOM entry point
├── vercel.json               # SPA client routing rewrite rule
├── vite.config.ts            # Vite bundler configuration
└── tailwind.config.js        # Modern fintech dark navy theme definition
```

### Stack Components
- **Frontend Framework**: React 18 with TypeScript
- **Build System**: Vite 5
- **Styling**: Tailwind CSS v3.4 with custom dark navy palette
- **Data Visualization**: Recharts (Responsive Area, Bar, and Donut charts)
- **Icons**: Lucide React
- **Cloud Database**: InsForge PostgreSQL 16
- **Database Security**: Row Level Security (RLS) with schema-level grants
- **Hosting & Edge**: InsForge Hosting / Vercel Edge SPA

---

## 💾 Database Schema

The database is structured in PostgreSQL with Row Level Security:

```sql
-- Profiles: User financial preferences and baseline targets
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  currency TEXT DEFAULT 'USD',
  monthly_income_target NUMERIC(12, 2) DEFAULT 5000.00,
  monthly_savings_target NUMERIC(12, 2) DEFAULT 1500.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions: Inflow and Outflow records
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL DEFAULT 'Credit Card',
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets: Category monthly caps
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  monthly_limit NUMERIC(12, 2) NOT NULL,
  month TEXT NOT NULL,
  CONSTRAINT uq_user_category_month UNIQUE (user_id, category, month)
);

-- Savings Goals: Target milestone funds
CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL,
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  target_date DATE,
  category TEXT DEFAULT 'General'
);
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- InsForge CLI (`npx -y @insforge/cli`)

### 1. Clone the repository
```bash
git clone https://github.com/rashiyadav684/smartspend-ai-expense-tracker.git
cd smartspend-ai-expense-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
VITE_INSFORGE_URL=https://<your-appkey>.<region>.insforge.app
VITE_INSFORGE_ANON_KEY=<your-anon-key>
```

### 4. Run database migrations
```bash
npx -y @insforge/cli db migrations up --all
```

### 5. Launch the local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for production
```bash
npm run build
```

---

## 🔒 Security & Privacy

- **Row Level Security**: Users can only query, insert, edit, or delete their own transactions and budgets (`auth.uid() = user_id`).
- **No Hardcoded Secrets**: Zero API keys or tokens are stored in version control.
- **Transparent AI Guarantee**: Never generates fabricated statistics or pretends an AI model was called when using local heuristic engines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

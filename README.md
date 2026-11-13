# Vynora — Smart AI Life Operating System (Demo Showcase)
> One Platform. Every Part of Life. • 18 Unified Life Domains

Vynora is a comprehensive, production-grade life operating system designed to centralize and simplify every aspect of daily life. Built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Firebase Cloud Firestore**, this repository features a fully functional, self-contained **Demo Mode** with realistic preloaded data, enabling recruiters and interviewers to explore the entire platform without requiring credentials.

---

## 🌟 Key Features & 18 Unified Modules

*   **Executive Dashboard:** Centralized high-level summary aggregating net savings, today's expenses, active farm crops, daily dairy yield, upcoming bills, medication reminders, and loan liabilities.
*   **Finance Tracker:** Multi-account management (Bank, Savings, Agri, Cash, Credit Card), category budgets with live progress bars, transaction logging, inter-account transfers, and CSV exports.
*   **Loan Management:** Reducing-balance EMI banking formulas, dynamic month-by-month amortization schedules, payment tracking, and automatic expense ledger synchronization.
*   **Digital Locker:** Encrypted personal, education, vehicle, property, and health document management with renewal badges (<45 days) and in-browser previews.
*   **Tasks & Planner:** Interactive Kanban board (To-Do, In Progress, Review, Completed), priority tiers, recurring schedules, and nested subtask checklists.
*   **Medicine Reminder:** Time-slot dose scheduling (Morning, Afternoon, Night), one-tap dose logging, pill stock tracking, and automated refill alerts.
*   **Bill Reminder:** Utility, Internet, Rent, and Insurance tracking with boundary-aware overdue detection and automatic Finance expense syncing.
*   **Emergency Center:** Instant one-tap dialing for national hotlines (100, 108, 101, 112) and personal contacts with medical notes and blood groups.
*   **Agriculture Manager:** Land parcel registry, crop cycle management (Kharif, Rabi), input cost tracking, field activities, harvest yield, and profit margin calculations.
*   **Dairy Management:** Cattle herd registry (Holstein, Jersey, Gir), daily morning/evening milk production logs, automatic revenue calculation, feed logs, and veterinary records.
*   **Vehicle Manager:** Fleet management, monotonic odometer tracking, fuel logs with automatic km/L mileage calculation, and insurance/PUC renewal alerts.
*   **Student Planner:** Enrolled courses, assignment tracking with priority, exam schedules, and a 7-day weekly timetable grid.
*   **Home Inventory:** Household asset registry, room allocations, purchase valuations, warranty expiry alerts, and cumulative asset value calculations.
*   **Password Vault:** Client-side zero-knowledge encryption using PBKDF2 (100,000 iterations) and AES-GCM (256-bit) with auto-lock and cryptographic password generation.
*   **Family Dashboard:** Member profiles, family notice board broadcasts, recurring household chores with completion toggles, event calendar, and shared expenses.
*   **Health Records:** Personal health profile (Blood Group O+), vitals tracking (Blood Pressure, Sugar, BMI) with interactive Recharts BP trend graphs, and doctor consultation history.
*   **Goal Tracker:** Measurable financial, career, agricultural, and fitness targets with milestone progression and deadline countdowns.
*   **Global Reports:** Master multi-tab reports aggregating net worth, debt obligations, farm returns, and operational expenses with CSV download readiness.
*   **Vynora AI Assistant:** Context-aware autonomous assistant analyzing live user telemetry and providing intelligent recommendations.

---

## 🚀 Two Application Modes

### 1. DEMO MODE (Default — Recruiter & Portfolio Showcase)
*   **Instant Access:** Open the app and explore immediately without registration or login.
*   **Preloaded Realistic Dataset:** 18 modules populated with coherent, realistic fictional records (Persona: *Alex Morgan*).
*   **In-Browser Persistence:** Changes (additions, edits, deletions) persist in your browser via `localStorage`.
*   **Reset Demo Data:** Click "Reset Demo Data" in the top banner anytime to restore pristine initial records.
*   **Zero Cloud Dependencies:** No Firebase API keys or Cloudinary secrets needed to run or evaluate the demo.

### 2. PRODUCTION MODE
*   **Firebase Authentication:** Email/password and Google OAuth with verified session handling.
*   **Cloud Firestore:** Direct multi-tab persistent cloud database.
*   **Cloudinary:** Direct unsigned client-side file and document uploads.

---

## 🛠️ Quick Start (Run Locally)

### 1. Clone & Install
```bash
git clone https://github.com/Aravindh2727/Vynora-demo.git
cd Vynora-demo
npm install --prefix client
```

### 2. Launch Demo Mode
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser. The application will launch directly into the populated Demo Dashboard.

### 3. Run Automated Verification Tests
```bash
npm run test:demo
```
Runs 43 automated tests verifying all 18 modules, banking calculations, and demo data reset.

---

## 🏗️ Architecture & Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Chart.js.
*   **Database & Storage:** Firebase Cloud Firestore (Production) / DemoStorage Engine (Demo Mode).
*   **State Management:** Zustand Context Engine, Query Cache with dynamic TTL.
*   **PWA Support:** Vite PWA Plugin with offline service worker.

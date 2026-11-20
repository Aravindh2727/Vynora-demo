const path = require('path');
const fs = require('fs');
const pptxgen = require('./node_modules/pptxgenjs');

async function createPresentation() {
  console.log('🚀 Initializing Vynora PowerPoint Presentation Generator...');
  const pres = new pptxgen();

  // Configure 16:9 widescreen presentation layout
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'Vynora — Smart AI Life Operating System';
  pres.company = 'Vynora Engineering';
  pres.author = 'Aravindh';
  pres.subject = 'Project Presentation & Technical Architecture';

  // Professional Executive Light Design System Colors
  const C = {
    bg: 'F8FAFC',          // Crisp slate off-white
    bgCard: 'FFFFFF',      // Pure white elevated card
    bgCardLight: 'F1F5F9', // Soft subtle container
    primary: '0284C7',     // Executive ocean blue / deep cyan
    secondary: '0EA5E9',   // Sky blue accent
    accent: '059669',      // Emerald green
    warning: 'D97706',     // Warm amber / gold
    textMain: '0F172A',    // High-contrast deep slate navy
    textMuted: '475569',   // Slate grey
    border: 'CBD5E1',      // Clean subtle card border
    borderCyan: '0284C7'   // Ocean blue highlight
  };

  const ASSETS_DIR = path.resolve(__dirname, 'assets');
  const logoPath = path.join(ASSETS_DIR, 'vynora_logo.png');
  const screenDashboard = path.join(ASSETS_DIR, 'screen_dashboard.png');
  const screenFinance = path.join(ASSETS_DIR, 'screen_finance.png');
  const screenDairy = path.join(ASSETS_DIR, 'screen_dairy.png');
  const screenVault = path.join(ASSETS_DIR, 'screen_vault.png');

  // Helper: Adds consistent header & footer across content slides
  function addSlideHeader(slide, category, title, subtitle, slideNum) {
    slide.background = { color: C.bg };

    // Category Badge
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.35, w: 5.0, h: 0.25,
      fontSize: 9, bold: true, color: C.primary, fontFace: 'Calibri'
    });

    // Main Slide Title
    slide.addText(title, {
      x: 0.8, y: 0.58, w: 8.4, h: 0.5,
      fontSize: 22, bold: true, color: C.textMain, fontFace: 'Calibri'
    });

    // Subtitle / Executive Summary Line
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8, y: 1.05, w: 8.4, h: 0.3,
        fontSize: 11, color: C.textMuted, fontFace: 'Calibri'
      });
    }

    // Top subtle divider line
    slide.addShape(pres.ShapeType.line, {
      x: 0.8, y: 1.38, w: 8.4, h: 0,
      line: { color: C.border, width: 1 }
    });

    // Footer
    slide.addText('Vynora — Smart AI Life Operating System • 18 Unified Domains', {
      x: 0.8, y: 5.25, w: 6.0, h: 0.25,
      fontSize: 8.5, color: C.textMuted, fontFace: 'Calibri'
    });

    if (slideNum) {
      slide.addText(`${slideNum} / 12`, {
        x: 8.2, y: 5.25, w: 1.0, h: 0.25,
        align: 'right', fontSize: 8.5, color: C.primary, fontFace: 'Calibri', bold: true
      });
    }
  }

  // =========================================================================
  // SLIDE 1: Title Slide
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bg };

    // Decorative background container
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 0.6, w: 8.4, h: 4.4,
      fill: { color: C.bgCard },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.15
    });

    // Logo
    if (fs.existsSync(logoPath)) {
      slide.addImage({
        path: logoPath,
        x: 1.3, y: 1.0, w: 1.2, h: 1.2
      });
    }

    // Badge
    slide.addText('TECHNICAL SHOWCASE & ARCHITECTURE REVIEW', {
      x: 2.7, y: 1.1, w: 5.5, h: 0.3,
      fontSize: 9.5, bold: true, color: C.primary, fontFace: 'Calibri'
    });

    // Title
    slide.addText('VYNORA', {
      x: 2.7, y: 1.4, w: 5.5, h: 0.7,
      fontSize: 38, bold: true, color: C.textMain, fontFace: 'Calibri'
    });

    // Tagline
    slide.addText('Smart AI Life Operating System • 18 Unified Life Domains', {
      x: 2.7, y: 2.05, w: 6.0, h: 0.35,
      fontSize: 14, color: C.secondary, fontFace: 'Calibri'
    });

    // Divider
    slide.addShape(pres.ShapeType.line, {
      x: 1.3, y: 2.6, w: 7.4, h: 0,
      line: { color: C.border, width: 1 }
    });

    // Key metrics chips
    const chips = [
      { num: '18 Domains', label: 'Finance to Farming' },
      { num: 'Zero Latency', label: '100% In-Browser Demo' },
      { num: 'Client Security', label: 'AES-256 PBKDF2 Vault' },
      { num: '43 Verified', label: 'Automated Test Pass' }
    ];

    chips.forEach((c, idx) => {
      const cx = 1.3 + (idx * 1.9);
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx, y: 2.85, w: 1.7, h: 0.95,
        fill: { color: C.bgCardLight },
        line: { color: C.border, width: 1 },
        rectRadius: 0.1
      });
      slide.addText(c.num, {
        x: cx, y: 2.95, w: 1.7, h: 0.35,
        align: 'center', fontSize: 11, bold: true, color: C.primary, fontFace: 'Calibri'
      });
      slide.addText(c.label, {
        x: cx, y: 3.35, w: 1.7, h: 0.35,
        align: 'center', fontSize: 8.5, color: C.textMuted, fontFace: 'Calibri'
      });
    });

    // Presenter Details
    slide.addText('Project Developer: Aravindh • Modern Full-Stack Web Architecture\nBuilt with React 19, TypeScript, Tailwind CSS, Vite & Firebase Firestore Proxy', {
      x: 1.3, y: 4.15, w: 7.4, h: 0.6,
      fontSize: 9.5, color: C.textMuted, fontFace: 'Calibri', align: 'center'
    });
  }

  // =========================================================================
  // SLIDE 2: Introduction — What is Vynora?
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'System Introduction',
      'What is Vynora?',
      'A production-grade life operating system uniting daily personal, financial, and rural workflows.',
      2
    );

    // Left Column: 3 Core Pillars
    const pillars = [
      {
        title: 'Unified Life Operating Hub',
        desc: 'Consolidates 18 distinct everyday domains—from household budgets and vehicle maintenance to agricultural crop cycles and dairy yields—into one cohesive platform.',
        accent: C.primary
      },
      {
        title: 'Zero-Friction Recruiter Demo Mode',
        desc: 'Features a self-contained in-browser transactional database. Recruiters and clients explore all features instantly without requiring signups or API keys.',
        accent: C.accent
      },
      {
        title: 'Mathematical Rigor & Privacy by Design',
        desc: 'Executes verified banking reducing-balance EMI formulas, dynamic crop margin analysis, and client-side zero-knowledge AES-256 cryptographic vault security.',
        accent: C.warning
      }
    ];

    pillars.forEach((p, idx) => {
      const py = 1.6 + (idx * 1.15);
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: py, w: 5.0, h: 1.05,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });

      // Left accent bar
      slide.addShape(pres.ShapeType.rect, {
        x: 0.8, y: py, w: 0.08, h: 1.05,
        fill: { color: p.accent },
        line: { color: p.accent }
      });

      slide.addText(p.title, {
        x: 1.05, y: py + 0.1, w: 4.6, h: 0.28,
        fontSize: 12, bold: true, color: C.textMain, fontFace: 'Calibri'
      });
      slide.addText(p.desc, {
        x: 1.05, y: py + 0.38, w: 4.6, h: 0.6,
        fontSize: 9.5, color: C.textMuted, fontFace: 'Calibri'
      });
    });

    // Right Column: Key Metrics & Architectural Highlights
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.0, y: 1.6, w: 3.2, h: 3.35,
      fill: { color: C.bgCard },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.1
    });

    slide.addText('CORE CAPABILITIES', {
      x: 6.2, y: 1.8, w: 2.8, h: 0.25,
      fontSize: 10, bold: true, color: C.primary, fontFace: 'Calibri'
    });

    const metrics = [
      { top: '18 Unified Domains', sub: 'Comprehensive daily life coverage' },
      { top: '100% In-Browser State', sub: 'Local persistence with zero cloud lag' },
      { top: '1-Click Data Reset', sub: 'Instant restore to pristine demo records' },
      { top: 'Single-Page PWA', sub: 'Responsive mobile & desktop design' }
    ];

    metrics.forEach((m, idx) => {
      const my = 2.15 + (idx * 0.68);
      slide.addText(m.top, {
        x: 6.2, y: my, w: 2.8, h: 0.25,
        fontSize: 11, bold: true, color: C.textMain, fontFace: 'Calibri'
      });
      slide.addText(m.sub, {
        x: 6.2, y: my + 0.22, w: 2.8, h: 0.25,
        fontSize: 8.5, color: C.textMuted, fontFace: 'Calibri'
      });
    });
  }

  // =========================================================================
  // SLIDE 3: Problem Statement — The Fragmented Life Problem
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'Industry Challenges',
      'The Fragmented Life Problem',
      'Modern users struggle with fragmented apps, disconnected records, and privacy risks.',
      3
    );

    const problems = [
      {
        num: '01',
        title: 'App Fatigue & Extreme Fragmentation',
        text: 'The average household juggles 8–12 distinct apps for finances, medical records, vehicle servicing, passwords, and farm notes, causing cognitive fatigue and missed deadlines.'
      },
      {
        num: '02',
        title: 'Zero Cross-Domain Intelligence',
        text: 'Information sits in isolated silos. When loan installments are paid or cattle produce milk revenues, standard expense apps cannot cross-synchronize ledger balances.'
      },
      {
        num: '03',
        title: 'Cloud Privacy & Credential Leakage',
        text: 'Storing sensitive passwords and private health records on commercial SaaS platforms exposes users to data breaches, subscription paywalls, and unauthorized tracking.'
      },
      {
        num: '04',
        title: 'High Barrier for Portfolio Evaluation',
        text: 'Recruiters and evaluators cannot easily review complex full-stack apps when forced to create test accounts, verify emails, or configure third-party cloud credentials.'
      }
    ];

    problems.forEach((p, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const px = 0.8 + (col * 4.3);
      const py = 1.6 + (row * 1.7);

      slide.addShape(pres.ShapeType.roundRect, {
        x: px, y: py, w: 4.1, h: 1.5,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(p.num, {
        x: px + 0.2, y: py + 0.15, w: 0.6, h: 0.4,
        fontSize: 16, bold: true, color: C.primary, fontFace: 'Calibri'
      });

      slide.addText(p.title, {
        x: px + 0.8, y: py + 0.15, w: 3.1, h: 0.35,
        fontSize: 11.5, bold: true, color: C.textMain, fontFace: 'Calibri'
      });

      slide.addText(p.text, {
        x: px + 0.2, y: py + 0.55, w: 3.7, h: 0.85,
        fontSize: 9.5, color: C.textMuted, fontFace: 'Calibri'
      });
    });
  }

  // =========================================================================
  // SLIDE 4: Project Objectives — What Vynora Achieves
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'Target Goals',
      'Project Objectives & Success Criteria',
      'Engineered to deliver enterprise reliability, zero-friction review, and complete data safety.',
      4
    );

    const objectives = [
      {
        tag: 'CENTRALIZATION',
        title: 'Unify 18 Domains in One Ecosystem',
        points: [
          'Bring urban finance and rural agriculture onto a single dashboard',
          'Coordinate household chores, vehicle logs, and family notices',
          'Provide unified global search across all 18 modules simultaneously'
        ],
        accent: C.primary
      },
      {
        tag: 'ACCURACY & RIGOR',
        title: 'Verified Financial & Agri Calculations',
        points: [
          'Dynamic reducing-balance EMI loan amortization schedules',
          'Real crop profit margins (yield revenues vs input costs)',
          'Daily dairy milk yield pricing and vehicle fuel km/L tracking'
        ],
        accent: C.accent
      },
      {
        tag: 'ZERO-KNOWLEDGE PRIVACY',
        title: 'Client-Side Cryptographic Security',
        points: [
          'AES-GCM 256-bit encryption for sensitive vault credentials',
          'PBKDF2 key derivation using 100,000 hash iterations',
          'Master password never leaves the browser in any form'
        ],
        accent: C.warning
      },
      {
        tag: 'EVALUATION FREEDOM',
        title: 'Instant Recruiter Demo Architecture',
        points: [
          'Zero cloud credentials or Firebase setup needed for evaluation',
          'Coherent preloaded records under executive persona Alex Morgan',
          'Full CRUD capability with 1-click restore to pristine demo state'
        ],
        accent: C.secondary
      }
    ];

    objectives.forEach((obj, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const ox = 0.8 + (col * 4.3);
      const oy = 1.6 + (row * 1.7);

      slide.addShape(pres.ShapeType.roundRect, {
        x: ox, y: oy, w: 4.1, h: 1.55,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(obj.tag, {
        x: ox + 0.25, y: oy + 0.1, w: 3.6, h: 0.2,
        fontSize: 8.5, bold: true, color: obj.accent, fontFace: 'Calibri'
      });

      slide.addText(obj.title, {
        x: ox + 0.25, y: oy + 0.3, w: 3.6, h: 0.25,
        fontSize: 11.5, bold: true, color: C.textMain, fontFace: 'Calibri'
      });

      const bullets = obj.points.map(pt => `• ${pt}`).join('\n');
      slide.addText(bullets, {
        x: ox + 0.25, y: oy + 0.58, w: 3.6, h: 0.85,
        fontSize: 9, color: C.textMuted, fontFace: 'Calibri'
      });
    });
  }

  // =========================================================================
  // SLIDE 5: Proposed Solution & Core Architecture
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'System Architecture',
      'The Vynora Architecture & Service Layer',
      'A decoupled architecture featuring a transparent proxy pattern for dual-mode operation.',
      5
    );

    // 3 Horizontal Architecture Tiers
    const tiers = [
      {
        layer: 'TIER 1: PRESENTATION & USER EXPERIENCE',
        color: C.primary,
        desc: 'React 19 + TypeScript + Tailwind CSS • Glassmorphic Dark UI • Responsive Desktop & Mobile PWA',
        items: 'Executive Dashboard • 18 Module Views • Global Search Modal (Ctrl+K) • Recharts Data Analytics'
      },
      {
        layer: 'TIER 2: TRANSPARENT SERVICE PROXY LAYER',
        color: C.secondary,
        desc: 'CreateServiceProxy Pattern • Intercepts 100% of Module Calls Dynamically Without Code Duplication',
        items: 'Dispatches to DemoServiceAdapter (in Demo Mode) or Firestore Cloud Services (in Production Mode)'
      },
      {
        layer: 'TIER 3: DATA PERSISTENCE & CRYPTO ENGINES',
        color: C.accent,
        desc: 'Isolated Dual Data Stores • Zero Cloud Leaks • Full Offline Resilience',
        items: 'DemoStorage Engine (In-Browser LocalStorage CRUD) | Firebase Cloud Firestore | Web Crypto API (AES-GCM/PBKDF2)'
      }
    ];

    tiers.forEach((t, idx) => {
      const ty = 1.6 + (idx * 1.15);
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: ty, w: 8.4, h: 1.0,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });

      // Top banner of tier
      slide.addShape(pres.ShapeType.rect, {
        x: 0.8, y: ty, w: 0.1, h: 1.0,
        fill: { color: t.color },
        line: { color: t.color }
      });

      slide.addText(t.layer, {
        x: 1.1, y: ty + 0.1, w: 8.0, h: 0.22,
        fontSize: 10, bold: true, color: t.color, fontFace: 'Calibri'
      });

      slide.addText(t.desc, {
        x: 1.1, y: ty + 0.35, w: 8.0, h: 0.25,
        fontSize: 10.5, bold: true, color: C.textMain, fontFace: 'Calibri'
      });

      slide.addText(t.items, {
        x: 1.1, y: ty + 0.62, w: 8.0, h: 0.28,
        fontSize: 9, color: C.textMuted, fontFace: 'Calibri'
      });
    });
  }

  // =========================================================================
  // SLIDE 6: Key Features & 18 Integrated Modules
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'Product Capabilities',
      'Comprehensive 18-Module Ecosystem',
      'Four organized operational clusters serving personal, enterprise, and rural needs.',
      6
    );

    const clusters = [
      {
        name: 'Finance & Liabilities',
        badge: 'MONEY & BANKING',
        color: C.primary,
        modules: [
          'Finance Tracker: Multi-account ledger & category budgets',
          'Loan Manager: Reducing-balance EMI & amortization',
          'Bill Reminder: Boundary-aware overdue & auto-sync',
          'Global Reports: Comprehensive net worth & CSV exports'
        ]
      },
      {
        name: 'Rural & Agricultural Hub',
        badge: 'FARMING & DAIRY',
        color: C.accent,
        modules: [
          'Agriculture Manager: Land parcels, crop cycles & ROI',
          'Dairy Management: Cattle herd registry & morning/evening yield',
          'Vehicle Manager: Fleet odometer & fuel km/L efficiency',
          'Home Inventory: Room assets, valuations & warranties'
        ]
      },
      {
        name: 'Security & Privacy Locker',
        badge: 'ZERO-KNOWLEDGE',
        color: C.warning,
        modules: [
          'Password Vault: AES-GCM 256-bit client encryption',
          'Digital Locker: Encrypted property, education & ID docs',
          'Emergency Center: 1-tap hotlines & blood group records',
          'Settings & Audit: Session controls & instant data purge'
        ]
      },
      {
        name: 'Personal, Family & AI',
        badge: 'LIFESTYLE & HEALTH',
        color: C.secondary,
        modules: [
          'Health Records: BP trends, blood glucose & WHO BMI',
          'Medicine Reminder: Slot-based dosing & pill inventories',
          'Family Dashboard: Household chores & notice board',
          'Tasks Planner: Kanban board with nested checklists',
          'Student Planner & Vynora AI Context Assistant'
        ]
      }
    ];

    clusters.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cx = 0.8 + (col * 4.3);
      const cy = 1.6 + (row * 1.7);

      slide.addShape(pres.ShapeType.roundRect, {
        x: cx, y: cy, w: 4.1, h: 1.55,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(c.badge, {
        x: cx + 0.2, y: cy + 0.1, w: 3.7, h: 0.2,
        fontSize: 8.5, bold: true, color: c.color, fontFace: 'Calibri'
      });

      slide.addText(c.name, {
        x: cx + 0.2, y: cy + 0.3, w: 3.7, h: 0.25,
        fontSize: 12, bold: true, color: C.textMain, fontFace: 'Calibri'
      });

      const bullets = c.modules.map(m => `• ${m}`).join('\n');
      slide.addText(bullets, {
        x: cx + 0.2, y: cy + 0.58, w: 3.7, h: 0.85,
        fontSize: 8.5, color: C.textMuted, fontFace: 'Calibri'
      });
    });
  }

  // =========================================================================
  // SLIDE 7: Technology Stack
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'Technology & Engineering',
      'Modern, High-Performance Tech Stack',
      'Selected for type safety, zero runtime vulnerabilities, and instant web delivery.',
      7
    );

    const stack = [
      {
        category: 'Frontend & UI Framework',
        tech: 'React 19 • TypeScript • Vite • Tailwind CSS',
        details: 'Modern component hierarchy utilizing React 19 concurrent features, strict TypeScript typing across all models, and responsive Tailwind styling.',
        color: C.primary
      },
      {
        category: 'Data Visualization & UX',
        tech: 'Recharts • Chart.js • Framer Motion • Lucide',
        details: 'High-performance interactive SVG graphs for health vitals, finance budget progress bars, fluid spring page transitions, and consistent iconography.',
        color: C.secondary
      },
      {
        category: 'State & Local Persistence',
        tech: 'Zustand • LocalStorage Engine • QueryCache',
        details: 'Context engine state store with TTL caching, combined with DemoStorage providing persistent in-browser CRUD and instant transactional rollback.',
        color: C.accent
      },
      {
        category: 'DevOps & Quality Assurance',
        tech: 'Render CDN • Jiti Test Runner • Web Crypto API',
        details: '1-click Static Site deployment with client-side SPA rewrites, client-side AES-GCM 256 encryption, and 43 automated verification unit tests.',
        color: C.warning
      }
    ];

    stack.forEach((s, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const sx = 0.8 + (col * 4.3);
      const sy = 1.6 + (row * 1.7);

      slide.addShape(pres.ShapeType.roundRect, {
        x: sx, y: sy, w: 4.1, h: 1.55,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(s.category.toUpperCase(), {
        x: sx + 0.2, y: sy + 0.12, w: 3.7, h: 0.2,
        fontSize: 8.5, bold: true, color: s.color, fontFace: 'Calibri'
      });

      slide.addText(s.tech, {
        x: sx + 0.2, y: sy + 0.32, w: 3.7, h: 0.28,
        fontSize: 11.5, bold: true, color: C.textMain, fontFace: 'Calibri'
      });

      slide.addText(s.details, {
        x: sx + 0.2, y: sy + 0.62, w: 3.7, h: 0.8,
        fontSize: 9, color: C.textMuted, fontFace: 'Calibri'
      });
    });
  }

  // =========================================================================
  // SLIDE 8: How It Works — Application Workflow
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'User Flow & Logic',
      'How Vynora Works — End-to-End Pipeline',
      'A seamless 4-stage pipeline from instant launch to verified mathematical output.',
      8
    );

    const steps = [
      {
        num: 'STEP 1',
        title: 'Instant Launch & Persona Seeding',
        desc: 'Recruiters click "Enter Demo" or load the app. Pre-seeded Alex Morgan profile initializes without passwords or registration barriers.',
        color: C.primary
      },
      {
        num: 'STEP 2',
        title: 'Proxy Interception & Indexing',
        desc: 'The ServiceProxy routes all data requests to DemoStorage. Global search indexes pre-warm across all 18 modules for instant Ctrl+K discovery.',
        color: C.secondary
      },
      {
        num: 'STEP 3',
        title: 'Mathematical Calculations',
        desc: 'Banking reducing-balance EMI schedules, crop margins, and dairy milk revenues calculate dynamically with real-time reactivity.',
        color: C.accent
      },
      {
        num: 'STEP 4',
        title: 'Reactive UI & 1-Click Reset',
        desc: 'Users modify or add demonstration records. All changes persist across browser refreshes, with a 1-click restore to default sample data.',
        color: C.warning
      }
    ];

    steps.forEach((st, idx) => {
      const sx = 0.8 + (idx * 2.15);
      slide.addShape(pres.ShapeType.roundRect, {
        x: sx, y: 1.65, w: 2.0, h: 3.3,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: sx + 0.15, y: 1.85, w: 1.7, h: 0.35,
        fill: { color: C.bgCardLight },
        line: { color: st.color, width: 1 },
        rectRadius: 0.05
      });

      slide.addText(st.num, {
        x: sx + 0.15, y: 1.9, w: 1.7, h: 0.25,
        align: 'center', fontSize: 10, bold: true, color: st.color, fontFace: 'Calibri'
      });

      slide.addText(st.title, {
        x: sx + 0.15, y: 2.35, w: 1.7, h: 0.65,
        align: 'center', fontSize: 11, bold: true, color: C.textMain, fontFace: 'Calibri'
      });

      slide.addShape(pres.ShapeType.line, {
        x: sx + 0.3, y: 3.1, w: 1.4, h: 0,
        line: { color: C.border, width: 1 }
      });

      slide.addText(st.desc, {
        x: sx + 0.15, y: 3.25, w: 1.7, h: 1.5,
        align: 'left', fontSize: 9, color: C.textMuted, fontFace: 'Calibri'
      });
    });
  }

  // =========================================================================
  // SLIDE 9: Application Screenshots — Dashboard & Finance
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'Live Interface Demonstration',
      'Executive Dashboard & Finance Tracker',
      'Actual application interfaces captured from the live Vynora build.',
      9
    );

    // Left Screen: Dashboard
    if (fs.existsSync(screenDashboard)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 1.6, w: 4.1, h: 2.5,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: screenDashboard,
        x: 0.85, y: 1.65, w: 4.0, h: 2.4
      });
    }

    slide.addText('Executive Dashboard Overview', {
      x: 0.8, y: 4.2, w: 4.1, h: 0.25,
      fontSize: 11.5, bold: true, color: C.primary, fontFace: 'Calibri'
    });
    slide.addText('Centralized command center aggregating net savings, active farm parcels, today\'s dairy milk production, upcoming bill alerts, and household chores.', {
      x: 0.8, y: 4.45, w: 4.1, h: 0.65,
      fontSize: 9, color: C.textMuted, fontFace: 'Calibri'
    });

    // Right Screen: Finance
    if (fs.existsSync(screenFinance)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 5.1, y: 1.6, w: 4.1, h: 2.5,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: screenFinance,
        x: 5.15, y: 1.65, w: 4.0, h: 2.4
      });
    }

    slide.addText('Multi-Account Finance & Budgeting', {
      x: 5.1, y: 4.2, w: 4.1, h: 0.25,
      fontSize: 11.5, bold: true, color: C.secondary, fontFace: 'Calibri'
    });
    slide.addText('Real-time balances across Bank, Savings, Agri, and Cash wallets with category progress bars, income/expense breakdown, and CSV data export.', {
      x: 5.1, y: 4.45, w: 4.1, h: 0.65,
      fontSize: 9, color: C.textMuted, fontFace: 'Calibri'
    });
  }

  // =========================================================================
  // SLIDE 10: Application Screenshots — Dairy & Security Vault
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'Live Interface Demonstration',
      'Rural Dairy Management & Password Vault',
      'Demonstrating versatility across rural enterprise tracking and military-grade security.',
      10
    );

    // Left Screen: Dairy
    if (fs.existsSync(screenDairy)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 1.6, w: 4.1, h: 2.5,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: screenDairy,
        x: 0.85, y: 1.65, w: 4.0, h: 2.4
      });
    }

    slide.addText('Dairy Herd & Milk Production Registry', {
      x: 0.8, y: 4.2, w: 4.1, h: 0.25,
      fontSize: 11.5, bold: true, color: C.accent, fontFace: 'Calibri'
    });
    slide.addText('Tracks cattle pedigree (Holstein, Gir), daily morning/evening milk yields, automatic revenue calculation, feed inventories, and veterinary vaccination records.', {
      x: 0.8, y: 4.45, w: 4.1, h: 0.65,
      fontSize: 9, color: C.textMuted, fontFace: 'Calibri'
    });

    // Right Screen: Password Vault
    if (fs.existsSync(screenVault)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 5.1, y: 1.6, w: 4.1, h: 2.5,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1.5 },
        rectRadius: 0.08
      });
      slide.addImage({
        path: screenVault,
        x: 5.15, y: 1.65, w: 4.0, h: 2.4
      });
    }

    slide.addText('Zero-Knowledge Password Vault', {
      x: 5.1, y: 4.2, w: 4.1, h: 0.25,
      fontSize: 11.5, bold: true, color: C.warning, fontFace: 'Calibri'
    });
    slide.addText('Client-side AES-GCM 256-bit encryption with PBKDF2 100k iteration key derivation, cryptographic password generator, and auto-lock security timer.', {
      x: 5.1, y: 4.45, w: 4.1, h: 0.65,
      fontSize: 9, color: C.textMuted, fontFace: 'Calibri'
    });
  }

  // =========================================================================
  // SLIDE 11: Benefits, Practical Value & Impact
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'Value Proposition',
      'Key Benefits & Real-World Impact',
      'Delivering measurable time savings, complete privacy, and dual-demographic utility.',
      11
    );

    const benefits = [
      {
        title: 'Eliminates 10+ Disconnected Apps',
        desc: 'Saves hours each week by consolidating finances, health vitals, vehicles, chores, and agriculture into one unified, responsive workspace.',
        iconColor: C.primary
      },
      {
        title: 'Zero Cloud Privacy Exposure',
        desc: 'Sensitive passwords and personal records stay locked inside the client browser. No corporate telemetry, no data monetization, and no external tracking.',
        iconColor: C.accent
      },
      {
        title: 'Bridges Urban & Rural Demographics',
        desc: 'Uniquely designed for both tech professionals and agricultural business owners with specialized crop ROI and cattle management modules.',
        iconColor: C.warning
      },
      {
        title: 'Instant Portfolio & Recruiter Value',
        desc: 'Demonstrates software engineering excellence: clean proxy abstraction, TypeScript type safety, automated testing, and 1-click cloud deployment.',
        iconColor: C.secondary
      }
    ];

    benefits.forEach((b, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 0.8 + (col * 4.3);
      const by = 1.6 + (row * 1.7);

      slide.addShape(pres.ShapeType.roundRect, {
        x: bx, y: by, w: 4.1, h: 1.5,
        fill: { color: C.bgCard },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: bx + 0.2, y: by + 0.18, w: 0.35, h: 0.35,
        fill: { color: C.bgCardLight },
        line: { color: b.iconColor, width: 1 },
        rectRadius: 0.05
      });

      slide.addText('★', {
        x: bx + 0.2, y: by + 0.18, w: 0.35, h: 0.35,
        align: 'center', fontSize: 11, bold: true, color: b.iconColor, fontFace: 'Calibri'
      });

      slide.addText(b.title, {
        x: bx + 0.65, y: by + 0.2, w: 3.25, h: 0.3,
        fontSize: 12, bold: true, color: C.textMain, fontFace: 'Calibri'
      });

      slide.addText(b.desc, {
        x: bx + 0.2, y: by + 0.6, w: 3.7, h: 0.8,
        fontSize: 9.5, color: C.textMuted, fontFace: 'Calibri'
      });
    });
  }

  // =========================================================================
  // SLIDE 12: Future Enhancements & Conclusion
  // =========================================================================
  {
    const slide = pres.addSlide();
    addSlideHeader(
      slide,
      'Roadmap & Wrap-Up',
      'Future Enhancements & Conclusion',
      'Expanding Vynora into a multi-device, offline-synchronized intelligent ecosystem.',
      12
    );

    // Left Column: Future Roadmap
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.6, w: 4.8, h: 3.35,
      fill: { color: C.bgCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('FUTURE DEVELOPMENT ROADMAP', {
      x: 1.05, y: 1.8, w: 4.3, h: 0.25,
      fontSize: 10, bold: true, color: C.primary, fontFace: 'Calibri'
    });

    const roadmap = [
      { goal: 'Native Mobile Apps (iOS & Android)', sub: 'React Native & Capacitor wrapping for offline background push notifications' },
      { goal: 'Peer-to-Peer CRDT Data Sync', sub: 'Multi-device synchronization without centralized database dependencies' },
      { goal: 'Vernacular Multi-Language Audio', sub: 'Regional voice copilot designed specifically for rural agricultural producers' },
      { goal: 'Automated IoT Sensor Telemetry', sub: 'Direct Bluetooth integration with dairy milk meters and soil moisture sensors' }
    ];

    roadmap.forEach((r, idx) => {
      const ry = 2.15 + (idx * 0.68);
      slide.addText(`▸ ${r.goal}`, {
        x: 1.05, y: ry, w: 4.3, h: 0.25,
        fontSize: 10.5, bold: true, color: C.textMain, fontFace: 'Calibri'
      });
      slide.addText(r.sub, {
        x: 1.25, y: ry + 0.22, w: 4.1, h: 0.25,
        fontSize: 8.5, color: C.textMuted, fontFace: 'Calibri'
      });
    });

    // Right Column: Conclusion & Q&A
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.8, y: 1.6, w: 3.4, h: 3.35,
      fill: { color: C.bgCard },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.08
    });

    slide.addText('SUMMARY & CONCLUSION', {
      x: 6.0, y: 1.8, w: 3.0, h: 0.25,
      fontSize: 10, bold: true, color: C.secondary, fontFace: 'Calibri'
    });

    slide.addText('Vynora proves that high-performance web engineering can solve real-world life fragmentation simply, securely, and elegantly.', {
      x: 6.0, y: 2.15, w: 3.0, h: 0.75,
      fontSize: 10, color: C.textMain, fontFace: 'Calibri', italic: true
    });

    slide.addShape(pres.ShapeType.line, {
      x: 6.0, y: 3.05, w: 3.0, h: 0,
      line: { color: C.border, width: 1 }
    });

    slide.addText('Live Demo & Source Code:', {
      x: 6.0, y: 3.2, w: 3.0, h: 0.25,
      fontSize: 9.5, bold: true, color: C.primary, fontFace: 'Calibri'
    });

    slide.addText('• GitHub: github.com/Aravindh2727/Vynora-demo\n• Deployed: Render 1-Click Static CDN\n• Architecture: React 19 + TypeScript + Vite', {
      x: 6.0, y: 3.48, w: 3.0, h: 0.65,
      fontSize: 8.5, color: C.textMuted, fontFace: 'Calibri'
    });

    slide.addText('THANK YOU — QUESTIONS & DISCUSSION', {
      x: 6.0, y: 4.3, w: 3.0, h: 0.35,
      fontSize: 10, bold: true, color: C.accent, fontFace: 'Calibri', align: 'center'
    });
  }

  // Save the PPTX file
  const outputPath = path.resolve(__dirname, 'Project_Presentation.pptx');
  console.log(`💾 Writing PowerPoint file to ${outputPath}...`);
  await pres.writeFile({ fileName: outputPath });
  console.log(`✅ Project_Presentation.pptx generated successfully! (${fs.statSync(outputPath).size} bytes)`);
}

createPresentation().catch(err => {
  console.error('❌ Error generating presentation:', err);
  process.exit(1);
});

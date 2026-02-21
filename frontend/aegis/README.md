# Aegis AI — Stroke Prevention & Recovery Platform

> **AI-Powered Health Monitoring** · From Prevention to Recovery — AI That Has Your Back.

Aegis is a full-stack health platform that helps patients prevent strokes before they happen and supports recovery after one. Patients log their health daily, receive personalised guidance, and an AI continuously monitors their risk. Clinical coordinators manage patient cohorts through a dedicated admin portal.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Internationalisation | Custom `i18` context (English, Yoruba, Hausa, Igbo) |
| Accessibility | `AccessibilityContext` + `AccessibilityBar` + `SpeakButton` |
| Backend | Django REST Framework |
| Database | SQLite (dev), PostgreSQL (prod) |

---

## Project Structure

```
frontend/aegis/src/
├── accessibility/          # AccessibilityContext, types
├── components/
│   ├── admin/              # Admin shared components (RiskBadge, StatCard, …)
│   ├── auth/               # Login, Register, ForgotPassword forms
│   ├── common/             # AccessibilityBar, LanguageSwitcher, PageLoader, RouteLoader
│   ├── home/               # Landing page sections
│   └── patient/            # Patient dashboard layout + sub-components
├── data/                   # mockPatients.ts — shared mock data + mutation helpers
├── hooks/                  # usePatientDetails, useUpdateClinicalRecord, useEmergencyCases
├── i18/                    # LanguageContext, translations (en, yo, ha, ig)
├── pages/
│   ├── admin/              # AdminOverview, PatientList, PatientDetails, UpdateClinicalRecord, EmergencyCases
│   └── patient/            # PatientDashboard, PatientLog, PatientChat, PatientReports,
│                           #   PatientNotifications, PatientSettings
└── utils/
    └── dateUtils.ts        # formatDate, timeAgo
```

---

## Routes

### Public
| Path | Page |
|---|---|
| `/` | Landing page |
| `/auth` | Auth page (register view) |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/auth/forgot-password` | Forgot password |

### Admin Portal (`/admin/*`)
All admin routes are nested under `AdminLayout` — a persistent sidebar, sticky header with breadcrumb, and responsive mobile drawer.

| Path | Page | Description |
|---|---|---|
| `/admin` | Dashboard Overview | Stat cards, recent activity feed, risk distribution chart |
| `/admin/patients` | Patient List | Searchable, filterable, paginated table of all 20 patients |
| `/admin/patients/:uuid` | Patient Details | Full patient profile — vitals, clinical notes, inline edit, caretaker messaging |
| `/admin/patients/update` | Update Clinical Record | UUID lookup → edit vitals, medications, risk level, clinical notes |
| `/admin/emergencies` | Emergency Cases | High-risk patients with quick caretaker notification modal |

### Patient Portal (`/patient/*`)
Each patient route uses a persistent desktop Sidebar, mobile `MobileSidebar` drawer, sticky `TopBar`, and a fixed `BottomNav` for mobile.

| Path | Page | Description |
|---|---|---|
| `/patient/dashboard` | Dashboard | Stats row, risk status card, daily log + chat preview, SOS, reports, notifications |
| `/patient/log` | Daily Log | BP trend chart, tab switcher — today's log, past logs, daily habits |
| `/patient/chat` | AI Chat | Aegis AI health assistant with symptom detection and structured topic cards |
| `/patient/reports` | Health Reports | Stat cards, BP chart, highlights, downloadable report list |
| `/patient/notifications` | Notifications | Filterable notification feed — pinned + regular, mark-read, dismiss |
| `/patient/settings` | Settings | Profile card, account/preference/support sections, logout |

---

## Landing Page Sections

| Section | Content |
|---|---|
| **Hero** | Headline, sub-copy, CTA buttons (Get Started / How It Works) |
| **Stats** | Platform impact numbers (patients monitored, risk reductions, etc.) |
| **PreCare** | Pre-stroke prevention features — daily logging, AI risk assessment |
| **Caretaker** | Caretaker monitoring — real-time alerts, messaging hub |
| **How It Works** | 3-step flow: Sign up → Log daily → Get AI insights |
| **Risk Score** | Visual explainer of Aegis risk scoring model |
| **Escalation Levels** | Stable → Elevated → Critical escalation and notification flow |
| **Features** | Feature grid — AI monitoring, medication tracking, multilingual support |
| **CTA** | Final call to action with register link |
| **Footer** | Links, branding |

---

## Key Features

- **AI Risk Monitoring** — Continuous risk scoring with colour-coded Stable / Elevated / Critical states
- **Daily Health Logging** — Vitals (BP, HR, O₂ Sat), medication adherence, daily habits
- **Caretaker Alerts** — Admin can notify caretakers directly with custom or default messages; full in-app messaging thread
- **Multilingual** — English, Yoruba, Hausa, Igbo via `LanguageContext`
- **Accessibility** — Text-to-speech (`SpeakButton`), accessibility toolbar
- **Mobile-First** — Fully responsive across all routes; bottom navigation on mobile, sidebar on desktop
- **Admin Portal** — UUID-based patient lookup, inline clinical record editing, emergency case management

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check
npx tsc --noEmit
```

Development server runs at **http://localhost:5173** by default.

---

## Mock Data

Patient, caretaker, and notification data lives in `src/data/mockPatients.ts` (20 patients) and `src/components/patient/data/mockData.ts`. In-memory mutation helpers (`updatePatient`, `addCaretakerMessage`) simulate backend writes until the Django REST API is wired up.

# 🛡️ Aegis — Stroke Prevention Patient Dashboard

Aegis is a full-stack health monitoring platform designed to help at-risk patients track, understand, and reduce their stroke risk. It combines a responsive React frontend with a Next.js API backend, a MongoDB database, and an on-device risk scoring engine.

> Built for the Nigerian context — supports **English**, **Yoruba**, **Hausa**, and **Igbo** with culturally adapted translations and accessible design for elderly users.

---

### 🤖 Powered by Google Gemini AI

Aegis integrates **Google Gemini 2.5 Flash** as its AI engine for intelligent, context-aware stroke risk assessment. After each vitals submission, the platform sends the patient's health data — including blood pressure readings, lifestyle factors, medical history, and symptoms — to Gemini, which returns a structured risk score, clinical justification, contributing risk drivers, and personalised stroke prevention recommendations. This AI-driven layer supplements the on-device rule-based engine, enabling nuanced analysis that goes beyond threshold-based scoring.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Internationalisation (i18n)](#internationalisation-i18n)
- [Accessibility](#accessibility)
- [Roles](#roles)
- [Roadmap](#roadmap)

---

## ✨ Features

### Patient Portal
- **Dashboard** — Real-time risk status card, stats row (BP, heart rate, glucose), SOS button, daily log card, notification panel, and an embedded health chatbot
- **Health Log** — Blood pressure trend chart, past vital logs, daily habits tracker (water, sleep, exercise, smoking, alcohol)
- **Reports** — Stat summary cards, BP trend chart, health highlights, paginated report list
- **Notifications** — Filterable notification centre (All / Alerts / Reminders / Tips / Updates) with read/unread and dismiss support
- **AI Health Chat** — Rule-based chatbot covering 15+ health intents (blood pressure, hydration, exercise, sleep, stress, weight, smoking, medications, appointments, and more) with emergency escalation detection
- **Settings** — Profile card with stats, categorised settings rows, logout, app version footer

### Admin Portal
- Dashboard overview with live stats, risk distribution and recent activity feed (powered by `GET /api/admin/dashboard`)
- Patient list with search and pagination
- Per-patient clinical record viewer and editor with real PATCH support
- Emergency cases — SOS alerts with caregiver info, notification log, and **Acknowledge** action
- Risk badge display
- Caretaker notification modal

### Auth
- Cookie-based JWT authentication (access token `1d`, refresh token `7d`)
- Role-based redirect (patient → `/dashboard`, admin → `/portal`)
- Auto-refresh via `POST /api/auth/refresh`
- Hospital selector on registration — patients linked to a clinic at sign-up

### UX
- Animated route loader (arc spinner + bouncing dots) on every page transition
- Logout confirmation modal (used in sidebar, mobile sidebar, and settings)
- TopBar notification dropdown with unread badge
- Fully responsive layout — sidebar on desktop, bottom nav + mobile sidebar on mobile

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4.2 | Utility-first styling |
| React Router | 7 | Client-side routing |
| Vite | 7 | Build tool and dev server |
| Axios | 1.13 | HTTP client (auto-injects auth cookie) |
| js-cookie | 3 | Cookie management |
| Lucide React | 0.575 | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16 | API route server (App Router) |
| TypeScript | 5 | Type safety |
| MongoDB + Mongoose | 8.10 | Database and ODM |
| jose | 5.9 | JWT signing and verification (HS256) |
| bcryptjs | 2.4 | Password hashing |
| Zod | 3.24 | Request validation |
| Nodemailer | 6.9 | Email notifications |
| Google Gemini 2.5 Flash | — | AI-powered stroke risk scoring and clinical recommendations |

---

## 📁 Project Structure

```
team-plugins/
├── README.md
├── aegis-backend/                        # Next.js API server
│   ├── next.config.ts
│   ├── package.json
│   └── src/
│       ├── lib/
│       │   ├── auth.ts                   # signAccessToken, signRefreshToken, verify*
│       │   ├── db.ts                     # Mongoose connection with hot-reload cache
│       │   ├── middleware.ts             # requireAuth(), requireAdmin() helpers
│       │   ├── riskCalculator.ts         # Score engine (BP + adherence + risk factors)
│       │   ├── emergencyStore.ts         # In-memory SOS store (globalThis, survives hot-reload)
│       │   └── response.ts              # Typed JSON response helpers
│       ├── models/
│       │   ├── User.model.ts
│       │   ├── Patient.model.ts
│       │   ├── Admin.model.ts
│       │   ├── Hospital.model.ts
│       │   ├── VitalLog.model.ts
│       │   ├── RiskScore.model.ts
│       │   ├── Medication.model.ts
│       │   ├── DoseLog.model.ts
│       │   └── Notification.model.ts
│       ├── schemas/                      # Zod validation schemas
│       │   ├── auth.schema.ts
│       │   ├── admin.schema.ts
│       │   ├── vitals.schema.ts
│       │   └── medication.schema.ts
│       └── app/api/
│           ├── auth/
│           │   ├── register/route.ts     # POST — create patient account
│           │   ├── login/route.ts        # POST — returns access + refresh tokens
│           │   ├── logout/route.ts       # POST — clears cookies
│           │   ├── refresh/route.ts      # POST — rotates access token
│           │   └── me/route.ts           # GET  — returns full user profile
│           ├── hospitals/route.ts        # GET  — list all hospitals (public)
│           ├── patient/
│           │   ├── overview/route.ts     # GET  — patient dashboard data
│           │   └── profile/route.ts      # GET/PATCH — patient profile
│           ├── vitals/
│           │   ├── route.ts              # POST — submit vitals + trigger risk score
│           │   └── latest/route.ts       # GET  — most recent vital log
│           ├── risk/route.ts             # GET  — patient risk history
│           ├── medications/…             # GET, POST, PATCH medication routes
│           ├── notifications/…           # GET, PATCH notification routes
│           ├── emergency/
│           │   ├── trigger/route.ts      # POST — patient SOS trigger
│           │   └── [id]/
│           │       ├── route.ts          # GET  — full emergency record
│           │       └── acknowledge/route.ts  # POST — admin acknowledge
│           └── admin/
│               ├── register/route.ts     # POST — create admin account
│               ├── dashboard/route.ts    # GET  — overview stats + activity feed
│               ├── patients/
│               │   ├── route.ts          # GET  — paginated patient list (?search, ?page, ?limit)
│               │   └── [id]/route.ts     # GET/PATCH — patient detail + update
│               └── me/route.ts           # GET  — admin profile
└── frontend/
    └── aegis/
        ├── index.html
        ├── vite.config.ts
        ├── package.json
        └── src/
            ├── main.tsx                  # App entry — wraps providers
            ├── App.tsx                   # Routes + ProtectedRoute + RouteLoader
            ├── api/
            │   ├── client.ts             # Axios instance — auto-injects Bearer token
            │   ├── authService.ts        # login, register, fetchMe, fetchHospitals, seedAdmin
            │   ├── patientService.ts     # fetchPatients, fetchPatient, patchPatient, fetchDashboard
            │   └── emergencyService.ts   # fetchEmergencies, fetchEmergency, acknowledgeEmergency
            ├── types/
            │   ├── auth.types.ts         # AuthUser, Hospital, RegisterPayload
            │   ├── patient.types.ts      # ApiPatient, PatchPatientPayload, ApiPatientListResponse
            │   ├── emergency.types.ts    # EmergencyRecord, EmergencyStatus, EmergencyNotification
            │   └── dashboard.types.ts    # DashboardData, RecentActivityItem, RiskDistribution
            ├── context/
            │   └── AuthContext.tsx       # useAuth() — user, syncUser(), logout()
            ├── accessibility/
            │   ├── AccessibilityContext.tsx
            │   └── accessibilityTypes.ts
            ├── i18n/
            │   ├── LanguageContext.tsx
            │   ├── languages.ts
            │   ├── index.ts              # t(key, locale) helper
            │   └── translations/
            │       ├── en.ts
            │       ├── yo.ts             # Yoruba
            │       ├── ha.ts             # Hausa
            │       └── ig.ts             # Igbo
            ├── components/
            │   ├── admin/
            │   ├── auth/                 # LoginForm, RegisterForm (with hospital select), LogoutModal
            │   ├── common/               # PageLoader, RouteLoader, AccessibilityBar, LanguageSwitcher
            │   ├── home/
            │   ├── patient/
            │   │   ├── chat/
            │   │   ├── dashboard/
            │   │   ├── layout/           # Sidebar, MobileSidebar, TopBar, BottomNav
            │   │   ├── log/
            │   │   ├── notifications/
            │   │   └── reports/
            │   └── shared/
            ├── hooks/
            │   ├── useEmergencyCases.ts  # Real API, 30s polling, acknowledge handler
            │   ├── usePatientDetails.ts  # fetchPatient + patchPatient
            │   └── useUpdateClinicalRecord.ts
            ├── pages/
            │   ├── Home.tsx
            │   ├── admin/
            │   │   ├── AdminOverview.tsx       # Live dashboard stats
            │   │   ├── PatientList.tsx
            │   │   ├── PatientDetails.tsx
            │   │   ├── EmergencyCases.tsx      # SOS alerts + acknowledge
            │   │   └── UpdateClinicalRecord.tsx
            │   ├── auth/
            │   └── patient/
            │       ├── PatientDashboard.tsx
            │       ├── PatientLog.tsx
            │       ├── PatientNotifications.tsx
            │       ├── PatientReports.tsx
            │       ├── PatientChat.tsx
            │       ├── PatientSettings.tsx
            │       └── chat/chatLogic.ts       # Rule-based intent engine
            └── utils/
                └── dateUtils.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### Backend Setup

```bash
# 1. Navigate to the backend folder
cd aegis-backend

# 2. Install dependencies
npm install

# 3. Create a .env.local file (see Environment Variables section)
cp .env.example .env.local      # or create manually

# 4. Start the development server
npm run dev
```

The API will be available at `http://localhost:3000`.

---

### Frontend Setup

```bash
# 1. Navigate to the frontend folder
cd frontend/aegis

# 2. Install dependencies
npm install

# 3. Create a .env file
cp .env.example .env            # or create manually

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Backend — `aegis-backend/.env.local`

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_ACCESS_SECRET` | ✅ | Secret for signing access tokens (HS256) |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens (HS256) |
| `NODEMAILER_USER` | Optional | Gmail address for outbound notifications |
| `NODEMAILER_PASS` | Optional | Gmail app password |

### Frontend — `frontend/aegis/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Base URL of the Next.js API, e.g. `http://localhost:3000` |

---

## 📡 API Reference

All protected endpoints require the `aegis-token` cookie (set automatically on login) or an `Authorization: Bearer <token>` header. Admin-only endpoints additionally require `role: admin` in the token payload.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new patient account |
| `POST` | `/api/auth/login` | Public | Log in — sets `aegis-token` + `aegis-refresh` cookies |
| `POST` | `/api/auth/logout` | Public | Clears auth cookies |
| `POST` | `/api/auth/refresh` | 🍪 Refresh token | Rotates access token |
| `GET` | `/api/auth/me` | 🔒 Token | Returns full user profile |
| `GET` | `/hospitals` | Public | List all registered hospitals |

#### `POST /api/auth/register`

```json
{
  "firstName": "Amara",
  "lastName": "Obi",
  "email": "amara@example.com",
  "password": "SecurePass123",
  "phoneNumber": "08012345678",
  "gender": "Female",
  "dateOfBirth": "1970-05-15",
  "hospitalId": "<hospital-object-id>"
}
```

#### `POST /api/auth/login`

```json
{
  "email": "amara@example.com",
  "password": "SecurePass123"
}
```

---

### Patient

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/patient/overview` | 🔒 Patient | Patient dashboard data (risk, vitals, meds) |
| `GET` | `/api/patient/profile` | 🔒 Patient | Patient profile |
| `PATCH` | `/api/patient/profile` | 🔒 Patient | Update patient profile |
| `POST` | `/api/vitals` | 🔒 Patient | Submit vitals — triggers risk score calculation |
| `GET` | `/api/vitals/latest` | 🔒 Patient | Most recent vital log |
| `GET` | `/api/risk` | 🔒 Patient | Risk score history |

---

### Emergency

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/emergency/trigger` | 🔒 Patient | Trigger an SOS — auto-notifies caregiver + clinic |
| `GET` | `/api/emergency/:id` | 🔒 Patient | Full emergency record including notification log |
| `POST` | `/api/emergency/:id/acknowledge` | 🔒 Admin | Mark emergency as ACKNOWLEDGED |

> The backend resolves the patient's `caregiverName` and linked `hospitalId → Hospital.name` automatically. If neither is set the SOS still records and returns a `message` warning.

---

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/admin/register` | Public* | Create an admin account |
| `GET` | `/api/admin/me` | 🔒 Admin | Admin profile |
| `GET` | `/api/admin/dashboard` | 🔒 Admin | Stats, risk distribution, recent activity, open emergencies |
| `GET` | `/api/admin/patients` | 🔒 Admin | Paginated patient list (`?search`, `?page`, `?limit`) |
| `GET` | `/api/admin/patients/:id` | 🔒 Admin | Full patient profile |
| `PATCH` | `/api/admin/patients/:id` | 🔒 Admin | Update patient record |

> \* **Admin accounts are provisioned exclusively by the Aegis platform team.** Hospitals and clinicians are onboarded manually — there is no public-facing admin registration page. Once an admin account has been created and linked to a hospital, the clinician can log in through the standard login page and immediately access their hospital's patient records, emergency alerts, and dashboard. This ensures that only verified, authorised healthcare institutions are granted administrative access to patient data.

#### `GET /api/admin/dashboard` — response shape

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalPatients": 24,
      "highRiskCases": 5,
      "logsToday": 8,
      "activeCaretakers": 17
    },
    "riskDistribution": { "high": 5, "elevated": 9, "stable": 10, "total": 24 },
    "recentActivity": [
      {
        "logId": "…",
        "patientId": "…",
        "fullName": "John Doe",
        "riskLevel": "HIGH",
        "systolic": 178,
        "diastolic": 110,
        "heartRate": 92,
        "symptoms": ["dizziness", "headache"],
        "loggedAt": "2026-02-22T13:45:00.000Z"
      }
    ],
    "openEmergencies": 2
  }
}
```

---

## 🌍 Internationalisation (i18n)

Aegis supports four languages out of the box:

| Code | Language | Script |
|---|---|---|
| `en` | English | Latin |
| `yo` | Yoruba | Latin |
| `ha` | Hausa | Latin |
| `ig` | Igbo | Latin |

The selected language is persisted to `localStorage` under the key `aegis-locale`.

### How it works

```
src/i18n/
├── languages.ts          # Locale codes + display names + flags
├── LanguageContext.tsx   # React context + useLanguage() hook
├── index.ts              # t(key, locale) helper function
└── translations/
    ├── en.ts
    ├── yo.ts
    ├── ha.ts
    └── ig.ts
```

**Usage in a component:**

```tsx
import { useLanguage } from '@/i18n/LanguageContext';
import { t } from '@/i18n';

const MyComponent = () => {
  const { locale } = useLanguage();
  return <h1>{t('dashboard.greeting', locale)}</h1>;
};
```

The `<LanguageSwitcher />` and `<AccessibilityBar />` components provide the user-facing UI for switching languages.

---

## ♿ Accessibility

Aegis includes built-in accessibility features aimed at elderly and low-literacy users:

### Large Text Mode
Toggling the **A+** button adds the `.text-lg-mode` class to the `<html>` element, which bumps base font sizes across the entire app. The preference is saved to `localStorage` under `aegis-textsize`.

### Text-to-Speech (TTS)
Powered by the browser's native **Web Speech API** — no external service or API key required.

- The `<SpeakButton />` component can be placed next to any health message or stat to read it aloud
- The `speak(text)` function is available globally via the `useAccessibility()` hook
- An animated speaking indicator appears in the `<AccessibilityBar />` while audio is playing

### Accessibility Bar
The `<AccessibilityBar />` component (shown in `<TopBar />`) combines:
- Language switcher dropdown (with flag + native language name)
- Text size toggle (A / A+)
- Live speaking indicator

---

## 👤 Roles

| Role | Access |
|---|---|
| **Patient** | Register, log in, view dashboard, submit vitals, view history and reports, trigger SOS, chat with health bot, manage settings |
| **Admin / Clinician** | Live dashboard stats, all patient records, emergency SOS management (view + acknowledge), update clinical records, notify caretakers |

> **Note on Admin Access:** Admin accounts are not self-service. Hospitals and clinicians are onboarded directly by the Aegis platform team — the registration flow exposed to the public is for patients only. Once an institution has been added to the system and their admin account is created, the assigned clinician logs in via the standard login page and gains full access to their hospital's patient data. This controlled onboarding model ensures that administrative access is limited strictly to verified healthcare providers.

Route protection is handled on the frontend via `ProtectedRoute` — reads the `role` field from the `aegis-user` cookie and redirects accordingly after login.

---

## 🗺️ Roadmap

- [x] Patient registration & login (JWT, cookie-based)
- [x] Hospital selector on registration
- [x] Patient dashboard with real-time risk status
- [x] Vitals submission + on-device risk score engine
- [x] Vital sign history
- [x] Admin dashboard with live stats + risk distribution
- [x] Admin patient list, detail view, and clinical record editor
- [x] Emergency SOS — trigger, notify, acknowledge
- [x] Rule-based health chatbot (15+ intents)
- [x] Notification centre
- [x] Health reports
- [x] i18n (English, Yoruba, Hausa, Igbo)
- [x] Accessibility (large text + TTS)
- [ ] Push notifications
- [ ] PDF report export
- [ ] Medication tracker
- [ ] Offline support (PWA)
- [ ] Caretaker portal

---

## 📄 License

This project was built as a hackathon submission. All rights reserved by the team.

# 🛡️ Aegis — Stroke Prevention Patient Dashboard

Aegis is a full-stack health monitoring platform designed to help at-risk patients track, understand, and reduce their stroke risk. It combines a responsive React frontend with a Django REST backend and an AI-powered vital-sign analysis engine.

> Built for the Nigerian context — supports **English**, **Yoruba**, **Hausa**, and **Igbo** with culturally adapted translations and accessible design for elderly users.

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
- Patient list and search
- Emergency cases dashboard
- Per-patient clinical record viewer and editor
- Risk badge display
- Caretaker notification modal

### Auth
- Register and login with DRF Token authentication
- Role-based redirect (patient → `/patient/dashboard`, admin → `/admin`)
- Persistent session via `localStorage`

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
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 4.2 | Utility-first styling |
| React Router | 7 | Client-side routing |
| Vite | 7 | Build tool and dev server |
| Lucide React | 0.575 | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Django | 6.0 | Web framework |
| Django REST Framework | 3.16 | REST API |
| DRF Token Auth | built-in | API authentication |
| Google Generative AI | 0.8.6 | Gemini vitals analysis |
| APScheduler | 3.11 | Background task scheduling |
| WhiteNoise | 6.11 | Static file serving |
| Gunicorn | 25.1 | Production WSGI server |
| dj-database-url | 3.1 | Database URL parsing |

---

## 📁 Project Structure

```
team-plugins/
├── README.md
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── render.yaml                  # Render deployment config
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py                  # Root URL conf
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── apps/
│       ├── patients/                # Auth, registration, patient profile
│       │   ├── models.py            # User + Patient models
│       │   ├── serializers.py
│       │   ├── views.py             # Register, Login, Dashboard
│       │   └── urls.py
│       └── medical/                 # Vitals, AI analysis, admin view
│           ├── models.py            # MedicalRecord, VitalSignLog
│           ├── serializers.py
│           ├── views.py             # PredictHealthOutcome, VitalHistory, AdminDetail
│           ├── scheduler.py         # APScheduler periodic tasks
│           └── urls.py
└── frontend/
    └── aegis/
        ├── index.html
        ├── vite.config.ts
        ├── package.json
        └── src/
            ├── main.tsx             # App entry — wraps providers
            ├── App.tsx              # Routes + RouteLoader
            ├── accessibility/
            │   ├── AccessibilityContext.tsx   # Text size + TTS
            │   └── accessibilityTypes.ts
            ├── i18n/
            │   ├── LanguageContext.tsx
            │   ├── languages.ts
            │   ├── index.ts                   # t() helper
            │   └── translations/
            │       ├── en.ts
            │       ├── yo.ts                  # Yoruba
            │       ├── ha.ts                  # Hausa
            │       └── ig.ts                  # Igbo
            ├── components/
            │   ├── admin/           # Admin UI components
            │   ├── auth/            # LoginForm, RegisterForm, ForgotPasswordForm, LogoutModal
            │   ├── common/          # PageLoader, RouteLoader, AccessibilityBar, LanguageSwitcher, SpeakButton
            │   ├── home/            # Landing page sections
            │   ├── patient/
            │   │   ├── chat/        # ChatWindow, ChatInput, SafetyAlert, TopicCards, ChatHistoryV2
            │   │   ├── dashboard/   # RiskStatusCard, StatsRow, SOSButton, NotificationPanel, etc.
            │   │   ├── layout/      # Sidebar, MobileSidebar, TopBar, BottomNav
            │   │   ├── log/         # BPTrendChart, PastLogsTab, DailyHabitsTab
            │   │   ├── notifications/ # NotifCard, NotifFilters, NotifEmptyState, notifTypes.ts
            │   │   └── reports/     # ReportStatCards, ReportBPChart, ReportHighlights, ReportList
            │   └── shared/          # InputField, BPSparkline, PasswordStrength, SectionHeading
            ├── hooks/               # useEmergencyCases, usePatientDetails, useUpdateClinicalRecord
            ├── pages/
            │   ├── Home.tsx
            │   ├── admin/           # AdminOverview, PatientList, PatientDetails, EmergencyCases, UpdateClinicalRecord
            │   ├── auth/            # AuthPage
            │   └── patient/
            │       ├── PatientDashboard.tsx
            │       ├── PatientLog.tsx
            │       ├── PatientNotifications.tsx
            │       ├── PatientReports.tsx
            │       ├── PatientChat.tsx
            │       ├── PatientSettings.tsx
            │       └── chat/
            │           └── chatLogic.ts       # Rule-based intent engine
            └── utils/
                └── dateUtils.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

---

### Backend Setup

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create a .env file (see Environment Variables section)
cp .env.example .env            # or create manually

# 5. Run migrations
python manage.py migrate

# 6. Create a superuser (for admin access)
python manage.py createsuperuser

# 7. Start the development server
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

Interactive API docs (Swagger UI) are available at `http://localhost:8000/api/docs/`.

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

### Backend — `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | ✅ | Django secret key |
| `DEBUG` | ✅ | `True` for development, `False` for production |
| `DATABASE_URL` | Optional | Database URL (defaults to SQLite if not set) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key for AI health analysis |
| `ALLOWED_HOSTS` | Optional | Comma-separated list of allowed hosts |

### Frontend — `frontend/aegis/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Base URL of the Django API, e.g. `http://localhost:8000` |

---

## 📡 API Reference

All endpoints are prefixed as shown. Authentication uses the DRF `Token` scheme — include `Authorization: Token <your-token>` in the request header for protected routes.

### Auth & Patient

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/register/` | Public | Register a new patient account |
| `POST` | `/api/login/` | Public | Log in and receive an auth token |
| `GET` | `/api/dashboard/` | 🔒 Token | Get the authenticated patient's profile |

#### `POST /api/register/`

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1970-05-15",
  "gender": "M",
  "phone_number": "08012345678",
  "address": "12 Example Street, Lagos"
}
```

**Response `201`:**
```json
{
  "message": "Patient registered successfully",
  "token": "abc123tokenhere"
}
```

#### `POST /api/login/`

```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response `200`:**
```json
{
  "message": "Login successful",
  "token": "abc123tokenhere"
}
```

---

### Medical / Vitals

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/medical/submit-vitals/` | 🔒 Token | Submit vitals + receive AI health analysis |
| `GET` | `/api/medical/history/` | 🔒 Token | Get the patient's vital sign history |
| `GET` | `/api/admin/patients/<id>/` | 🔒 Admin | Get full patient detail (admin only) |

#### `POST /api/medical/submit-vitals/`

```json
{
  "systolic_bp": 140,
  "diastolic_bp": 90,
  "heart_rate": 78,
  "blood_glucose": 6.2,
  "weight_kg": 82.5,
  "notes": "Felt slightly dizzy in the morning"
}
```

**Response `200`:** Returns the saved vital log plus an AI-generated stroke risk analysis and prevention recommendations.

---

### API Documentation

Swagger UI is served at `/api/docs/` when the server is running. The raw OpenAPI schema is at `/api/schema/`.

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
| **Patient** | Register, log in, view dashboard, submit vitals, view history and reports, chat with health bot, manage settings |
| **Admin / Clinician** | All patient data, emergency cases, update clinical records, notify caretakers |

Route protection is handled on the frontend by reading the user role from `localStorage` and redirecting accordingly after login.

---

## 🗺️ Roadmap

- [x] Patient registration & login
- [x] Patient dashboard with risk status
- [x] Vitals submission + AI analysis (Gemini)
- [x] Vital sign history
- [x] Admin patient management
- [x] Rule-based health chatbot (15+ intents)
- [x] Notification centre
- [x] Health reports
- [x] i18n (English, Yoruba, Hausa, Igbo)
- [x] Accessibility (large text + TTS)
- [x] Swagger API docs
- [ ] Push notifications
- [ ] PDF report export
- [ ] Medication tracker
- [ ] Offline support (PWA)
- [ ] Caretaker portal

---

## 📄 License

This project was built as a hackathon submission. All rights reserved by the team.

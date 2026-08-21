# STORM (Situational Tracking and Operational Response Management)

STORM is an advanced, real-time disaster coordination platform designed to transform chaotic field signals, multi-sensor telemetry, and emergency reports into a unified, actionable operational picture.

By replacing fragmented paper trails and manual phone trees with a centralized **Socket.IO-powered real-time event pipeline** and **two-way Twilio SMS dispatch loop**, STORM accelerates crisis response. It integrates live global telemetry, AI-assisted dispatch planning (via Google Gemini), strict officer-in-the-loop governance, and closed-loop ground unit verification.

> **The Core Operational Loop:**  
> **Sense** (Live USGS & Weather Telemetry) ➔ **Reason** (AI Spatial Optimization) ➔ **Human Review** (Officer JWT Authorization) ➔ **Act** (Resource Binding & Team Lead SMS Briefing) ➔ **Respond** (Two-Way Status Confirmation) ➔ **Broadcast** (Real-Time Synchronized Dashboard)

---

## 🌟 Key Features

### 📡 1. Live Global Data Telemetry & Detected Disaster Regions
STORM continuously ingests live telemetry across global and regional sensor streams:
- **USGS Real-Time Seismic Feed:** Polled every 30 seconds for South Asian earthquake anomalies, translating magnitudes into calibrated severity zones.
- **Open-Meteo Weather Streams:** Actively monitors multi-city precipitation and extreme temperature data to trigger storm and heatwave alerts.
- **Sense Layer "Detected Disaster Regions" Panel:** Dedicated interactive panel on `/sense` listing all live detected anomalies with severity badges and population estimates. Clicking any region smoothly centers and zooms the Leaflet map to the incident coordinates.

### 🧠 2. The Reason Layer (AI Spatial Optimization)
When a live disaster is detected, STORM connects to the **Google Gemini Engine** to draft tactical deployment recommendations. The AI evaluates incident severity against available NDRF and medical resources to provide an optimized dispatch plan with confidence scores and ETAs.
- **Live Zone Telemetry Binding:** Dropdowns are dynamically populated exclusively from active telemetry zones.

### 🛡️ 3. Secure Human Governance & Auth
STORM enforces strict operational security:
- **JWT Session Tokens:** Generated on `POST /api/login` and validated on every stateful socket action (`approve_recommendation`, `reject_recommendation`, `bind_resource`).
- **Cryptographic Password Hashing:** Officer credentials are secured with `bcrypt` password hashing.
- **Protected Routing:** Operational modules (Dashboard, Reason, Resources, Sense, Report) require authenticated officer sessions.

### 📲 4. Two-Way Twilio SMS Notification Loop
STORM closes the communication loop between command officers and field units:
1. **Officer Deploys Unit:** On binding a resource to a zone, an SMS is automatically dispatched to the team lead with a single-use tokenized link (`${APP_URL}/respond/${token}`).
2. **Team Lead Responds:** The public `/respond/:token` route displays the mission briefing and allows the team lead to submit status (**Completed** or **Incomplete**) with ground notes.
3. **Officer Notified:** On submission, the deployment status is saved to SQLite, a confirmation SMS is routed back to the deploying officer, and the Dashboard is updated live.

### 🚨 5. Automated Critical-Severity Sentry
When any monitored zone reaches a severity score $\ge 8$ for the first time:
- Automatically sends an urgent SMS alert to all registered duty officers.
- Emits a real-time `notification_broadcast` to active browser sessions with an in-app banner.
- Deduplicates repeated alerts via SQLite `critical_alerts` tracking.

### 📝 6. Field Hazard Intake & Observer Identification
- Lightweight observer identification (Name + Phone) in `/report`.
- Submitted ground reports are validated and saved directly to the SQLite `field_reports` table via `POST /api/reports`.
- Working local file attachment preview with metadata inspection.

### 🏢 7. Pilot Deployment Inquiries
- Prospective state disaster management authorities (SDMAs) and NDRF cells can submit deployment inquiries directly via `/about#contact`, persisted to the SQLite `inquiries` table.

---

## 🛠️ Technology Stack

**Frontend Architecture:**
- **React 18** (Vite 6 Build System)
- **Tailwind CSS 4** (Custom dark-mode command center aesthetics)
- **React Router 6** (Protected nested routing + public `/respond/:token` route)
- **Leaflet & React-Leaflet** (Geospatial mapping and smooth fly-to controls)
- **Socket.IO-Client** (Real-time bidirectional state synchronization)
- **Lucide React** (Tactical iconography)

**Backend Architecture:**
- **Node.js + Express 5**
- **Socket.IO** (Websocket broadcasting)
- **Better-SQLite3** (High-performance synchronous SQLite persistence with WAL mode)
- **Bcrypt & JSONWebToken** (Authentication & Socket authorization guards)
- **Twilio SDK** (Two-way SMS dispatch with simulated console logging fallback)
- **Google GenAI SDK** (Gemini LLM dispatch optimization)
- **Axios** (Live USGS & Open-Meteo telemetry polling)

---

## 📂 Repository Layout

```text
STORM/
├── server/
│   ├── index.js               # Express Server, Socket.IO, Twilio SMS, USGS/Open-Meteo Polling
│   ├── db.js                  # SQLite Schema, Deployments, Inquiries, Officers, Field Reports
│   ├── package.json           # Backend dependencies
│   └── .env                   # API Keys (Gemini, Twilio, JWT Secret, App URL)
├── src/
│   ├── App.jsx                # Global Router, Layout, & Route Registrations
│   ├── context/
│   │   └── AppContext.jsx     # Global Authentication State & Session Management
│   ├── components/            
│   │   ├── Navbar.jsx         # Header Navigation & Officer Profile/Login Controls
│   │   ├── OfficialLoginModal.jsx # Authenticated Command Login Modal
│   │   ├── ProtectedRoute.jsx # Client-Side Route Protection Guard
│   │   └── Footer.jsx         # Footer Component
│   ├── pages/                 
│   │   ├── Dashboard.jsx      # Command Center with Real-Time Payload Validation & Sentry Banner
│   │   ├── Reason.jsx         # AI Dispatch Planning with Live Telemetry Dropdown
│   │   ├── Resources.jsx      # Resource Match & Deploy with Team Lead Briefing
│   │   ├── Sense.jsx          # Detected Disaster Regions Panel & Leaflet Geospatial Map
│   │   ├── Report.jsx         # Field Observer Intake & SQLite Persistence
│   │   ├── Respond.jsx        # Public Two-Way Team Lead Status Response Route (/respond/:token)
│   │   ├── About.jsx          # Platform Roadmap & SDMA Pilot Inquiry Intake
│   │   ├── HowItWorks.jsx     # Technical Architecture & Pipeline Breakdown
│   │   └── Home.jsx           # Public Mission Landing Page
│   ├── index.css              # Custom Design System, Glow Arcs, & Component Tokens
│   └── data/                  
│       └── mockData.js        # Reference Case Studies and Data Sources
├── index.html                 # Vite HTML entry
└── vite.config.js             # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- (Optional) **Google Gemini API Key** for LLM dispatch recommendations
- (Optional) **Twilio Account** for live SMS dispatches (system runs in simulated SMS mode by default)

### 1. Backend Setup
```bash
cd server
npm install
```

Configure your environment variables in `server/.env` (see `.env.example`):
```env
PORT=3001
VITE_API_URL=http://localhost:3001
APP_URL=http://localhost:3000
JWT_SECRET=storm_production_jwt_secret_key_change_in_prod

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Twilio SMS (Optional - falls back to simulated console logs if not configured)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+15005550006
```

Start the backend server:
```bash
node index.js
```
*(The backend automatically creates `storm.db`, executes migrations, seeds demo officers and resources with contact details, and begins live 30-second telemetry polling).*

### 2. Frontend Setup
In a new terminal window at the project root:
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000`.

---

## 🔑 Demo Officer Accounts

Use any of the following pre-seeded credentials to log in:

| Officer ID | Password | Rank | Contact Phone |
|---|---|---|---|
| `OFF-101` | `officer101` | SDMA Relief Commissioner | `+919876543210` |
| `OFF-102` | `officer102` | NDMA Operations Chief | `+919876543211` |
| `OFF-103` | `officer103` | NDRF Sector Commander | `+919876543212` |

---

## ⚙️ Data Flow & Architecture

1. **Telemetry Ingestion:** `server/index.js` polls USGS earthquake GeoJSON feeds and Open-Meteo multi-city weather streams every 30 seconds, generating dynamic `zones`.
2. **State Broadcast:** On polling cycles, incident submissions, or officer actions, the backend invokes `broadcastState()`, transmitting `{ zones, pendingRecommendations, approvedRecommendations, activityLog, resources }` via Socket.IO.
3. **Two-Way Notification:**
   - Resource binding generates a unique 32-character hexadecimal token in the `deployments` table.
   - Twilio SMS dispatches `${APP_URL}/respond/<token>` to the unit team lead.
   - The team lead submits mission status at `/respond/<token>`, triggering confirmation SMS back to the officer and updating the Dashboard.
4. **Critical Alert Sentry:** When any zone reaches severity $\ge 8$, an automated emergency SMS alert is sent to all registered officers and deduplicated in the database.

---

## 🛑 Production Deployment Guidelines

- **Environment Secrets:** Store `JWT_SECRET`, `GEMINI_API_KEY`, and Twilio credentials in a secure key vault (e.g. AWS Secrets Manager or GCP Secret Manager).
- **Domain Whitelisting:** Update `APP_URL` and Socket.IO CORS configuration to point to production domain URLs.
- **Storage Buckets:** Connect AWS S3 or GCP Cloud Storage for binary file uploads in field reporting.
- **Horizontal Scaling:** For multi-instance load balancing, connect Redis as a Socket.IO adapter and migrate SQLite to PostgreSQL.

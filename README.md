# STORM (Situational Tracking and Operational Response Management)

STORM is an advanced, real-time disaster coordination prototype designed to transform chaotic field signals and public data into a unified, actionable operational picture. 

By replacing fragmented paper trails and manual phone trees with a centralized **Socket.IO-powered real-time event pipeline**, STORM accelerates crisis response. It integrates live global telemetry, AI-assisted dispatch planning (via Google Gemini), and a strict human-in-the-loop governance model.

> **The Core Operational Loop:**
> **Sense** (Live API Ingestion) ➔ **Reason** (AI Spatial Optimization) ➔ **Human Review** (Officer Authentication) ➔ **Act** (Resource Deployment) ➔ **Communicate** (Real-time Broadcast)

---

## 🌟 Key Features

### 📡 1. Live Global Data Telemetry
STORM no longer relies on mock datasets. The backend engine continuously polls live, open-source APIs to generate incidents dynamically:
- **USGS Earthquake Feed:** Polls globally every 30 seconds, automatically flagging seismic events within South Asia and translating magnitudes into severity zones.
- **Open-Meteo Weather Integration:** Monitors major Indian coordinates (Delhi, Mumbai, Chennai, Guwahati). Automatically triggers `Extreme Heatwave` or `Severe Flooding` incident zones based on real-time precipitation and temperature thresholds.

### 🧠 2. The Reason Layer (AI Spatial Optimization)
When a live disaster is detected, STORM connects to the **Google Gemini Engine** to instantly draft a deployment recommendation. The AI evaluates incident severity against available NDRF and medical resources to provide an optimized dispatch plan, complete with confidence scores and ETAs.

### 🛡️ 3. Secure Human Governance & Auth
STORM enforces strict operational security. The prototype features a fully global, JWT-backed authentication flow:
- **Protected Routing:** Operational modules (Dashboard, Reason, Resources, Sense) are inaccessible without a valid officer session.
- **Bcrypt & JWT:** Officer credentials are cryptographically hashed via `bcrypt`, and sessions are maintained via signed JSON Web Tokens (JWT).
- **Audit Trails:** No AI recommendation is executed without an authenticated officer authorizing the dispatch.

### 🔄 4. Real-Time Resource & Field Sync
Using **Socket.IO**, the platform synchronizes state instantly across all connected terminals:
- **End-to-End Field Reports:** Ground observers can submit reports via the `/report` intake portal. These are persisted to the SQLite database and instantly broadcasted to all coordinator dashboards.
- **Resource Binding:** When a medical team or NDRF boat unit is assigned to a zone, global inventory counts update immediately across the network.

---

## 🛠️ Technology Stack

**Frontend Architecture:**
- **React 18** (Vite 6 Build System)
- **Tailwind CSS 4** (Utility-first styling, custom dark-mode disaster aesthetics)
- **React Router 6** (Protected nested routing)
- **Leaflet & React-Leaflet** (Geospatial mapping)
- **Socket.IO-Client** (Real-time bi-directional event syncing)

**Backend Architecture:**
- **Node.js + Express 5**
- **Socket.IO** (Websocket broadcasting)
- **Better-SQLite3** (High-performance, synchronous SQLite persistence)
- **Bcrypt & JSONWebToken** (Security & Auth)
- **Google GenAI SDK** (Gemini LLM integration)
- **Axios** (Live data polling)

---

## 📂 Repository Layout

```text
STORM/
├── server/
│   ├── index.js               # Express Server, Socket.IO config, Live Polling (USGS/Open-Meteo)
│   ├── db.js                  # SQLite Schema, Data persistence, Seed generation, Auth logic
│   ├── package.json           # Backend dependencies
│   └── .env                   # API Keys (Gemini, JWT Secret, Port config)
├── src/
│   ├── App.jsx                # Global Router & ProtectedRoute wrappers
│   ├── components/            # Reusable UI (Navbar, Footer, ProtectedRoute, etc.)
│   ├── pages/                 
│   │   ├── Dashboard.jsx      # Command Center (Listens to live socket updates)
│   │   ├── Reason.jsx         # AI Dispatch planning interface
│   │   ├── Resources.jsx      # Asset inventory and deployment portal
│   │   ├── Sense.jsx          # Geospatial Map visualization
│   │   ├── Report.jsx         # Ground intelligence intake form
│   │   ├── Login.jsx          # JWT Authentication portal
│   │   └── Home.jsx           # Public-facing mission landing page
│   └── data/                  
│       └── mockData.js        # Deprecated/Trimmed static assets (Case studies)
├── index.html                 # Vite HTML entry
├── vite.config.js             # Vite configuration
└── tailwind.config.js         # Tailwind configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A **Google Gemini API Key** (Required for the AI Reason layer)

### 1. Backend Setup
```bash
cd server
npm install
```
Create an `.env` file in the `server/` directory:
```env
PORT=3001
VITE_API_URL=http://localhost:3001
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=super_secret_jwt_key_change_in_production
```
Start the backend engine:
```bash
node index.js
```
*(The backend will automatically create the `storm.db` SQLite database, seed initial NDRF resources and Officer accounts, and immediately begin polling live data feeds).*

### 2. Frontend Setup
Open a new terminal window at the project root:
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000`.

---

## 🔑 Demo Officer Accounts

To access the operational dashboard and authorize AI deployments, you must log in. The database is seeded with the following securely hashed demo accounts:

| Officer ID | Password | Rank |
|---|---|---|
| `OFF-101` | `officer101` | SDMA Relief Commissioner |
| `OFF-102` | `officer102` | NDMA Operations Chief |
| `OFF-103` | `officer103` | NDRF Sector Commander |

---

## ⚙️ Data Flow & Architecture Notes

1. **The Polling Engine:** `server/index.js` runs a continuous `setInterval`. It fetches data from `earthquake.usgs.gov` and `api.open-meteo.com`. If thresholds are crossed (e.g., Temp > 28°C or Precip > 10mm), it converts these into `zones`.
2. **Database Persistence:** Valid incidents, approved deployments, and field reports are saved via `better-sqlite3` to `storm.db` (WAL mode enabled for concurrent writes).
3. **The Broadcast:** Immediately after polling or when an officer makes a decision, the server calls `io.emit('storm_state_update')`.
4. **The UI Hydration:** Every protected page (Dashboard, Resources, Reason) listens to the socket stream. When a payload arrives, React state is overwritten, providing a true real-time, zero-refresh experience.

---

## 🛑 Production Hardening Checklist

While STORM is a highly advanced prototype, several steps are required before deploying it to a real crisis environment:
- **Replace JWT Secret:** Use a secure, injected environment variable for `JWT_SECRET`.
- **Rate Limiting:** Implement Express rate limiters on `/api/login` and `/api/reports` to prevent DDoS or brute-force attacks.
- **CORS Policies:** Restrict Socket.IO and Express CORS origins to the specific production domains.
- **Storage Buckets:** Implement AWS S3 or Google Cloud Storage for real file/evidence attachment in the Field Reports portal (currently simulated).
- **Scale Database:** Migrate from SQLite to PostgreSQL for multi-instance horizontal scaling.

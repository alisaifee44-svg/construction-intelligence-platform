# AI-Powered Multimodal Construction Intelligence Platform

An intelligent, full-stack decision-support system for construction professionals. The platform leverages **multimodal AI** (Google Gemini) to analyze text, images, and structured data for actionable construction intelligence.

![Architecture](docs/architecture.png)

## 🚀 Features

| Module | Description | Input |
|--------|------------|-------|
| 🛡️ **Safety Monitoring** | Detect hazards, PPE violations, and unsafe conditions | Site images |
| 🔍 **Crack Detection** | Identify crack types, severity, causes, and repairs | Crack images |
| 🏠 **Real Estate Valuation** | AI-powered property valuation with market analysis | Property details |
| 📋 **Project Planning** | Material estimates, cost calculations, task schedules | Project specs |
| 🌤️ **Daily Assistant** | Weather-aware briefings, checklists, activity advice | Site details |
| 🧠 **Knowledge Hub** | Expert answers to construction questions | Questions |

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: FastAPI + Python 3.9+
- **AI Engine**: Google Gemini 1.5 Pro (multimodal)
- **Styling**: Vanilla CSS (premium dark theme)
- **HTTP Client**: Axios

## 📋 Prerequisites

- **Python 3.9+** with pip
- **Node.js 18+** with npm
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

## ⚡ Quick Start

### 1. Clone & Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure API key
# Edit .env and replace 'your_gemini_api_key_here' with your actual Gemini API key
```

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install
```

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
python main.py
```
Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # Settings & env vars
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables (API key)
│   ├── routes/              # API route handlers
│   │   ├── safety.py        # Safety monitoring endpoint
│   │   ├── crack.py         # Crack detection endpoint
│   │   ├── valuation.py     # Real estate valuation endpoint
│   │   ├── planning.py      # Project planning endpoint
│   │   ├── assistant.py     # Daily assistant endpoint
│   │   └── knowledge.py     # Knowledge Q&A endpoint
│   ├── services/
│   │   └── ai_service.py    # Gemini AI integration
│   └── schemas/
│       └── responses.py     # Pydantic JSON schemas
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx         # React entry point
│       ├── App.jsx          # Router configuration
│       ├── index.css         # Design system
│       ├── api/
│       │   └── client.js    # API client
│       ├── components/      # Reusable UI components
│       └── pages/           # Feature pages (6 modules)
│
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/safety/analyze` | Analyze site safety (multipart image) |
| `POST` | `/api/crack/analyze` | Analyze structural cracks (multipart image) |
| `POST` | `/api/valuation/evaluate` | Evaluate property value (JSON) |
| `POST` | `/api/planning/create` | Create project plan (JSON) |
| `POST` | `/api/assistant/daily-briefing` | Get daily briefing (JSON) |
| `POST` | `/api/knowledge/ask` | Ask construction question (JSON) |
| `GET`  | `/api/health` | Health check |

## 🔒 JSON Schema Contracts

All AI responses follow strict Pydantic-validated JSON schemas defined in `backend/schemas/responses.py`. This ensures:
- Predictable frontend rendering
- Type-safe data contracts
- Graceful fallback on parsing errors

## ⚠️ Known Limitations

- AI responses depend on Google Gemini availability and rate limits
- Image analysis quality depends on image clarity and resolution
- Property valuations are AI estimates, not professional appraisals
- Weather data is AI-generated based on context, not real-time API data
- Large image uploads (>10MB) are rejected

## 📄 License

MIT License

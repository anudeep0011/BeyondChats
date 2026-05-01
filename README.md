# BeyondChats - Full Stack Article Enrichment Platform

![Build Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-green)
![Tech Stack](https://img.shields.io/badge/tech-Laravel%2FNode%2FReact-blueviolet)

BeyondChats is a production-ready, full-stack article enrichment system that automatically fetches blog articles from RSS feeds, enriches them with AI-powered insights using Google Search and Gemini LLM, and presents them through a modern, responsive React interface.

## 🎯 Overview

**What it does**: Transforms raw RSS feed content into enriched, intelligently curated articles with real-time AI analysis and supplementary research context.

**Key features**:
- ✅ Automated RSS feed processing with intelligent scheduling
- ✅ AI-powered content enrichment using Google Gemini
- ✅ Real-time article context via Google Search integration
- ✅ Modern, responsive UI with glassmorphism design
- ✅ Multi-deployment architecture (local & cloud)
- ✅ Database abstraction with PostgreSQL support
- ✅ Background job processing pipeline

---

## 🏗️ Architecture

### System Design

The application follows a **microservices-inspired monolithic architecture** with three independent components:

```
┌─────────────────────────────────────────────────────────────────┐
│                     BeyondChats System                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐│
│  │   Frontend       │  │    Backend API   │  │   Processor    ││
│  │  (React + Vite)  │  │ (Laravel/Node.js)│  │   (Node.js)    ││
│  │                  │  │                  │  │                ││
│  │  • React 18      │  │  • REST API      │  │  • RSS Fetch   ││
│  │  • Vite bundler  │  │  • PostgreSQL    │  │  • AI Enrich   ││
│  │  • Glassmorphism │  │  • Data Mgmt     │  │  • Google Srch ││
│  │  • TypeScript    │  │  • Auth/Security │  │  • Scheduling  ││
│  └──────────────────┘  └──────────────────┘  └────────────────┘│
│         │                        ▲                       │      │
│         │                        │                       │      │
│         └────────────────────────┴───────────────────────┘      │
│                          (JSON API)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Pipeline

```
1. Ingestion Phase (Real-time)
   └─> Node.js Processor → Fetch RSS Feed (beyondchats.com/feed)
   └─> Extract new articles

2. Enrichment Phase (AI Processing)
   └─> Query Google Search for context
   └─> Scrape reference articles
   └─> Prompt Google Gemini for rewrite/enhancement
   └─> Store enriched content in database

3. Presentation Phase (User Interface)
   └─> React Frontend fetches articles via API
   └─> Display in responsive card layout
   └─> Enable source navigation
```

### Component Breakdown

| Component | Technology | Purpose | Deployment |
|-----------|-----------|---------|-----------|
| **Backend** | Laravel 11 (PHP) / Node.js Express | REST API, Database management, Data persistence | Render |
| **Backend (Fallback)** | Node.js Express | Local development fallback (when PHP unavailable) | Local |
| **Processor** | Node.js (scheduling) | RSS fetching, AI enrichment, background jobs | Render Worker |
| **Frontend** | React 18 + Vite | User interface, real-time rendering | Vercel |
| **Database** | PostgreSQL | Article storage, metadata management | Render (managed) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **PHP** 8.2+ (optional, for Laravel backend)
- **Git**

### Quick Start (5 minutes)

#### 1. Clone the Repository

```bash
git clone https://github.com/anudeep0011/BeyondChats.git
cd BeyondChats
```

#### 2. Backend Setup

Choose one option based on your environment:

**Option A: Node.js Backend (Recommended for Local Development)**

```bash
cd backend-node
npm install
node server.js
```

Server runs on: `http://localhost:8000`

**Option B: Laravel Backend (Production Standard)**

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan serve
```

Server runs on: `http://localhost:8000`

#### 3. Processor Setup (Background Worker)

```bash
cd processor
npm install
cp .env.example .env
```

**Configure `.env`**:
```env
API_URL=http://localhost:8000/api/articles
RSS_FEED_URL=https://beyondchats.com/feed
GOOGLE_API_KEY=your_api_key_here
GEMINI_API_KEY=your_gemini_key_here
```

**Start processor**:
```bash
node index.js
```

The processor will begin fetching and enriching articles automatically (default: every 5 minutes).

#### 4. Frontend Setup (React UI)

```bash
cd frontend
npm install
```

**Configure `.env`**:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Start dev server**:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📖 Usage

### Local Development Workflow

1. **Ensure all services are running** (backend, processor, frontend)
2. **Open browser**: Navigate to `http://localhost:5173`
3. **View articles**: Articles automatically appear as the processor enriches them
4. **Click a card**: Opens the original source article
5. **Monitor processor**: Check console output in processor terminal for real-time status

### Production Workflow

Deployment is automated through GitHub:

```
Push to GitHub
    ↓
Render detects render.yaml
    ↓
Backend + Processor deployed
    ↓
Vercel detects changes
    ↓
Frontend deployed
    ↓
All systems live & synced
```

---

## 📁 Project Structure

```
BeyondChats/
├── backend/                    # Laravel API (Production)
│   ├── app/                    # Application logic
│   ├── config/                 # Configuration files
│   ├── database/               # Migrations & seeds
│   ├── routes/                 # API routes
│   └── ...
├── backend-node/               # Express API (Local Fallback)
│   ├── server.js               # Main server entry
│   ├── routes/                 # API endpoints
│   └── ...
├── processor/                  # Background Worker
│   ├── index.js                # Main processor loop
│   ├── services/               # Business logic
│   │   ├── rss-fetcher.js      # RSS parsing
│   │   ├── google-search.js    # Search integration
│   │   └── ai-enricher.js      # Gemini API integration
│   └── .env.example            # Configuration template
├── frontend/                   # React UI
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API client services
│   │   └── styles/             # CSS & styling
│   ├── vite.config.js          # Vite configuration
│   └── ...
├── render.yaml                 # Render deployment config
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # This file
```

---

## 🌐 Deployment

### Cloud Deployment (Production)

Deployment is streamlined through two platforms:

#### Backend & Processor → Render

```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to Render Dashboard (dashboard.render.com)
# 3. Click "New" → "Blueprint"
# 4. Connect your GitHub repository
# 5. Render auto-detects render.yaml and deploys:
#    - PostgreSQL Database
#    - Laravel Backend
#    - Node.js Processor Worker
```

**Result**: Backend API endpoint (e.g., `https://beyondchats-backend.onrender.com`)

#### Frontend → Vercel

```bash
# 1. Go to Vercel Dashboard (vercel.com)
# 2. Click "Add New" → "Project"
# 3. Import your GitHub repository
# 4. Configure:
#    - Root Directory: frontend
#    - Environment: VITE_API_BASE_URL=<backend-render-url>/api
# 5. Deploy
```

**Result**: Frontend URL (e.g., `https://beyondchats.vercel.app`)

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 🔧 Configuration

### Environment Variables

#### Backend (`.env`)
```env
APP_NAME=BeyondChats
APP_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
API_KEY=your_api_key
```

#### Processor (`.env`)
```env
API_URL=https://your-backend.com/api/articles
RSS_FEED_URL=https://beyondchats.com/feed
GOOGLE_API_KEY=your_google_api_key
GEMINI_API_KEY=your_gemini_api_key
FETCH_INTERVAL=300000  # 5 minutes in ms
```

#### Frontend (`.env`)
```env
VITE_API_BASE_URL=https://your-backend.com/api
VITE_APP_TITLE=BeyondChats
```

---

## 📊 Technology Stack

| Layer | Technologies |
|-------|----------|
| **Frontend** | React 18, Vite, CSS (Glassmorphism) |
| **Backend** | Laravel 11 / Node.js Express, PostgreSQL |
| **AI/ML** | Google Gemini, Google Search API |
| **Infrastructure** | Render, Vercel |
| **Version Control** | Git, GitHub |

**Language Breakdown**:
- Blade Templates: 48.4%
- PHP: 36.7%
- JavaScript: 12.6%
- CSS: 1.4%
- Other: 0.9%

---

## 🧪 Testing & Development

### Run Tests

```bash
# Backend tests
cd backend
php artisan test

# Frontend tests
cd frontend
npm run test
```

### Code Quality

```bash
# Lint frontend
cd frontend
npm run lint

# Format code
npm run format
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Ensure Node.js v18+ or PHP 8.2+ installed; check `.env` configuration |
| **Processor not fetching** | Verify RSS feed URL is accessible; check API key configuration |
| **Frontend shows blank** | Check `VITE_API_BASE_URL` in `.env`; ensure backend is running |
| **Database connection error** | Verify PostgreSQL is running; check `DATABASE_URL` |

For more help, check the [Issues](https://github.com/anudeep0011/BeyondChats/issues) section.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Commit changes**: `git commit -m "Add feature description"`
4. **Push to branch**: `git push origin feature/your-feature`
5. **Open a Pull Request**

### Code Standards

- Follow PSR-12 for PHP code
- Use ESLint rules for JavaScript
- Write meaningful commit messages
- Add tests for new features

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Anudeep**  
GitHub: [@anudeep0011](https://github.com/anudeep0011)

---

## 🙏 Acknowledgments

- Built with [Laravel](https://laravel.com) for backend
- Powered by [React](https://react.dev) for frontend
- AI enrichment via [Google Gemini](https://deepmind.google/technologies/gemini/)
- Search capabilities via [Google Search API](https://www.google.com/search)
- Deployed on [Render](https://render.com) and [Vercel](https://vercel.com)

---

## 📞 Support

For issues, questions, or suggestions:
- **GitHub Issues**: [Report a bug](https://github.com/anudeep0011/BeyondChats/issues)
- **Discussions**: [Community discussions](https://github.com/anudeep0011/BeyondChats/discussions)

---

## 🎉 Get Started Today!

```bash
git clone https://github.com/anudeep0011/BeyondChats.git
cd BeyondChats
# Follow the Quick Start section above
```

**Happy coding!** 🚀

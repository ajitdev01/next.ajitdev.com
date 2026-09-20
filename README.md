<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=220&section=header&text=NEXT.AJITDEV.COM&fontSize=62&fontAlignY=40&animation=fadeIn&fontColor=ffffff&desc=Flagship%20Technical%20Platform%20%7C%20Razorpay%20Payments%20%7C%20AI%20Ecosystem&descSize=18&descAlignY=64&descColor=4ECDC4" width="100%" />
</div>

<h1 align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=4ECDC4&center=true&vCenter=true&width=950&lines=Next.js+16+App+Router+%7C+React+19+%7C+TypeScript+5;Razorpay+Production+Payment+Gateway+%7C+HMAC-SHA256;E-Commerce+Store+%7C+Redux+Toolkit+%7C+Radix+UI;Google+Gemini+Cloud+Assistant+%7C+Official+GenAI+SDK;Build+Fast.+Build+Secure.+Build+Scalable." alt="Typing SVG" />
</h1>

<p align="center">
  <a href="https://next.ajitdev.com"><img src="https://img.shields.io/badge/Production-next.ajitdev.com-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
  <a href="https://next.ajitdev.com/payments/self"><img src="https://img.shields.io/badge/Razorpay-Live_Payments-0C2340?style=for-the-badge&logo=razorpay&logoColor=white" /></a>
  <img src="https://img.shields.io/badge/Next.js-16.3.5_Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19.2.8_Canary-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.0_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas_Persistence-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge" />
</p>

<div align="center">

[**🌐 Live Platform**](https://next.ajitdev.com) • [**💳 Direct Payments**](https://next.ajitdev.com/payments/self) • [**🧾 Payment History Cards**](https://next.ajitdev.com/payments/testlist) • [**🧪 Payments Sandbox**](https://next.ajitdev.com/payments/test) • [**🛍️ E-Comm Store**](https://next.ajitdev.com/store) • [**🤖 AI Cloud Assistant**](https://next.ajitdev.com/projects#assistant) • [**🌤️ Weather App**](https://next.ajitdev.com/weather) • [**⚡ API Hub**](https://next.ajitdev.com/api)

---

</div>

## 📖 About The Project

**`next.ajitdev.com`** is the central high-performance web engineering hub and developer ecosystem engineered by **Ajit Dev**. Crafted from the ground up on bleeding-edge modern web standards, it showcases production-grade full-stack capabilities:

- 💳 **Production Razorpay Direct Payment Integration**: Custom INR amounts, preset quick-add chips (+₹100, +₹500, +₹1,000), modal checkout, server-side cryptographic HMAC-SHA256 signature verification, persistent MongoDB records, and isolated `@media print` receipts.
- 🧾 **Payments Sandbox & Transaction Explorer (`/payments/testlist`)**: Real-time financial activity cards showing status pills, copyable IDs, total volume metrics, and printable digital receipts.
- 🛒 **Refresh-Safe E-Commerce Experience (`/store`)**: 50+ products, instant search, dynamic coupon validation, and Redux Toolkit cart persistence synced to `localStorage`.
- 🤖 **AJITDEV Cloud Assistant**: Agentic AI chat assistant powered by `@google/genai` (Google Gemini Flash) with server-side API key protection and multi-model fallback.
- 🌤️ **Atmospheric Weather Intelligence (`/weather`)**: Real-time weather measurements with server route proxy and offline mock resilience.
- 🛡️ **Sovereign Local-First Tools (`/note`, `/todo`)**: Zero network dependency, 0ms interaction latency with IndexedDB, and 1-click JSON backup.
- ⚡ **Interactive Developer API Console (`/api`)**: Endpoint explorer with live testing, schema viewers, and response metrics.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT TIER (Next.js 16 SPA)                       │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │   React 19 Hydration  │  │   Redux Toolkit Store │  │  Radix UI /     │  │
│  │   (App Router Layout) │  │  (Cart, Orders, State)│  │  Framer Motion  │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬────────┘  │
└──────────────┼──────────────────────────┼───────────────────────┼───────────┘
               │                          │                       │
               ▼                          ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LOCAL STORAGE & SOVEREIGN TIER                        │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │      LocalStorage     │  │   IndexedDB Database  │  │ JSON State Ex-  │  │
│  │ (Redux Cart / Orders) │  │ (Offline Notes/Todos) │  │ port / Recovery │  │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   EDGE GATEWAY & BACKEND ROUTE HANDLERS                     │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │  Next.js Server API   │  │   NextAuth v5 Beta    │  │   Nodemailer    │  │
│  │ (/api/weather, /auth) │  │ (Google OAuth Session)│  │ (SMTP Gateway)  │  │
│  ├───────────────────────┴──┴───────────────────────┴──┴─────────────────┤  │
│  │   Razorpay Orders & Cryptographic HMAC Verification (/api/payment/*)  │  │
│  └───────────┬──────────────────────────┬───────────────────────┬────────┘  │
└──────────────┼──────────────────────────┼───────────────────────┼───────────┘
               │                          │                       │
               ▼                          ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL INFRASTRUCTURE & DATA                       │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │     MongoDB Atlas     │  │  OpenWeatherMap API   │  │  Google Gemini  │  │
│  │ (Cloud Persistence)   │  │  (Real-Time Weather)  │  │  (Cloud AI Gen) │  │
│  ├───────────────────────┴──┴───────────────────────┴──┴─────────────────┤  │
│  │                Razorpay Payment Gateway API (Production / Test)       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💳 Payment Gateway Architecture & Security Flow

```
[User Browser]
      │
      │ 1. Enter Amount & Click "Pay Now"
      ▼
[POST /api/payment/create-order] (Server-Side)
      │
      │ 2. Validate Amount (₹1 – ₹5,00,000) & Initialize Razorpay Order
      ▼
[Razorpay API Gateway]
      │
      │ 3. Returns order_id (e.g. order_TeLwCoFUKoyfbj)
      ▼
[MongoDB Atlas] ──► Pre-saves order record in collection 'payments'
      │
      │ 4. Client launches Razorpay Modal Checkout
      ▼
[User Completes Payment (UPI / Card / NetBanking)]
      │
      │ 5. Modal returns: razorpay_payment_id, order_id, razorpay_signature
      ▼
[POST /api/payment/verify] (Server-Side)
      │
      │ 6. HMAC-SHA256: crypto.createHmac('sha256', SECRET).update(`${order_id}|${payment_id}`)
      │ 7. Constant-Time Verification: crypto.timingSafeEqual(expected, actual)
      ▼
[MongoDB Atlas] ──► Updates status to 'success', saves method & timestamp
      │
      │ 8. Client displays Confetti Burst + Isolated Printable Receipt
      ▼
[Clean Digital Receipt Card]
```

---

## 🛠️ Complete Technology Stack

<div align="center">

### 💳 Payment Processing & Security
![Razorpay](https://img.shields.io/badge/Razorpay_SDK-v2.9.8-0C2340?style=for-the-badge&logo=razorpay&logoColor=white)
![Crypto](https://img.shields.io/badge/Node_Crypto-HMAC_SHA256-000000?style=for-the-badge&logo=node.js&logoColor=white)
![CSS Print](https://img.shields.io/badge/@media_print-Clean_Receipts-2496ED?style=for-the-badge&logo=css3&logoColor=white)

### 💻 Core Languages & Frameworks
![TypeScript](https://img.shields.io/badge/TypeScript-5.0_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-16.3.5_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)

### 🎨 Frontend & UI Ecosystem
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-Primitives-161618?style=for-the-badge&logo=radix-ui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.2.0-FF0055?style=for-the-badge&logo=framer&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_React-1.45.0-F56565?style=for-the-badge&logo=feather&logoColor=white)

### ⚙️ State Management & Cloud AI
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-v2.12-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Google Gemini](https://img.shields.io/badge/@google/genai-Gemini_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-v5_Beta-black?style=for-the-badge&logo=next.js&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-8.0.11-007FFF?style=for-the-badge&logo=gmail&logoColor=white)

### 🗄️ Databases & Storage
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_7.6-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![IndexedDB](https://img.shields.io/badge/IndexedDB-Local_First-336791?style=for-the-badge&logo=sqlite&logoColor=white)
![LocalStorage](https://img.shields.io/badge/LocalStorage-Hydration-FFA116?style=for-the-badge&logo=html5&logoColor=white)

### ☁️ Cloud, DevOps & Deployment
![Vercel](https://img.shields.io/badge/Vercel-Edge_Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Cloud_Architecture-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

</div>

---

## 🌟 Production Modules & Features

<table>
<tr>
<td width="50%" valign="top">

### 💳 Razorpay Direct Payment Gateway
**Production-ready custom INR payment processing**

![Razorpay](https://img.shields.io/badge/Razorpay-v2.9.8-0C2340?style=flat-square&logo=razorpay)
![Crypto](https://img.shields.io/badge/Crypto-HMAC_SHA256-black?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

- [🌐 Live Payment Page](https://next.ajitdev.com/payments/self)
- Custom amounts + quick chips (+₹100, +₹500, +₹1,000)
- Server-side order creation (`/api/payment/create-order`)
- Cryptographic HMAC-SHA256 verification
- Zero client-side secret exposure
- Isolated `@media print` clean receipt generator

</td>
<td width="50%" valign="top">

### 🧾 Payments Sandbox & History Explorer
**Card explorer for all recorded transactions**

![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS_v4-38BDF8?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=flat-square)

- [🌐 Payments History](https://next.ajitdev.com/payments/testlist) • [🧪 Sandbox](https://next.ajitdev.com/payments/test)
- Real-time Volume (₹), Total Transactions & Success Rate
- Filter by status: All, Success, Pending, Failed
- 1-Click copy for Payment IDs and Order IDs
- Printable digital receipt modal for past orders
- Pre-filled sandbox test card credentials

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🛒 Cloud-Native E-Commerce Store
**Full-featured shopping experience with persistent cart**

![Redux](https://img.shields.io/badge/Redux_Toolkit-v2.12-764ABC?style=flat-square&logo=redux)
![Radix](https://img.shields.io/badge/Radix-UI_Dialog-161618?style=flat-square)
![Confetti](https://img.shields.io/badge/Confetti-Physics-FFD700?style=flat-square)

- [🌐 Visit Store](https://next.ajitdev.com/store)
- 50+ curated products with instant live search
- Refresh-safe state hydration across browser sessions
- Dynamic coupon codes (`DEV10`, `SUPER20`, `FREESHIP`)
- Slide-over cart drawer & accessible checkout modals

</td>
<td width="50%" valign="top">

### 🤖 AJITDEV Cloud Assistant
**Agentic AI assistant powered by Google Gemini**

![Gemini](https://img.shields.io/badge/Gemini-Flash_3.6-4285F4?style=flat-square&logo=google)
![GenAI](https://img.shields.io/badge/@google/genai-SDK-4285F4?style=flat-square)
![Motion](https://img.shields.io/badge/Framer_Motion-Drawer-FF0055?style=flat-square)

- [🌐 Chat with Assistant](https://next.ajitdev.com/projects#assistant)
- Grounded with 28-category developer knowledge base
- Automatic multi-model fallback resilience
- Safe server route proxy (`/api/assistant`)
- Zero-secret guarantee (API keys never exposed to client)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🌤️ Atmospheric Weather Intelligence
**Real-time weather station with offline fallback**

![OpenWeather](https://img.shields.io/badge/OpenWeather-Live_Data-EB6E4B?style=flat-square)
![Next.js](https://img.shields.io/badge/Route_Proxy-Secure-black?style=flat-square)

- [🌐 Weather Dashboard](https://next.ajitdev.com/weather)
- Dynamic condition icons and atmospheric metrics
- Zero-crash fallback mock engine when offline
- Safe server-side API key handling

</td>
<td width="50%" valign="top">

### 📝 Sovereign Notes & Task Manager
**Local-first privacy-respecting productivity apps**

![IndexedDB](https://img.shields.io/badge/IndexedDB-0ms_Latency-336791?style=flat-square)
![Markdown](https://img.shields.io/badge/Markdown-Rich_Text-black?style=flat-square)

- [🌐 Notes](https://next.ajitdev.com/note) • [✅ Tasks](https://next.ajitdev.com/todo)
- Absolute privacy: Data never leaves your device
- 0ms interaction budget with optimistic state
- 1-Click JSON import/export for cross-device migration

</td>
</tr>
</table>

---

## ⚡ Server Route Handlers & API Reference

| Endpoint | Method | Role | Description |
| :--- | :---: | :--- | :--- |
| `/api/payment/create-order` | `POST` | Payments | Validates amount (₹1 to ₹5,00,000), initiates Razorpay order, records pre-order document to MongoDB Atlas, and returns `orderId` & public `keyId`. |
| `/api/payment/verify` | `POST` | Payments | Cryptographically validates `razorpay_signature` via constant-time HMAC-SHA256 comparison and updates payment status to `success`. |
| `/api/payment/list` | `GET` | Analytics | Merges transaction records from MongoDB Atlas and live Razorpay gateway for `/payments/testlist`. |
| `/api/assistant` | `POST` | AI Engine | Streams responses from Google Gemini Flash via `@google/genai` with fallback model resilience and knowledge base grounding. |
| `/api/weather` | `GET` | Weather | Proxies OpenWeatherMap API requests to safeguard server keys, providing realistic fallback metrics if rate limits occur. |
| `/api/contact` | `POST` | Communication | Validates contact form submissions and dispatches formatted notification emails via Nodemailer SMTP. |
| `/api/auth/[...nextauth]` | `*` | Security | Manages Google OAuth session lifecycles and token persistence via NextAuth.js v5. |

---

## 📁 Organized Project Structure

```bash
next.ajitdev.com/
├── app/
│   ├── about/                    # Developer Bio, Vision & Values
│   ├── api/                      # REST Endpoints & Server Route Handlers
│   │   ├── assistant/            # Google Gemini AI Assistant Route (@google/genai)
│   │   ├── auth/                 # NextAuth Handler Routes
│   │   ├── contact/              # Transactional Email Dispatcher (Nodemailer)
│   │   ├── payment/              # Razorpay Backend Gateway
│   │   │   ├── create-order/     # Order initialization endpoint
│   │   │   ├── verify/           # HMAC-SHA256 signature verification handler
│   │   │   └── list/             # Transactions merger endpoint (Mongo + Razorpay)
│   │   ├── weather/              # Real-Time OpenWeatherMap Proxy
│   │   └── page.tsx              # Interactive API Console Explorer
│   ├── components/               # Global Layout Components (Header, Footer, Pillars)
│   ├── dashboard/                # Developer Analytics & User Console
│   ├── feed.xml/                 # Dynamic RSS / Atom Syndication Feed
│   ├── login/                    # NextAuth Login & Account Portal
│   ├── note/                     # Sovereign Local-First Note Taking App (IndexedDB)
│   ├── payments/                 # Direct Payment System Hub
│   │   ├── self/                 # Live direct payment page
│   │   ├── test/                 # Sandbox testing interface with credentials
│   │   └── testlist/             # Transactions history cards & printable receipt modal
│   ├── projects/                 # Engineering Projects Showcase
│   ├── store/                    # Full-Featured E-Comm Store (Redux + Radix)
│   ├── todo/                     # Offline-First Task Manager (IndexedDB)
│   ├── weather/                  # Real-Time Weather Application
│   ├── globals.css               # Hardware-Accelerated CSS, Aurora & Print-Receipt Styles
│   ├── layout.tsx                # Root App Layout, Fonts & Schema Graph
│   ├── opengraph-image.tsx       # Dynamic 1200x630 Social Preview Card
│   ├── page.tsx                  # Flagship Landing Homepage
│   ├── robots.ts                 # Crawler Indexing Directives
│   └── sitemap.ts                # Auto-Generated XML Sitemap
├── components/
│   ├── payment-form.tsx          # Interactive Razorpay Checkout Form & Printable Receipt
│   ├── CloudAssistant.tsx        # Floating Glassmorphic AI Chat Window
│   ├── seo/                      # JSON-LD Schema Injector
│   └── ui/                       # Reusable Micro-Interaction Wrappers
├── lib/
│   ├── paymentDb.ts              # MongoDB Atlas Payments Persistence Helper
│   ├── assistant/
│   │   ├── knowledge.ts          # Curated Developer Knowledge Dataset
│   │   └── system-prompt.ts      # Context Matching Engine & Fallback
│   ├── seo/                      # Schema Graph Builders (WebSite, Person)
│   ├── store/                    # Redux Toolkit (cartSlice, store, Provider)
│   ├── localStore.js             # Browser LocalStorage Helpers
│   ├── mongodb.js                # MongoDB Atlas Connection Singleton
│   ├── store-data.ts             # 50+ Curated Products Dataset
│   ├── todoDb.js                 # IndexedDB Asynchronous Storage Engine
│   └── useConfetti.ts            # Particle Burst Animation Trigger
├── public/                       # Static Assets & PWA Icons
│   ├── logo.png                  # High-Resolution Metallic Ribbon Logo
│   ├── og-image.png              # Fallback Social Card Image
│   ├── favicon.ico               # Multi-Resolution Favicon
│   └── manifest.json             # Progressive Web App Manifest
├── types/
│   └── razorpay.d.ts             # Razorpay Window & Options Type Definitions
├── auth.ts                       # NextAuth Authentication Config
├── .gitignore                    # Production Git Exclusions
├── .vercelignore                 # Production Deployment Archive Filters
└── README.md                     # Engineering Documentation
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: `v20.0.0` or later
- **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`
- **Git**: Installed on your machine

### 2. Clone the Repository
```bash
git clone https://github.com/ajitdev01/next.ajitdev.com.git
cd next.ajitdev.com
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the project root:

```env
# Database (MongoDB Atlas)
DATABASE_MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ajitdev

# Authentication (NextAuth v5)
AUTH_SECRET=your_nextauth_secret_key_here
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

# Razorpay Payment Gateway (Server-Side Secret - NEVER expose client-side)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Razorpay Public Key (Client-Side Checkout Modal)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Google Gemini AI Cloud Assistant (Server-Side Only)
GEMINI_API_KEY=your_gemini_api_key

# Weather API (Optional - has mock fallback)
OPENWEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key

# Contact Email Gateway (SMTP)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
CONTACT_RECEIVER_EMAIL=your_inbox@gmail.com
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build & Strict Verification
```bash
# Run strict TypeScript compiler verification (0 errors standard)
npx tsc --noEmit

# Run ESLint quality checks
npm run lint

# Compile optimized production bundle
npm run build

# Run production server locally
npm run start
```

---

## ☁️ Deployment on Vercel

The platform is configured for production deployment on Vercel:

1. **Push Changes to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete Razorpay payment integration & responsive mobile UI"
   git push origin main
   ```
2. **Add Environment Variables in Vercel Dashboard**:
   Navigate to **Settings** → **Environment Variables**, and configure for **Production**:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `DATABASE_MONGODB_URI`
   - `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
   - `GEMINI_API_KEY`
   - `GMAIL_USER`, `GMAIL_PASS`, `CONTACT_RECEIVER_EMAIL`
3. **Deploy via CLI**:
   ```bash
   npx vercel --prod
   ```

---

## 🔒 Security Best Practices

- **Never commit `.env` or `.env.local` files**: Both are strictly excluded in `.gitignore` and `.vercelignore`.
- **Zero Client Secret Exposure**: Secrets like `RAZORPAY_KEY_SECRET`, `DATABASE_MONGODB_URI`, and `GEMINI_API_KEY` are strictly kept on the server and never prefixed with `NEXT_PUBLIC_`.
- **Cryptographic Validation**: Payment verification uses `crypto.timingSafeEqual` to safeguard against side-channel and timing attacks.

---

## 🌐 The Ajit Dev Network

| Property | Primary Domain | Purpose & Specialty | Status |
| :--- | :--- | :--- | :---: |
| **Main Hub** | [`ajitdev.com`](https://www.ajitdev.com/) | Official developer portfolio, publications, and verified identity. | `ONLINE` |
| **Next Platform** | [`next.ajitdev.com`](https://next.ajitdev.com) | Central Next.js showcase, direct payments, store, and AI tooling. | `ONLINE` |
| **Public API Gateway** | [`api.ajitdev.com`](https://api.ajitdev.com/) | REST & JSON microservice endpoints for developers. | `ACTIVE` |
| **Education Engine** | [`brainzima.com`](https://www.brainzima.com/) | Modern EdTech platform and interactive technical tutorials. | `ONLINE` |
| **Discovery Engine** | [`bifindr.com`](https://bifindr.com/) | Curated business and developer search ecosystem. | `ONLINE` |
| **Bespoke Software** | [`rexvel.com`](https://rexvel.com/) | High-performance enterprise software and bespoke engineering. | `ONLINE` |
| **Developer Sandbox** | [`try.ajitdev.com`](https://try.ajitdev.com/) | Isolated sandboxes, live code runners, and experiments. | `ONLINE` |

---

## 🤝 Connect With Me

<p align="center">
  <a href="https://ajitdev.com">
    <img src="https://img.shields.io/badge/AJIT_DEV-Portfolio-black?style=for-the-badge&logo=vercel">
  </a>

  <a href="mailto:support@ajitdev.com">
    <img src="https://img.shields.io/badge/Business-Contact-success?style=for-the-badge&logo=gmail">
  </a>

  <a href="mailto:ajitk23192@gmail.com">
    <img src="https://img.shields.io/badge/Personal-Contact-red?style=for-the-badge&logo=gmail">
  </a>

  <a href="https://github.com/ajitdev01">
    <img src="https://img.shields.io/badge/GitHub-ajitdev01-181717?style=for-the-badge&logo=github">
  </a>

  <a href="https://x.com/ajitdev01">
    <img src="https://img.shields.io/badge/X-@ajitdev01-000000?style=for-the-badge&logo=x">
  </a>

  <a href="https://linkedin.com/in/ajitdev01">
    <img src="https://img.shields.io/badge/LinkedIn-ajitdev01-0A66C2?style=for-the-badge&logo=linkedin">
  </a>
</p>

---

<div align="center">

### ⚡ Philosophy

> *"Security isn't a feature to be added later — it's the foundation everything is built upon."*

### 🏁 Motto

```
Code. Deploy. Secure. Scale. Repeat.
```

*Building systems that survive real-world traffic, failures, and attacks.*

</div>

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=120&section=footer" width="100%" />

  **Thanks for visiting — next.ajitdev.com** 🔐

  <sub>⭐ Designed & Developed by <a href="https://ajitdev.com">Ajit Kumar</a> · Built for performance, privacy, and sovereignty.</sub>

  <br/>

  ![Made with ❤️ in India](https://img.shields.io/badge/Made%20with%20❤️%20in-India-FF9933?style=flat-square)
  ![Maintained](https://img.shields.io/badge/Maintained-Yes-4ECDC4?style=flat-square)
  ![Last Updated](https://img.shields.io/badge/Updated-September%202026-9B59B6?style=flat-square)

</div>

<div align="center">

# ⚡ NEXT.AJITDEV.COM
### The Flagship Technical Platform, Developer Hub & Engineering Ecosystem
**Crafted with precision by [Ajit Dev](https://www.ajitdev.com) · Powered by Next.js 16, React 19 & Redux Toolkit**

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16.0_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0_Canary-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-v2.12-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Primitives-161618?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Edge_Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://next.ajitdev.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

<br />

![AJITDEV OpenGraph Social Preview Card](./public/og-image.png)

<br />

[**🌐 Explore Live Site**](https://next.ajitdev.com) • [**🛍️ E-Comm Store**](https://next.ajitdev.com/store) • [**🌤️ Weather App**](https://next.ajitdev.com/weather) • [**⚡ API Hub**](https://next.ajitdev.com/api) • [**📝 Local Notes**](https://next.ajitdev.com/note) • [**✅ Task Manager**](https://next.ajitdev.com/todo) • [**👨‍💻 Portfolio**](https://www.ajitdev.com)

---

</div>

## 📖 Executive Summary

**NEXT.AJITDEV.COM** is the central high-performance web engineering hub and developer ecosystem engineered by **Ajit Dev** ([@ajitdev01](https://x.com/ajitdev01)). 

Built from the ground up on modern bleeding-edge web standards, it integrates **local-first reactive applications**, a **persisted Redux e-commerce experience**, **real-time atmospheric weather intelligence**, **secure NextAuth authentication**, an **interactive developer console**, and **semantic JSON-LD knowledge graphs** into a unified, lightning-fast web platform.

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
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬────────┘  │
└──────────────┼──────────────────────────┼───────────────────────┼───────────┘
               │                          │                       │
               ▼                          ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL INFRASTRUCTURE & DATA                       │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │     MongoDB Atlas     │  │  OpenWeatherMap API   │  │  Vercel Edge    │  │
│  │ (Cloud Persistence)   │  │  (Real-Time Weather)  │  │  CDN & Analytics│  │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Live Applications & Core Modules

| Module / Route | Type | Core Technologies | Key Highlights |
| :--- | :--- | :--- | :--- |
| [**E-Comm Store**](https://next.ajitdev.com/store)<br>`/store` | E-Commerce | Redux Toolkit, Radix UI, Confetti | 50+ curated products, instant search, dynamic coupon system, refresh-safe state persistence, slide-over cart drawer & order history. |
| [**Weather Intelligence**](https://next.ajitdev.com/weather)<br>`/weather` | Atmospheric SPA | OpenWeatherMap, Geolocation, SVG Visuals | Real-time temperature metrics, dynamic condition icons, humidity & wind tracking, automatic offline fallback. |
| [**Sovereign Notes**](https://next.ajitdev.com/note)<br>`/note` | Local-First Productivity | IndexedDB, Markdown, LocalStore | 0ms latency, zero cloud surveillance, instant full-text search, offline editing with one-click JSON backup. |
| [**Offline Task Manager**](https://next.ajitdev.com/todo)<br>`/todo` | Task Manager | IndexedDB, Optimistic UI | Sovereign browser storage, priority tags, instant completion toggles, zero network dependency. |
| [**API Documentation Hub**](https://next.ajitdev.com/api)<br>`/api` | Developer Console | REST, JSON-LD, HTTP Inspector | Interactive endpoint explorer, live schema viewer, response time meters, production developer guides. |
| [**Developer Showcase**](https://next.ajitdev.com/projects)<br>`/projects` | Portfolio Showcase | Framer Motion, Tailwind CSS v4 | Curated catalog of full-stack engineering repositories, DevOps architectures, and open-source contributions. |
| [**Developer Dashboard**](https://next.ajitdev.com/dashboard)<br>`/dashboard` | Protected Console | NextAuth v5, MongoDB Atlas | Secure OAuth authentication, authenticated sessions, telemetry graphs, and developer preferences. |

---

## 💎 Deep-Dive: Engineering Features

### 1. 🛒 Refresh-Safe Redux Toolkit Architecture
- **State Hydration Pipeline**: Cart items, active promotional coupons, and completed order receipts stay permanently synced in `localStorage` across page reloads and browser restarts.
- **Accurate Product & Unit Accounting**: Differentiates between unique catalog products and aggregated quantity units with clear breakdown formulas (`$84.99 × 2 = $169.98`).
- **Interactive Radix Dialogs**: Accessible checkout modals, slide-out cart drawers, order history view, and confirmation alerts with hardware-accelerated animations.
- **Dynamic Coupon Engine**: Automated code matching for discounts (`DEV10`, `SUPER20`) and conditional threshold rules (`FREESHIP` over $99).

### 2. 🌤️ Atmospheric Weather Intelligence
- **Hybrid Real-Time Pipeline**: Pulls live atmospheric measurements via server route proxy (`/api/weather`) while preserving privacy and safeguarding API secrets.
- **Zero-Crash Resilience**: Built-in mock forecast engine provides seamless, realistic weather data if network limits or API keys are unavailable.
- **Fluid Visual Hierarchy**: Glassmorphic weather cards with dynamic iconography, hourly forecasts, UV indexes, and atmospheric pressure indicators.

### 3. 🛡️ Local-First & Browser Sovereignty
- **Absolute Privacy**: Sensitive personal notes and daily checklists never leave the client device unless explicitly exported.
- **Zero-Lag Optimistic State**: 0ms interaction budget backed by asynchronous `IndexedDB` and synchronous fallbacks.
- **Portability**: 1-click JSON import/export enables frictionless data ownership and cross-device migration without account lock-in.

### 4. 🔍 Semantic SEO & Connected Knowledge Graphs
- **Structured Schema Graphs**: Automated JSON-LD linked data for `WebSite`, `Person`, `WebPage`, and `BreadcrumbList` compliant with Schema.org specifications.
- **Auto-Generated Social Cards**: Dynamic 1200×630 OpenGraph and Twitter cards rendered via `@vercel/og` (`/opengraph-image`).
- **Feeds & Crawlers**: Native XML generation for `/sitemap.xml`, `/feed.xml`, `/rss.xml`, and fully compliant `/robots.txt`.

---

## 🛠️ Complete Tech Stack

```
Frontend Architecture
├── Next.js 16.3.5 (App Router, Server Components & Server Actions)
├── React 19.2.8 (Hooks, Suspense, Concurrent Mode)
├── TypeScript 5 (Strict Mode Type Safety)
└── Tailwind CSS v4 (Pure CSS tokens, high-performance styling)

State Management & UI Primitives
├── Redux Toolkit 2.12.0 (@reduxjs/toolkit) & React-Redux 9.3.0
├── Radix UI Primitives (Dialog, Tooltip, Alert-Dialog, Tabs, HoverCard)
├── Framer Motion 13.2.0 (Spring animations & exit transitions)
├── Canvas Confetti 1.9.4 (Interactive celebratory physics)
└── Lucide React 1.45.0 (Crisp, modern SVG icons)

Backend, Auth & Database
├── NextAuth.js v5 Beta 32 (Google OAuth & Session Lifecycle)
├── MongoDB Node Driver 7.6.0 (Atlas Connection Pool)
└── Nodemailer 8.0.11 (Transactional Email SMTP Pipeline)

Telemetry, Analytics & SEO
├── Vercel Web Analytics & Edge Functions
├── Microsoft Clarity Session Telemetry
├── Google Tag Manager (GTM-N2PBQZ35)
└── JSON-LD Linked Data Knowledge Graphs
```

---

## 📁 Organized Project Structure

```bash
next.ajitdev.com/
├── app/
│   ├── about/                    # Developer Bio, Vision & Values
│   ├── api/                      # REST Endpoints & Public API Explorer
│   │   ├── auth/                 # NextAuth Handler Routes
│   │   ├── contact/              # Transactional Email Dispatcher (Nodemailer)
│   │   ├── weather/              # Real-Time OpenWeatherMap Proxy
│   │   └── page.tsx              # Interactive API Console Explorer
│   ├── components/               # Reusable Modular UI Components
│   │   ├── clarity.tsx           # Microsoft Clarity Analytics Tag
│   │   ├── engineering-pillars.tsx # 6 Core Architecture Pillar Cards
│   │   ├── footer.tsx            # Global Footer with Luxury Brand Monogram
│   │   ├── header.tsx            # Sticky Navbar with Metallic Logo
│   │   ├── hero-3d-visualizer.tsx# Live 4-Tier Interactive Developer Console
│   │   └── scroll-to-top.tsx     # Floating Smooth-Scroll Button
│   ├── dashboard/                # Developer Analytics & User Console
│   ├── feed.xml/                 # Dynamic RSS / Atom Syndication Feed
│   ├── login/                    # NextAuth Login & Account Portal
│   ├── note/                     # Sovereign Local-First Note Taking App
│   ├── projects/                 # Engineering Projects Showcase
│   ├── store/                    # Full-Featured E-Comm Store (Redux + Radix)
│   ├── todo/                     # Offline-First Task Manager (IndexedDB)
│   ├── weather/                  # Real-Time Weather Application
│   ├── globals.css               # Hardware-Accelerated CSS Animations & Aurora
│   ├── layout.tsx                # Root App Layout, Fonts & Schema Graph
│   ├── opengraph-image.tsx       # Dynamic 1200x630 Social Preview Card
│   ├── page.tsx                  # Landing Homepage
│   ├── robots.ts                 # Crawler Indexing Directives
│   └── sitemap.ts                # Auto-Generated XML Sitemap
├── components/
│   ├── seo/                      # JSON-LD Schema Injector
│   └── ui/                       # Reusable Micro-Interaction Wrappers
├── lib/
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
├── auth.ts                       # NextAuth Authentication Config
└── README.md                     # Engineering Documentation
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: `v20.0.0` or later
- **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`
- **Git**: Installed on your system

### 2. Clone the Repository
```bash
git clone https://github.com/ajitdev01/next.ajitdev.com.git
cd next.ajitdev.com
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database (MongoDB Atlas)
DATABASE_MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ajitdev

# Authentication (NextAuth v5)
AUTH_SECRET=your_nextauth_secret_key_here
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

# Weather API (Optional - has mock fallback)
OPENWEATHER_API_KEY=your_openweathermap_api_key

# Contact Email Gateway (SMTP)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
CONTACT_RECEIVER_EMAIL=your_inbox@gmail.com
```

### 4. Install Dependencies & Start Dev Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience the platform.

### 5. Verification & Production Build
```bash
# Run strict TypeScript validation
npx tsc --noEmit

# Compile production bundle
npm run build

# Preview production build locally
npm run start
```

---

## 🌐 The Ajit Dev Network

| Property | Primary Domain | Purpose & Specialty | Status |
| :--- | :--- | :--- | :---: |
| **Main Hub** | [`ajitdev.com`](https://www.ajitdev.com/) | Official developer portfolio, publications, and verified identity. | `ONLINE` |
| **Next Platform** | [`next.ajitdev.com`](https://next.ajitdev.com) | Central Next.js showcase, store, weather, and developer tooling. | `ONLINE` |
| **Public API Gateway** | [`api.ajitdev.com`](https://api.ajitdev.com/) | REST & JSON microservice endpoints for developers. | `ACTIVE` |
| **Education Engine** | [`brainzima.com`](https://www.brainzima.com/) | Modern EdTech platform and interactive technical tutorials. | `ONLINE` |
| **Discovery Engine** | [`bifindr.com`](https://bifindr.com/) | Curated business and developer search ecosystem. | `ONLINE` |
| **Bespoke Software** | [`rexvel.com`](https://rexvel.com/) | High-performance enterprise software and bespoke engineering. | `ONLINE` |
| **Developer Sandbox** | [`try.ajitdev.com`](https://try.ajitdev.com/) | Isolated sandboxes, live code runners, and experiments. | `ONLINE` |

---

## 👨‍💻 Connect with Ajit Dev

<div align="center">

[![Website](https://img.shields.io/badge/Website-ajitdev.com-000000?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.ajitdev.com)
[![GitHub](https://img.shields.io/badge/GitHub-ajitdev01-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ajitdev01)
[![X / Twitter](https://img.shields.io/badge/X-@ajitdev01-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/ajitdev01)
[![Instagram](https://img.shields.io/badge/Instagram-@ajitdev01-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/ajitdev01/)
[![LeetCode](https://img.shields.io/badge/LeetCode-ajitdev01-FFA116?style=for-the-badge&logo=leetcode&logoColor=black)](https://leetcode.com/u/ajitdev01/)

</div>

---

## 📄 License

This repository is open-sourced under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.

<div align="center">
  <sub>Engineered with dedication & passion by <strong>Ajit Dev</strong> · Built for performance, privacy, and sovereignty.</sub>
</div>

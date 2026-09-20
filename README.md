# next.ajitdev.com

> High-performance developer ecosystem, modern web applications hub, and direct payment gateway crafted with Next.js 16, React 19, TypeScript, and Tailwind CSS.

Live Production: [https://next.ajitdev.com](https://next.ajitdev.com)

---

## 🚀 Technologies

- **Framework**: Next.js 16.3.5 (App Router, Turbopack, Server Components)
- **Library**: React 19.2.8
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 & Lucide React
- **Payments**: Razorpay Node SDK (`razorpay`) with server-side HMAC-SHA256 signature verification
- **Database**: MongoDB Atlas (Official Node Driver 7.6)
- **State Management**: Redux Toolkit 2.12 & React-Redux 9.3
- **UI Primitives**: Radix UI (Dialog, Tooltip, Tabs, Alert Dialog) & Framer Motion
- **AI & Cloud**: Google GenAI SDK (`@google/genai` Gemini Flash)
- **Authentication**: NextAuth.js v5 (Google OAuth Provider)
- **Email**: Nodemailer (SMTP Gateway)

---

## ✨ Features

- **Razorpay Direct Payment Gateway** (`/payments/self`)
  - Seamless INR payments with customizable amounts and preset quick-add chips (₹100, ₹500, ₹1,000, etc.).
  - Secure server-side order generation via Next.js Route Handlers (`/api/payment/create-order`).
  - Cryptographic HMAC-SHA256 signature verification (`crypto.timingSafeEqual` in `/api/payment/verify`).
  - Persistent transaction records stored in MongoDB Atlas (`payments` collection).
  - Clean printable receipt mode (`@media print`) isolating only transaction details without navigation bars or footers.
  - Payment Sandbox testing page (`/payments/test`) with test credentials.
  - Interactive payment history dashboard (`/payments/testlist`) with status filtering, copyable IDs, and modal receipt preview.

- **E-Commerce Store** (`/store`)
  - Curated catalog with instant search, category filtering, and item quantity management.
  - Persistent cart state across page reloads using Redux Toolkit and `localStorage`.
  - Dynamic coupon validation engine and accessible Radix UI slide-over checkout modal.

- **AI Cloud Assistant** (`/api/assistant`)
  - Grounded conversational assistant powered by Google Gemini Flash (`@google/genai`).
  - Multi-model automatic fallback resilience and safe server-side API key handling.

- **Atmospheric Weather Intelligence** (`/weather`)
  - Real-time weather condition metrics via OpenWeatherMap with automatic offline mock fallbacks.

- **Sovereign Local-First Productivity** (`/note`, `/todo`)
  - Privacy-first note-taking and task manager with 0ms latency powered by IndexedDB and LocalStorage.
  - One-click JSON backup and restoration.

- **Developer Showcase & Projects** (`/projects`)
  - Comprehensive portfolio of engineering projects, architecture diagrams, and tech stack tags.

- **Interactive API Documentation** (`/api`)
  - Live REST endpoint console and schema documentation.

- **User Authentication & Dashboard** (`/login`, `/dashboard`)
  - Google OAuth integration with NextAuth v5 and protected user session dashboard.

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher (or `pnpm` / `yarn`)
- **Git**

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
Create a `.env.local` file in the root directory:

```env
# Database (MongoDB Atlas)
DATABASE_MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# NextAuth v5 Authentication
AUTH_SECRET=your_nextauth_secret_key
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

# Razorpay Payment Gateway (Server-Side)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Razorpay Client-Side Key (Public)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Google Gemini AI Assistant (Server-Side)
GEMINI_API_KEY=your_google_gemini_api_key

# Weather API (Optional - has offline fallback)
OPENWEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key

# Contact Form Email Gateway (SMTP)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
CONTACT_RECEIVER_EMAIL=your_inbox@gmail.com
```

---

## 🛠️ Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack on `http://localhost:3000` |
| `npm run build` | Compiles the production build |
| `npm run start` | Runs the compiled production server locally |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |
| `npx tsc --noEmit` | Runs strict TypeScript type checking without emitting files |

---

## ☁️ Deployment on Vercel

1. **Import Repository**: Connect your Git repository to [Vercel](https://vercel.com).
2. **Configure Environment Variables**:
   In Vercel Project Settings → **Environment Variables**, add the production keys:
   - `DATABASE_MONGODB_URI`
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `GEMINI_API_KEY`
   - `GMAIL_USER`, `GMAIL_PASS`, `CONTACT_RECEIVER_EMAIL`
3. **Deploy**:
   ```bash
   # Deploy directly via Vercel CLI
   npx vercel --prod
   ```

---

## 📁 Basic Project Structure

```
next.ajitdev.com/
├── app/
│   ├── api/                      # Route Handlers (/payment, /assistant, /contact, /weather)
│   ├── components/               # Global layout components (Header, Footer, Pillars)
│   ├── dashboard/                # Protected developer console
│   ├── login/                    # NextAuth authentication portal
│   ├── note/                     # Sovereign note-taking app (IndexedDB)
│   ├── payments/                 # Razorpay Direct Payment routes
│   │   ├── self/                 # Live payment form page
│   │   ├── test/                 # Payment test sandbox with card credentials
│   │   └── testlist/             # Transactions history cards & printable receipt modal
│   ├── projects/                 # Portfolio showcase hub
│   ├── store/                    # Full-featured e-commerce store (Redux Toolkit)
│   ├── todo/                     # Offline task manager
│   ├── weather/                  # Atmospheric weather dashboard
│   ├── globals.css               # Design system & print-receipt styles
│   ├── layout.tsx                # Root layout & font configurations
│   └── page.tsx                  # Flagship landing page
├── components/                   # Modular client & UI components
│   ├── payment-form.tsx          # Interactive Razorpay checkout form & printable receipt
│   └── CloudAssistant.tsx        # Floating AI chat drawer
├── lib/                          # Core business logic & database connections
│   ├── mongodb.js                # MongoDB Atlas connection pool
│   ├── paymentDb.ts              # Payment records persistence functions
│   └── store/                    # Redux Toolkit cart slice and provider
├── public/                       # Static branding assets and icons
├── types/                        # TypeScript definitions (razorpay.d.ts, etc.)
├── auth.ts                       # NextAuth configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and project scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── .gitignore                    # Production Git ignore rules
├── .vercelignore                 # Vercel deployment exclusions
└── README.md                     # Project documentation
```

---

## 🔒 Security Best Practices

- **Never commit `.env`, `.env.local`, or secret credentials to Git.** All secret files are strictly excluded via `.gitignore` and `.vercelignore`.
- **Zero Client Exposure of Secrets**: Variables like `RAZORPAY_KEY_SECRET`, `DATABASE_MONGODB_URI`, and `GEMINI_API_KEY` must never be prefixed with `NEXT_PUBLIC_` or imported into client components.
- **Cryptographic Verification**: Payment transactions are validated server-side using constant-time comparison (`crypto.timingSafeEqual`) to prevent timing attacks.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

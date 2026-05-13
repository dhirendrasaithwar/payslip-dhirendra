# PaySlip Pro - Frontend

A modern, responsive React frontend for the PaySlip Pro application built with TanStack Router, Tailwind CSS, and Vite.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Build & Deployment](#build--deployment)
- [Dependencies Overview](#dependencies-overview)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- ✅ **Modern UI Components** - Radix UI components with Tailwind CSS
- ✅ **Type-Safe Routing** - TanStack Router for type-safe navigation
- ✅ **State Management** - React Query for server state management
- ✅ **Form Handling** - React Hook Form with validation
- ✅ **Responsive Design** - Mobile-first design with Tailwind CSS
- ✅ **PDF Generation** - Generate and download PDF payslips
- ✅ **Drag & Drop** - dnd-kit for sorting and reordering
- ✅ **Animations** - Framer Motion for smooth animations
- ✅ **Real-time Search** - Command palette with cmdk
- ✅ **Dark Mode Support** - Theme switching with Tailwind
- ✅ **Authentication** - Google OAuth & email/password login
- ✅ **File Upload** - Image upload with preview
- ✅ **Database Integration** - Supabase integration ready

---

## 🛠 Tech Stack

| Technology               | Version  | Purpose                 |
| ------------------------ | -------- | ----------------------- |
| **React**                | ^19.2.0  | UI library              |
| **TanStack Router**      | ^1.168.0 | Routing                 |
| **TanStack React Query** | ^5.83.0  | Server state management |
| **Vite**                 | Latest   | Build tool              |
| **Tailwind CSS**         | ^4.2.1   | Styling                 |
| **Radix UI**             | Latest   | Component library       |
| **React Hook Form**      | Latest   | Form management         |
| **TypeScript**           | Latest   | Type safety             |
| **Framer Motion**        | ^12.38.0 | Animations              |
| **jsPDF**                | ^4.2.1   | PDF generation          |
| **date-fns**             | ^4.1.0   | Date formatting         |
| **Supabase**             | Latest   | Backend/Database        |

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **Bun** (optional) - [Install](https://bun.sh/) for faster package management
- **Git** - [Download](https://git-scm.com/)

### Verify Installation:

```bash
node --version
npm --version
# Optional: bun --version
```

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/dhirendrasaithwar/payslip-pro.git
cd payslip-pro/payslip
```

### Step 2: Install Dependencies

Using npm:

```bash
npm install
```

Or using Bun (faster):

```bash
bun install
```

Or using yarn:

```bash
yarn install
```

---

## 🔐 Environment Setup

### Step 1: Create `.env.local` File

Create a `.env.local` file in the frontend root directory:

```bash
touch .env.local
```

### Step 2: Add Environment Variables

Copy and update the following template:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Supabase Configuration (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Feature Flags
VITE_ENABLE_SUPABASE=false
VITE_ENVIRONMENT=development

# API Timeout
VITE_API_TIMEOUT=30000
```

### Step 3: Get Your Credentials

#### **Backend API URL**

- Development: `http://localhost:5000`
- Production: Your backend deployment URL

#### **Google OAuth Client ID**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Go to "Credentials" → OAuth 2.0 Client IDs
4. Copy the Client ID for web application

#### **Supabase** (Optional)

1. Sign up at [Supabase](https://supabase.com/)
2. Create a project
3. Go to Settings → API
4. Copy URL and anon key

---

## 🚀 Running the Application

### Development Server

Using npm:

```bash
npm run dev
```

Using Bun:

```bash
bun dev
```

The application will start at `http://localhost:5173`

**Output:**

```
VITE v5.0.0  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Development Tips

- **Hot Module Replacement (HMR)** - Changes auto-refresh
- **React DevTools** - Use browser React extension
- **Vite Inspector** - Press `h` for help
- **Network Tab** - Monitor API calls

---

## 🏗️ Build & Deployment

### Build for Production

Using npm:

```bash
npm run build
```

Using Bun:

```bash
bun run build
```

Output files will be in the `dist/` directory.

### Preview Build Locally

```bash
npm run preview
```

Opens the production build locally for testing.

### Build for Development

```bash
npm run build:dev
```

### Build Options

| Command             | Purpose                      |
| ------------------- | ---------------------------- |
| `npm run build`     | Production build (optimized) |
| `npm run build:dev` | Development build            |
| `npm run preview`   | Preview production build     |

---

## 📚 Dependencies Overview

### UI Components & Styling

```
@radix-ui/react-*@^latest (30+ components)
├── accordion, alert-dialog, avatar, badge
├── button, calendar, card, carousel
├── checkbox, collapsible, command, dialog
├── dropdown-menu, form, hover-card, input
├── label, menubar, navigation-menu, pagination
├── popover, progress, radio-group, scroll-area
├── select, separator, sheet, sidebar
├── slider, switch, table, tabs, textarea
└── toggle-group, tooltip

tailwindcss@^4.2.1 (CSS framework)
clsx@^2.1.1 (Conditional classNames)
class-variance-authority@^0.7.1 (Component variants)
```

### Routing & Navigation

```
@tanstack/react-router@^1.168.0 (Type-safe router)
@tanstack/react-start@^1.167.14 (Meta framework)
@tanstack/router-plugin@^1.167.10 (Vite plugin)
```

### State Management & Data

```
@tanstack/react-query@^5.83.0 (Server state management)
date-fns@^4.1.0 (Date utilities)
```

### Forms & Validation

```
react-hook-form@latest (Form state management)
@hookform/resolvers@^5.2.2 (Validation resolvers)
zod (Schema validation - optional)
```

### Drag & Drop

```
@dnd-kit/core@^6.3.1 (Core drag & drop)
@dnd-kit/sortable@^10.0.0 (Sortable lists)
@dnd-kit/utilities@^3.2.2 (DnD utilities)
```

### Animations & Effects

```
framer-motion@^12.38.0 (Animation library)
embla-carousel-react@^8.6.0 (Carousel component)
```

### PDF & Document Generation

```
jspdf@^4.2.1 (PDF generation)
input-otp@^1.4.2 (OTP input component)
```

### Utilities

```
lucide-react@0.460.0 (Icon library)
cmdk@^1.1.1 (Command palette)
sonner (Toast notifications)
```

### Build & Deploy

```
@cloudflare/vite-plugin@^1.25.5 (Cloudflare Workers support)
@tailwindcss/vite@^4.2.1 (Tailwind integration)
```

---

## 📂 Project Structure

```
payslip/
├── src/
│   ├── router.tsx                # Main router configuration
│   ├── routeTree.gen.ts          # Auto-generated route tree
│   ├── styles.css                # Global styles
│   ├── routes/
│   │   ├── __root.tsx            # Root layout
│   │   ├── index.tsx             # Home page
│   │   ├── signin.tsx            # Sign in page
│   │   ├── create.tsx            # Create payslip page
│   │   ├── dashboard.tsx         # Dashboard
│   │   ├── history.tsx           # Payslip history
│   │   ├── templates.tsx         # Templates management
│   │   └── profile.tsx           # User profile
│   ├── components/
│   │   ├── ui/                   # Radix UI components (30+ files)
│   │   ├── landing/              # Landing page components
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── FloatingSignIn.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ... more landing components
│   │   └── dashboard/            # Dashboard components
│   │       ├── PayslipForm.tsx
│   │       ├── PayslipPreview.tsx
│   │       ├── pdf.ts
│   │       └── payslip-types.ts
│   ├── hooks/
│   │   ├── use-auth.ts           # Auth hooks
│   │   └── use-mobile.tsx        # Mobile detection
│   ├── lib/
│   │   ├── api.ts                # API client
│   │   ├── google.ts             # Google integration
│   │   └── utils.ts              # Utility functions
│   ├── integrations/
│   │   └── supabase/             # Supabase integration
│   └── public/                   # Static assets
├── supabase/
│   └── config.toml              # Supabase config
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
├── wrangler.jsonc               # Cloudflare config
├── eslint.config.js             # ESLint config
├── package.json                 # Dependencies
├── bun.lockb                    # Bun lock file
└── README.md                    # This file
```

---

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run dev --open   # Start and open in browser
```

### Build

```bash
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Package Management

```bash
npm install          # Install dependencies
npm update           # Update all packages
npm audit            # Check security vulnerabilities
npm audit fix        # Fix vulnerabilities
```

---

## 🔌 API Integration

### API Client Setup

The frontend uses axios for API calls (configured in `src/lib/api.ts`):

```typescript
// Example API call
import { api } from '@/lib/api'

// Get user profile
const response = await api.get('/auth/profile')

// Create payslip
const payslip = await api.post('/payslips/create', {
  name: 'Monthly Payslip',
  data: {...}
})
```

### Authentication Flow

1. User clicks "Sign In"
2. Google OAuth or Email/Password login
3. Backend returns JWT token
4. Token stored in localStorage
5. Token sent with API requests
6. Dashboard accessible

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js` or CSS variables in `src/styles.css`

### Add New Components

Use Radix UI as base:

```bash
# Components are in src/components/ui/
```

### Add New Routes

1. Create file in `src/routes/`
2. Use `createFileRoute()` from TanStack Router
3. Router auto-generates route tree

### Modify API Base URL

Update `.env.local`:

```env
VITE_API_URL=your_api_url
```

---

## 🐛 Troubleshooting

### Issue: Port 5173 Already in Use

**Error:** `error  EADDRINUSE: address already in use :::5173`

**Solution:**

```bash
# Use different port
npm run dev -- --port 5174
```

### Issue: API Connection Failed

**Error:** `Network request failed` or `CORS error`

**Solution:**

1. Ensure backend is running on correct port
2. Check `.env.local` `VITE_API_URL` matches backend
3. Verify CORS is enabled in backend
4. Check network tab for actual error

### Issue: Google OAuth Not Working

**Error:** `invalid_client` or `redirect_uri_mismatch`

**Solution:**

1. Verify `VITE_GOOGLE_CLIENT_ID` in `.env.local`
2. Check Google Cloud Console allowed redirect URIs
3. Add `http://localhost:5173` to allowed URIs
4. Check console for full error message

### Issue: Build Fails

**Error:** `TypeScript compilation error` or `Module not found`

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with Bun
bun install --force
```

### Issue: HMR Not Working

**Error:** Changes not reflecting in browser

**Solution:**

1. Check browser console for errors
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Check Vite config in `vite.config.ts`

### Issue: TypeScript Errors

**Error:** Type errors in IDE but builds fine

**Solution:**

```bash
# Restart TypeScript server in VSCode
# Ctrl+Shift+P → Restart TypeScript Server
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Drag dist/ to Netlify
```

### Deploy to Cloudflare Pages

```bash
# Already configured in wrangler.jsonc
npx wrangler pages deploy dist
```

### Environment Variables in Production

Set these in your deployment platform:

- `VITE_API_URL` - Production backend URL
- `VITE_GOOGLE_CLIENT_ID` - Production Google Client ID
- `VITE_SUPABASE_URL` - Production Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Production Supabase key

---

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting)
2. Review `.env.local` setup
3. Check backend is running
4. Verify API connectivity
5. Check browser console for errors

---

## 📄 License

This project is licensed under ISC License.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Last Updated:** May 2024  
**Version:** 1.0.0  
**Author:** Arun Chaudhary / Dhirendra Saithwar

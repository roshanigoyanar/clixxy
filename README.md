# CLIXY™ — Smart Link Tracker for Influencers

CLIXY is a premium, beautifully designed link tracking platform built for creators, influencers, and businesses. It doesn't just shorten your links; it gives you deep, real-time analytics on exactly who is clicking your links, providing total visibility over your audience growth.

![Clixy Dashboard](https://raw.githubusercontent.com/krishnarajodhiya/clixy/main/public/demo-assets/dashboard.png) *(Add a screenshot here if desired)*

## 🚀 Key Features

- **Blazing Fast Redirects**: Clixy provides seamless global redirection with virtually zero delay for the end user.
- **Deep Analytics**: Track exactly where your audience is coming from.
  - **Platform attribution**: Accurately tracks traffic sources from Instagram, TikTok, YouTube, Telegram, WhatsApp, Snapchat, Twitter, and more. Advanced parsing accurately catches bot-previews (like Telegram's preview bot) and counts them correctly.
  - **Device recognition**: See what percentage of your users check links on Mobile, Desktop, or Tablet.
  - **Global Geography**: See the exact country your clicks originate from.
- **Real-time Dashboard Metrics**: Includes visual charts (via Recharts), recent links performance, and sleek summary statistics.
- **Modern Authentication Flow**: 
  - Complete Login, Signup, and Password Reset functionality natively powered by Supabase.
  - "Remember Me" capabilities.
  - Built-in ISP Block Bypass proxy so authentication consistently works everywhere without silently failing.
  - OTP and Magic Link support that seamlessly works precisely correctly even across entirely different browsers or cross-device flows.
- **Premium Aesthetics**: 
  - Neo-brutalist inspired aesthetics with elegant soft-shadow cards (`bg-surface`).
  - Smooth micro-animations and intuitive hover responsive states on buttons and forms.
  - Light mode (default) and full Dark Mode fully supported with fluid transition scaling toggle.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + Custom CSS Variables for Theming (`next-themes`)
- **Backend / Database**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React + React Icons 
- **Charts**: Recharts
- **Hosting**: Vercel

## 💻 Getting Started

You will need a Supabase backend to run Clixy locally.

1. Clone this repository
```bash
git clone https://github.com/krishnarajodhiya/clixy.git
cd clixy
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file at the root of the project with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app!

## 🔐 Notes on Auth Proxy
In environments or specific countries where ISPs intentionally block default Supabase subdomains (`*.supabase.co`), Clixy uses an elegant built-in Next.js Rewrite rule (`next.config.ts`) to securely proxy `yourwebsite.com/api/supabase` directly to your backend, fixing email verification workflows that would normally throw DNS failures.
# clixxy
# clixxy
# clixxy

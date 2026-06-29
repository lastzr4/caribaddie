# CariBuddy — Setup Guide

## 1. Install dependencies
```bash
npm install
```

## 2. Setup environment variables
```bash
cp .env.example .env.local
```
Isi nilai dalam `.env.local` dari Supabase dashboard.

## 3. Setup Supabase
- Pergi ke Supabase dashboard → Authentication → Providers → Phone (enable, guna Twilio atau built-in OTP)
- Jalankan SQL schema (lihat `supabase/schema.sql` — akan dibuat seterusnya)
- Copy URL dan anon key ke `.env.local`

## 4. Generate VAPID keys (untuk push notification)
```bash
npx web-push generate-vapid-keys
```
Copy keys ke `.env.local`.

## 5. Run development server
```bash
npm run dev
```
Buka http://localhost:3000

## 6. Deploy ke Railway
```bash
git add .
git commit -m "feat: initial CariBuddy scaffold"
git push
```
Railway auto-deploy bila push ke main branch.

Set environment variables di Railway dashboard → Variables (sama macam `.env.local`).

## Folder Structure
```
app/
├── (main)/          ← Pages yang perlukan auth (ada BottomNav)
│   ├── discover/    ← Swipe page
│   ├── matches/     ← Senarai matches
│   ├── chat/        ← Chat list
│   └── profile/     ← Profil user
├── auth/
│   └── login/       ← Phone OTP login
└── page.tsx         ← Redirect ke /discover atau /auth/login

components/
├── discover/        ← SwipeCard, ActivityFilter
└── shared/          ← BottomNav, InstallPrompt, Providers

lib/
├── supabase/        ← client.ts, server.ts
├── store/           ← Zustand stores
└── utils.ts

types/               ← TypeScript types + Database types
```

## Next Steps
1. Buat Supabase schema (tables: profiles, activities, matches, messages)
2. Connect SwipeCard dengan real data dari Supabase
3. Implement realtime chat via Supabase Realtime
4. Add PWA icons (192x192, 512x512) ke /public/icons/

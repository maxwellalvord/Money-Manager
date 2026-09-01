# Money Manager — Mobile (Expo)

Native iOS/Android client for Money Manager, built to get the app onto the App Store as a real native app rather than a wrapped webview (Apple's App Review tends to reject bare webview wrappers under Guideline 4.2). This was built on Windows, where the iOS Simulator can't run — **this document is the handoff to continue on a Mac.**

The web app (`../app`, `../utils`) is untouched and still fully functional. This is purely additive.

## Status: code-complete, never run

Everything type-checks (`npx tsc --noEmit`) and bundles cleanly for iOS (`npx expo export --platform ios` — 2228 modules, zero errors), but **nothing has been visually verified or run on a device/simulator yet**, since that requires macOS. That's the very first thing to do here.

## Architecture

```
money-manager/
  app/api/v1/*          NEW — REST wrappers around app/actions/*, so this
                         mobile app can call the same business logic the web
                         app's Server Actions use. No logic was duplicated —
                         each route just calls the existing action function.
  mobile/                This app.
```

- **Auth**: `@clerk/clerk-expo`, same Clerk instance/publishable key as the web app — accounts are shared.
- **Data**: `@tanstack/react-query` + a small typed fetch client (`src/lib/api.ts`) that attaches the Clerk session token as `Authorization: Bearer <token>` to every request. This works against `app/api/v1/*` with **no backend auth changes** — Clerk's Next.js SDK accepts Bearer tokens for cross-origin/native callers out of the box (confirmed against Clerk's docs before building).
- **Styling**: NativeWind (Tailwind for RN) — same utility classes as the web app.
- **Navigation**: expo-router with native tabs (Dashboard / Budgets / Expenses / Settings) and a nested stack for Budgets → Budget detail.
- **Charts/Calendar**: `react-native-gifted-charts` (bar chart on Dashboard, pie chart on Expenses) and `react-native-calendars` (Budget Calendar with due-date dots).

## Setup on the Mac

1. **Get the backend running locally** — in the repo root: `npm install && npm run dev` (needs `../.env.local`, already in the repo). The mobile app talks to this over HTTP; nothing works without it running.
2. **Install mobile deps**: `cd mobile && npm install`
3. **Environment**: `cp .env.example .env.local` and fill in:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bWVycnktbmV3dC0xMy5jbGVyay5hY2NvdW50cy5kZXYk
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```
   (`.env.local` is gitignored, so this file won't exist after a fresh clone — recreate it. The publishable key is public/safe; it's the same one already in `../.env.local` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.) `localhost` works for the iOS Simulator specifically because it shares the host machine's network — a physical device would need your Mac's LAN IP instead.
4. **Run it**: `npx expo run:ios` (needs Xcode). This is a dev-client build, not Expo Go — Clerk's native modules require it.

## What to actually do first

1. Run it, sign up a test account (email/password — that works with zero extra config), and walk the golden path: set monthly budget → create a budget → add an expense → see it reflected on the Dashboard.
2. Fix whatever layout/interaction bugs show up — this is genuinely untested UI. Likely suspects: `NativeTabs` icon rendering (SF Symbols were guessed by name, e.g. `chart.pie.fill` — verify they render), modal keyboard behavior, the budget calendar's date math near month boundaries.
3. Exercise the rest: recurring expenses, savings goals/transfers, the month-end "period ended" prompt (easiest to test by temporarily setting a `budgetEndDay` in the past via Settings), monthly statement.

## Still open — Phase 5 (Apple/Google dashboard config, not code)

- **Sign in with Apple**: code is in `src/app/sign-in.tsx` (`useSignInWithApple`), but Apple **requires** this if Google sign-in is offered (Guideline 4.8) — check the Clerk Dashboard for which social providers are actually enabled on this instance and register the native app's bundle ID with Clerk before this will work.
- **Google sign-in**: code is there (`useSSO`), needs Google Cloud Console OAuth client IDs for iOS added to `.env.local` (`EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID` etc.) and registered in Clerk.
- **Apple Developer Program**: enroll (or confirm already enrolled), register a bundle identifier, replace the placeholder `app.json` `name`/`slug`/bundle id with real values.
- **App Store Connect assets**: 1024×1024 icon, screenshots, privacy policy URL, App Privacy "nutrition label" (discloses: email via Clerk, budget/financial data — both tied to user identity).
- **EAS Build/Submit**: set up `eas.json` for cloud builds → TestFlight → App Store submission.

## Known gaps / deliberate simplifications

- **Donate/PayPal is intentionally not in the mobile app** — stays web-only, to avoid Apple's in-app purchase rules around payment flows.
- **Emoji picker** is a fixed preset row instead of a full picker (no good native emoji-picker library was worth pulling in for this).
- **Budget calendar** shows one month at a time (swipeable) instead of the web's current/next/split three-way toggle — same underlying data (due-date dots, period-end highlight), simpler UI.
- Found but didn't fix (pre-existing web bug, touches shared backend logic): `createSettings` in `../app/actions/settings.js` silently drops the `savingsGoal` field even though the onboarding wizard collects it.

## Where things live

- `src/app/` — screens (expo-router file-based routing)
- `src/components/` — feature components (one file per web-app component it mirrors, e.g. `savings-transfer.tsx` ports `SavingsTransfer.jsx`)
- `src/components/ui/` — generic primitives (Button, TextField, FormModal, Card)
- `src/hooks/` — React Query hooks, one file per `app/actions/*.js` file they call through `app/api/v1/*`
- `src/lib/api.ts` — the Bearer-token fetch client
- `src/lib/types.ts` — TS types mirroring `../utils/schema.jsx`

# BDpedia — Full-Stack Setup Guide (Admin + Auth + Guide Budget Planner)

This document explains how each of the requested features works, how to run
everything locally, and how to deploy it — step by step.

---

## 0. Project Structure

```
BDpedia/
├── backend/              <- NEW: Express + MongoDB + Cloudinary API server
│   ├── models/           (User, District, Place, River, Culture, Blog, HistoryItem, GalleryItem, HomeContent)
│   ├── routes/           (auth, home, guide + generic CRUD per section)
│   ├── middleware/        (Firebase auth verification, admin-only guard, multer upload)
│   ├── config/firebaseAdmin.js  <- verifies Firebase ID tokens sent by the frontend
│   ├── scripts/
│   │   ├── seedFromJson.js   <- migrates your existing static JSON into MongoDB
│   │   └── makeAdmin.js      <- promotes an existing user to admin (no separate admin login)
│   └── server.js
├── src/                  <- EXISTING frontend, only additive changes made
│   ├── lib/api.ts, lib/contentApi.ts      <- fetch wrapper + backend data adapters
│   ├── lib/firebase.ts   <- Firebase client SDK init (Email/Password + Google)
│   ├── context/AuthContext.tsx
│   ├── components/ (GuestPreviewWrapper, GoogleLoginButton, AuthNavItem, ProtectedRoute, BudgetPlanner)
│   ├── pages/Login.tsx, Register.tsx, Profile.tsx
│   └── pages/admin/       <- Admin panel (generic CRUD manager for every section)
└── ... (rest of your original frontend, untouched)
```

**Nothing in your original design/content was removed.** Existing pages were only
wired to fetch from the new backend instead of the local JSON files (Districts,
Explore/Places, Rivers, Blog, Home hero video); Gallery/Culture/History (which
had no JSON data to begin with — fully hardcoded) got a new "admin added"
section appended below the existing content, so nothing there was disturbed either.

---

## 1. Accounts you'll need (all free tier is enough)

1. **MongoDB Atlas** — https://www.mongodb.com/cloud/atlas → create a free
   cluster → get your connection string (`MONGO_URI`).
2. **Cloudinary** — https://cloudinary.com → dashboard gives you
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. **Firebase** (auth is now fully handled by Firebase — feature #3) —
   https://console.firebase.google.com → **Add project** (free "Spark" plan
   is enough).
   - **Authentication → Sign-in method** → enable **Email/Password** and
     **Google**.
   - **Project settings → General → Your apps → Add app → Web app** → copy
     the config object; these are your `VITE_FIREBASE_*` values for the
     frontend `.env`.
   - **Project settings → Service accounts → Generate new private key** →
     downloads a JSON file with `project_id`, `client_email`, `private_key`;
     these are your `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`,
     `FIREBASE_PRIVATE_KEY` for the backend `.env`.
   - **Authentication → Settings → Authorized domains** → add
     `localhost` (usually already there) and later your production domain
     (e.g. your Vercel domain).

---

## 2. Backend setup (local)

```bash
cd backend
cp .env.example .env
# now open .env and fill in: MONGO_URI, CLOUDINARY_*, CLIENT_URL=http://localhost:5173,
# and the three FIREBASE_* values from the service-account JSON you downloaded above

npm install
npm run seed          # migrates your existing districts/places/rivers/blogs JSON into MongoDB
npm run dev           # starts the API on http://localhost:5000
```

Health check: open http://localhost:5000/api/health → should show `{"ok":true}`.

---

## 3. Frontend setup (local)

```bash
cd ..   # project root (BDpedia/)
cp .env.example .env
# fill in VITE_API_URL=http://localhost:5000/api
# and the six VITE_FIREBASE_* values from the Firebase web app config

npm install
npm run dev            # your existing Vite dev server, now talking to the backend
```

---

## 4. Becoming admin (feature #5 — no separate admin login)

1. On the running site, go to **/register** and create a normal account with
   the email you want to be admin (email/password, or Google sign-in).
2. In VS Code terminal:
   ```bash
   cd backend
   npm run make-admin -- youremail@example.com
   ```
3. Log out and log back in (or just refresh) at **/login** with that same
   account → you'll see an **Admin Panel** link in the profile menu, and
   going to **/admin** now shows the full CRUD dashboard for every section.

Google sign-in users can be promoted the same way — sign in with Google
first (so the user document exists), then run the same `make-admin` command
against that email.

---

## 5. Feature-by-feature checklist (matches what you asked for)

| # | Feature | Where |
|---|---|---|
| 1 | Admin panel: add/edit/delete pictures + add new fields, for every section | `/admin` → left sidebar (Home, Explore, Districts, Blog, Rivers, Culture, Gallery, History) |
| 2 | Simple user login + Google sign-in (via Firebase Auth), edit district/password/picture | `/login`, `/register`, `/profile` |
| 3 | Guests see a partial/blurred preview, "Show more" → login | Every content page is wrapped with `GuestPreviewWrapper` |
| 4 | MongoDB backend | `backend/models/*`, `backend/config/db.js` |
| 5 | No separate admin login — promote via VS Code script | `backend/scripts/makeAdmin.js` |
| 6 | Cloudinary storage, auto-convert to WebP, home page video upload | `backend/utils/cloudinaryUpload.js`, `/admin` → Home Page → Hero Video |
| 7 | Run locally as admin, then deploy | See section 6 below |
| 8 | Guide: budget-based district/day-count suggestion | `/guide` page → "Budget Travel Planner" section |

---

## 6. Deploying

Vercel is built for static/serverless frontends — it is **not** a good fit for
a long-running Express server, so the recommended split is:

- **Frontend → Vercel** (as you already planned)
- **Backend → Render.com / Railway.app / Fly.io** (any of these have a
  generous free tier and support a plain Node/Express app with no code changes)

### Backend (example: Render.com)
1. Push this whole repo to GitHub.
2. On Render: New → Web Service → connect your repo → **Root Directory: `backend`**
3. Build command: `npm install` · Start command: `npm start`
4. Add all the `backend/.env` variables in Render's Environment tab
   (use your **production** MongoDB URI, Cloudinary keys, the three
   `FIREBASE_*` service-account values, and set `CLIENT_URL` to your future
   Vercel URL).
5. Deploy → copy the resulting URL, e.g. `https://bdpedia-api.onrender.com`.

### Frontend (Vercel)
1. On Vercel: New Project → import the same repo → Root Directory: `/` (the
   existing frontend root — unchanged).
2. Add Environment Variables:
   - `VITE_API_URL = https://bdpedia-api.onrender.com/api`
   - the six `VITE_FIREBASE_*` values from your Firebase web app config
3. Deploy. Then go back to Firebase Console → Authentication → Settings →
   Authorized domains → add your Vercel domain.
4. Go back to Render → update `CLIENT_URL` to your final Vercel domain
   (used for CORS) → redeploy the backend.

### Git push
```bash
git add .
git commit -m "Add full-stack admin, auth, cloudinary, and budget guide feature"
git push
```
(Vercel/Render auto-redeploy on push if you connected the GitHub repo.)

---

## 7. Honest limitations / please verify before relying on this

- This round of changes (Privacy Policy & Terms pages, district page redesign,
  the Firebase auth migration, Banglish fixes, and the home page additions)
  was verified with `npm install`, `npx tsc --noEmit`, and a full
  `npm run build` on both the frontend and backend — all pass cleanly. I still
  couldn't test against a **real** Firebase project or MongoDB Atlas cluster
  in this environment, so please run through the login/register/Google
  sign-in flow yourself once your `.env` files are filled in, and let me know
  if anything throws.
- **Gallery / Culture / History** pages originally had no real data behind
  them (fully hardcoded demo content) — admin-added items now appear in a
  new section on those pages rather than replacing the hardcoded showcase,
  so the pages don't look "empty" on day one.
- The **Guide budget planner**'s transport-cost estimate is a rule-based
  heuristic (approximate division-to-division distances × an average bus
  fare) — not live pricing/route data. It's deterministic and explainable,
  but treat the numbers as a rough estimate, not a booking quote.
- Home page **headline text** is still the original hardcoded hero text
  (kept as-is because it's styled across multiple `<br/>` line breaks); only
  the **hero video** is wired to the admin upload. Say the word if you'd
  like the headline made editable too.

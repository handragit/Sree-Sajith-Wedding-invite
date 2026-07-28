# Sree & Sajith — Wedding Invitation

Next.js wedding invitation for 14 December 2026 in Thrissur, Kerala. Guest-facing content is centralised in `src/data/wedding.ts`.

## Local development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

## RSVP persistence with Neon Free PostgreSQL

The guest browser submits only to the server-side `POST /api/rsvp` route. It validates the response and uses the official Neon serverless driver with a parameterised insert. There is no public RSVP read/list route.

1. Create a free project at [Neon](https://console.neon.tech/) in a region close to the Vercel deployment.
2. Open **Connect** in Neon, select the pooled/serverless connection option, and copy its connection string.
3. In the existing Vercel project, open **Settings → Environment Variables**. Add `DATABASE_URL` and paste the pooled connection string. Never name it `NEXT_PUBLIC_DATABASE_URL`.
4. Open Neon’s SQL Editor and run [`db/migrations/001_create_rsvps.sql`](db/migrations/001_create_rsvps.sql) once.
5. Redeploy the existing Vercel project from its production branch. The build command remains `npm run build`.
6. Open the production invitation and send one clearly identifiable test RSVP. Confirm that the website reports it as saved.
7. Privately confirm the record in Neon:

   ```sql
   SELECT id, guest_name, attendance_status, events, guest_count, created_at
   FROM rsvps
   ORDER BY created_at DESC
   LIMIT 10;
   ```

   Delete the test row privately if desired. Do not add a public RSVP-reading route.

Without `DATABASE_URL`, the API deliberately returns HTTP 503 and the page says that the response was not saved. `.env.example` contains only the variable name; real credentials belong only in local and Vercel environment settings.

## Spam and duplicate protection

- A honeypot absorbs basic bots.
- Server-side validation is backed by PostgreSQL constraints.
- An in-memory request window limits bursts. It is supplemental and instance-local; serverless instances do not share memory.
- A unique SHA-256 submission hash includes a ten-minute time bucket, providing durable database-level duplicate protection while allowing a later correction.

## Commands

- `npm run lint` — ESLint.
- `npm run typecheck` — TypeScript.
- `npm run build` — Vercel production build with the RSVP API.
- `npm run build:sites` — preserved static Sites package. Static hosting cannot persist responses, so the contact fallback remains available.

The evening reception calendar action remains intentionally absent until its real time and venue are confirmed.

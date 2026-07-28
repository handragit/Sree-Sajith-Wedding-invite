# Sree & Sajith — Wedding Invitation

Next.js 16 wedding invitation for 14 December 2026 in Thrissur, Kerala. All guest-facing content is centralised in `src/data/wedding.ts`.

## Local development

```bash
npm install
npm run dev
```

## RSVP storage

The form submits to `/api/rsvp`. On Vercel, connect an Upstash Redis database and provide:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Responses are stored in the private Redis list `wedding:rsvps`. Without both variables, the API deliberately returns `503`; the website tells guests that their response was not saved and offers WhatsApp/email. No client-side secret is used.

## Builds and deployment

- `npm run build` — full Next.js/Vercel build, including the RSVP API route.
- `npm run build:sites` — static export plus the existing `dist` worker package. Static hosting cannot persist RSVP data, so contact fallback remains available.
- Vercel: push the repository or run `vercel --prod`; use the normal `npm run build` command and configure the two environment variables above.

The evening reception calendar action remains intentionally absent until its real time and venue are confirmed.

# ChakraUI Excel Library Comparison

A comparison sandbox for evaluating spreadsheet and data grid libraries built with Chakra UI on top of a shared sales-order dataset.

## Features

- Next.js 15 App Router
- Chakra UI 3
- Cloudflare Workers via OpenNext
- D1-backed sales-order dataset
- Multiple table/grid implementations rendered against the same data

## Getting Started

```bash
git clone https://github.com/lilpacy/chakraui-excel-library-comparison.git
cd chakraui-excel-library-comparison
npm install
cp .env.example .env.local
```

Update `.env.local`:

- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` if you use GA

## Cloudflare Resources

Create the D1 databases:

```bash
npm run db:create
npm run db:create:preview
```

Create the OpenNext incremental cache buckets:

```bash
npm run storage:create:cache
npm run storage:create:cache:preview
```

Then update `wrangler.jsonc` with your real database IDs and production base URL.

## Development

```bash
npm run db:migrate:local
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run type-check`
- `npm run deploy`
- `npm run deploy:preview`
- `npm run db:migrate:local`
- `npm run db:migrate:prod`

## Project Shape

- `app/` public UI and table comparisons
- `app/actions/sales-orders.ts` server actions for sales-order mutations
- `lib/db/` Drizzle schema and database access
- `drizzle/` SQL migrations
- `wrangler.jsonc` Cloudflare bindings

## Notes

- The app no longer includes authentication, login routes, profile pages, or todo examples.
- OpenNext uses R2 only for incremental cache in the current setup.

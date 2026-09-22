# Rao Stone Traders (راؤ اسٹون ٹریڈرز)

Production-ready MERN web store for stone crushing and construction materials in Sargodha, Punjab.

## Stack

- MongoDB + Mongoose (with in-memory mock fallback)
- Express.js REST API
- React 18 + Vite
- Tailwind CSS + Lucide React icons

## Setup

```bash
npm run install:all
npm run seed
npm run dev:server
npm run dev:client
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:5000 |

## Admin

- URL: `/login` → redirects to `/admin`
- Username: `admin`
- Password: `admin123`

## Resilience

If MongoDB is unavailable, the server continues running and serves the pre-loaded mock catalog from memory. Check `/api/health` for `database: "connected"` or `"mock"`.

## Features

- Stone catalog with WhatsApp ordering
- Punjab freight estimator (live PKR quotes)
- Cart checkout with WhatsApp invoice to Rao Afzal
- Order tracking by ID
- Admin dashboard with metrics, inventory CRUD, order status management

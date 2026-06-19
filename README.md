# PayFlowX Dashboard

PayFlowX is a React + TypeScript payment dashboard with polished UX states and API integration.

## What Is Completed

- Loading states across dashboard, tables, forms, and details views
- Error handling with reusable error UI and retry actions
- Toast notifications for success, warning, and error events
- Empty states across payments/search/dashboard surfaces
- Responsive design with mobile drawer navigation and adaptive page layouts
- Frontend integration documentation
- Screenshot assets and screenshot guide

## Project Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Environment Variable

Create .env in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Documentation

- Frontend guide: FRONTEND.md
- Screenshots guide: SCREENSHOTS.md

## Main Routes

- / : Dashboard
- /payments : Payments list
- /payments/:id : Payment details
- /create-payment : Create payment
- /payment-search : Search payment by reference

# PayFlowX Frontend Guide

This document describes the complete frontend integration for the payment dashboard.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Axios
- React Toastify

## Implemented Polish

### Loading States

- Dashboard stat skeleton cards during initial load
- Payments table skeleton rows during API fetch
- Search and form action buttons show spinner states
- Payment details page has a dedicated loading panel

### Error Messages

- Shared error component for consistent failure presentation
- Page-level errors for Payments and Payment Details
- Validation errors in Create Payment form
- Inline search failure errors in Payment Search

### Toast Notifications

- Success toasts for completed operations
- Warning toasts for validation guidance
- Error toasts for API/network failures
- Toast container tuned for mobile and desktop behavior

### Empty States

- Shared empty-state component used across pages
- Payments page supports both:
  - no-data empty state
  - no-match filtered empty state
- Payment Search has a dedicated initial empty state
- Dashboard transaction area handles empty transaction lists

### Responsive Design

- Mobile-first shell with drawer sidebar
- Header includes mobile menu trigger
- Desktop sidebar remains fixed
- Payments page has desktop table and mobile card layout
- Search/forms/actions stack cleanly on small screens
- Global page spacing reduced on mobile and expanded on larger breakpoints

## Key Files

- src/components/Layout.tsx
- src/components/Header.tsx
- src/components/Sidebar.tsx
- src/components/ui/LoadingState.tsx
- src/components/ui/ErrorState.tsx
- src/components/ui/EmptyState.tsx
- src/pages/Payments.tsx
- src/pages/PaymentDetails.tsx
- src/pages/CreatePayment.tsx
- src/pages/PaymentSearch.tsx
- src/pages/Dashboard.tsx
- src/App.tsx

## Frontend Runbook

1. Install dependencies:

```bash
npm install
```

2. Create .env file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Start dev server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Run lint:

```bash
npm run lint
```

## Screenshots

See SCREENSHOTS.md for screenshot previews and mapping.

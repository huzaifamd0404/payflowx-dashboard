# PayFlowX Dashboard - Frontend Documentation

Modern payment processing dashboard built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework with responsive design
- **React Router 7** - Client-side routing and navigation
- **Axios** - Promise-based HTTP client
- **Heroicons** - Beautiful, hand-crafted SVG icons
- **React Toastify** - Toast notifications for user feedback

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.tsx      # Main layout wrapper with sidebar and header
│   ├── Sidebar.tsx     # Navigation sidebar with links
│   └── Header.tsx      # Top header bar with branding
├── pages/
│   ├── Dashboard.tsx        # Overview dashboard with stats and recent activity
│   ├── Payments.tsx         # Payments list with filters and search
│   ├── PaymentDetails.tsx   # Detailed view of a payment
│   ├── CreatePayment.tsx    # Payment creation form
│   └── PaymentSearch.tsx    # Payment search by reference
├── services/
│   └── api.ts         # Axios client and API endpoints
├── types/
│   └── index.ts       # TypeScript interfaces and types
├── utils/
│   └── helpers.ts     # Utility functions (formatting, date handling)
├── App.tsx            # Main app component with routing and toast provider
├── main.tsx           # Vite entry point
└── index.css          # Global styles
```

## 🎯 Key Features

### 1. **Loading States**
- Skeleton loading animations on Dashboard stats cards
- Loading indicators on table rows during data fetch
- Loading spinners on action buttons
- Better UX with clear loading feedback

### 2. **Error Handling**
- Error messages displayed in dedicated error cards
- Toast notifications for error events (4s duration)
- Retry buttons in error states
- Contextual error messages from API responses

### 3. **Toast Notifications**
- Success notifications when data loads (2-3s duration)
- Error notifications for failed operations (4s duration)
- Info notifications for empty states
- Warning notifications for user inputs
- Auto-dismiss with manual close option
- Positioned at top-right of screen

### 4. **Empty States**
- **Dashboard**: Empty state message when no recent transactions
- **Payments**: Empty state with icon, message, and action button
- **Payment Search**: Contextual empty message
- All empty states with helpful guidance and CTAs

### 5. **Responsive Design**
- Mobile-first approach with Tailwind breakpoints
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- Flexible grid layouts (1 col mobile → 4 cols desktop)
- Responsive tables with horizontal scroll on mobile
- Touch-friendly buttons and inputs
- Adaptive sidebar (collapsible on mobile ready)

### 6. **Pages & Components**

#### Dashboard (`/`)
- **Stats Cards**: Total Revenue, Successful Payments, Pending, Failed
- **Loading State**: Skeleton cards while loading
- **Error State**: Retry option on failure
- **Recent Transactions**: Table with status badges
- **Responsive**: 1 column mobile → 2 columns tablet → 4 columns desktop
- **Features**:
  - Color-coded status indicators
  - Trending indicators (up/down)
  - Empty state when no transactions

#### Payments (`/payments`)
- **Table Display**: Full payment history with all details
- **Columns**: Reference, Customer ID, Merchant ID, Amount, Currency, Status, Created Date
- **Filters**: Status dropdown (All, SUCCESS, FAILED, PROCESSING, RETRYING)
- **Search**: Search by reference, customer ID, or merchant ID
- **Status Badges**: Color-coded (Green=Success, Red=Failed, Blue=Processing, Amber=Retrying)
- **Loading**: Skeleton rows while fetching
- **Error**: Error message with action to retry
- **Empty**: Helpful message with create payment button
- **Toast Notifications**:
  - Success when payments load
  - Info when no payments found
  - Error on API failures
- **Pagination**: Previous/Next buttons (mock)

#### Payment Details (`/payments/:id`)
- **Transaction Info**: Transaction ID, gateway, processing time
- **Customer Info**: Name, email, phone, address
- **Payment Method**: Type, brand, card last 4
- **Billing**: Subtotal, tax, fee, total
- **Timeline**: Payment status history
- **Status Badge**: Color-coded status display
- **Navigation**: Back button to payments list

#### Create Payment (`/create-payment`)
- **Form Fields**: Customer ID, Merchant ID, Amount, Currency
- **Validation**: Input validation with error messages
- **Submit**: Create payment button with loading state
- **Response**: Success/error toast notification
- **Responsive**: Full-width form on mobile, centered on desktop

#### Payment Search (`/payment-search`)
- **Search Input**: Reference number with icon
- **Search Action**: Form submission with validation
- **Loading State**: Spinning icon and "Searching..." text
- **Error Handling**: 
  - 404: "Payment not found" message
  - Other errors: Error message from API
- **Results**: Detailed payment info in grid layout
- **Status Badge**: Color-coded with icon
- **Clear Button**: Reset search when showing results
- **Toast Notifications**: Success/error feedback

## 🎨 UI/UX Features

### Color System
- **Success (Green)**: `#10b981` - SUCCESS status
- **Error (Red)**: `#ef4444` - FAILED status
- **Processing (Blue)**: `#3b82f6` - PROCESSING status
- **Warning (Amber)**: `#f59e0b` - RETRYING status

### Typography
- **Headings**: Bold, 3xl on pages, lg on sections
- **Labels**: Medium gray, uppercase on tables
- **Body Text**: Regular gray, readable sizes
- **Emphasis**: Font-semibold for important values

### Spacing & Layout
- **Consistent Gaps**: 6 units between major sections
- **Card Padding**: 6 units (1.5rem)
- **Responsive Padding**: Increased on desktop, reasonable on mobile
- **Grid Gaps**: 6 units between items

### Interactive Elements
- **Buttons**: 
  - Primary: Blue background with hover effect
  - Secondary: Gray border with hover
  - Disabled: Opacity 70%, not-allowed cursor
- **Inputs**: 
  - Border on focus with blue ring
  - Rounded corners
  - Appropriate padding
- **Dropdowns**: Native select with styled appearance
- **Links**: Inline with hover effect

## 🔧 Setup & Installation

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file (.env):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

6. **Lint code:**
   ```bash
   npm run lint
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
- Hot module replacement (HMR)
- Source maps for debugging
- Fast refresh on file changes

### Production Build
```bash
npm run build
```
- TypeScript compilation check
- Vite bundling and optimization
- Minified output in `dist/`

## 📱 Responsive Breakpoints

| Device | Width | Breakpoint | Columns |
|--------|-------|------------|---------|
| Mobile | 320-639px | Default | 1 |
| Tablet | 640-1023px | `sm:` | 2 |
| Desktop | 1024-1535px | `lg:` | 3-4 |
| Wide | 1536px+ | `xl:` | Full |

## 🎯 User Experience Highlights

### Loading Feedback
- Skeleton screens on initial load
- Loading spinners on buttons
- Clear "Loading..." messages
- Animated pulse effect

### Error Recovery
- Friendly error messages
- Retry buttons on failures
- Toast notifications for errors
- Contextual guidance

### Success Feedback
- Toast notifications (2-4s auto-dismiss)
- Success messages with action count
- Visual feedback on interactions

### Empty States
- Helpful empty state icons
- Contextual messaging
- Action buttons to create/search
- No confusing blank screens

## 🔗 API Integration

### Base URL Configuration
```javascript
// Reads from VITE_API_BASE_URL or defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### Endpoints Used
- `GET /api/payments` - List all payments
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/:reference` - Search by reference
- `POST /api/payments` - Create new payment
- `PATCH /api/payments/:id/status` - Update status
- `POST /api/payments/:id/refund` - Refund payment
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/transactions` - Recent transactions

### Error Handling
- 401: Redirect to login, clear auth token
- 404: "Not found" message
- 5xx: Generic error message with retry option
- Network errors: User-friendly error toast

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.1",
    "axios": "^1.16.1",
    "@heroicons/react": "^2.2.0",
    "react-toastify": "^10.0.3"
  }
}
```

## 🛠️ Development Guidelines

### Component Structure
- Functional components with hooks
- Custom hooks for reusable logic
- Props for configuration
- TypeScript interfaces for type safety

### State Management
- React hooks (useState, useEffect, useMemo)
- useEffect for data fetching
- useMemo for expensive computations
- Local component state (no global state needed currently)

### Styling
- Tailwind CSS utility classes
- Responsive modifiers
- Dark mode ready (theme support available)
- CSS modules for component-specific styles (if needed)

### Code Organization
- One component per file
- Exports at bottom of file
- Imports at top
- Clear prop destructuring
- Comments on complex logic

## 📸 Screenshots & Demo

See [SCREENSHOTS.md](SCREENSHOTS.md) for UI screenshots and feature demonstrations.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test responsiveness on mobile/tablet/desktop
4. Add toast notifications for user feedback
5. Test error states and loading states
6. Submit pull request

## 📝 License

Proprietary - PayFlowX Dashboard

## 🔗 Related Files

- [README.md](README.md) - Project overview
- [SCREENSHOTS.md](SCREENSHOTS.md) - UI screenshots
- [package.json](package.json) - Dependencies
- [tailwind.config.js](tailwind.config.js) - Tailwind configuration
- [vite.config.ts](vite.config.ts) - Vite configuration

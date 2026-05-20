# PayFlowX Dashboard - Frontend

Modern payment processing dashboard built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Heroicons** - Icons

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Layout.tsx    # Main layout with sidebar and header
│   ├── Sidebar.tsx   # Navigation sidebar
│   └── Header.tsx    # Top header bar
├── pages/            # Page components
│   ├── Dashboard.tsx      # Dashboard page
│   ├── Payments.tsx       # Payments list page
│   └── PaymentDetails.tsx # Payment details page
├── services/         # API services
│   └── api.ts       # API client and endpoints
├── types/           # TypeScript type definitions
│   └── index.ts     # Payment and dashboard types
├── utils/           # Utility functions
│   └── helpers.ts   # Helper functions
├── App.tsx          # Main app component with routing
└── main.tsx         # Application entry point
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your configuration:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📄 Available Pages

- **Dashboard** (`/`) - Overview with stats and recent transactions
- **Payments** (`/payments`) - List of all payments with filters
- **Payment Details** (`/payments/:id`) - Detailed view of a specific payment

## 🔌 API Integration

The app is configured to connect to a Spring Boot backend at `http://localhost:8080/api` by default. Update the `VITE_API_BASE_URL` environment variable to point to your backend.

### API Endpoints Used

- `GET /payments` - Get all payments
- `GET /payments/:id` - Get payment by ID
- `POST /payments` - Create new payment
- `PATCH /payments/:id/status` - Update payment status
- `POST /payments/:id/refund` - Refund payment
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/transactions` - Get recent transactions

## 🎨 Features

- ✅ Responsive design
- ✅ Dark mode support (via system preferences)
- ✅ Real-time search and filtering
- ✅ Payment status tracking
- ✅ Transaction timeline
- ✅ Export functionality
- ✅ Type-safe API calls

## 📦 Key Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "@heroicons/react": "^2.x",
  "tailwindcss": "^4.x"
}
```

## 🔧 Development Tips

1. **Hot Module Replacement (HMR)** is enabled by default
2. **TypeScript** checking runs on build
3. **Tailwind CSS** classes are purged in production
4. **API calls** use interceptors for auth token injection

## 📝 TODO

- [ ] Add authentication/login page
- [ ] Implement real-time updates with WebSocket
- [ ] Add payment analytics charts
- [ ] Implement pagination for large datasets
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

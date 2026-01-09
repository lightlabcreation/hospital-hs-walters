# SmartLM - Logistics Management Platform

A production-ready, responsive SaaS dashboard UI for Logistics Management built with React, Vite, and Tailwind CSS.

## Features

- 🎨 Modern, clean UI with custom color theme (#1d627d)
- 👥 Role-based access control (7 roles: SUPER_ADMIN, COMPANY_ADMIN, OPERATIONS_MANAGER, FINANCE_USER, DISPATCHER, DRIVER, CUSTOMER)
- 📱 Fully responsive design (mobile-first)
- 🔐 Mock authentication system with role selector
- 🎯 Role-based sidebar navigation
- 📊 Role-specific dashboards with KPI cards and mock data
- 🎭 Reusable components (Button, Modal, Card)
- 🛡️ Protected routes

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- React Icons
- Context API

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start on `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Test Credentials

- **Any email** / **admin123** (use role selector dropdown)
- Or use predefined users:
  - superadmin@smartlm.com / admin123
  - companyadmin@smartlm.com / admin123
  - operations@smartlm.com / admin123
  - finance@smartlm.com / admin123
  - dispatcher@smartlm.com / admin123
  - driver@smartlm.com / admin123
  - customer@smartlm.com / admin123

**Note**: Select role from dropdown on login page for testing different dashboards.

## Project Structure

```
src/
├── app/              # App configuration and routes
├── components/       # Reusable UI components
│   ├── common/       # Button, Modal, Card
│   ├── navbar/       # Top navigation
│   └── sidebar/      # Sidebar navigation
├── context/          # React Context (Auth)
├── layouts/          # Layout components
├── mock/             # Mock data
├── pages/            # Page components
│   ├── auth/         # Login, Signup, ForgotPassword
│   └── dashboard/    # Dashboard page
└── styles/           # Global styles
```

## Role-Based Menus & Dashboards

### SUPER_ADMIN / COMPANY_ADMIN
**Menu**: Dashboard, Companies, Users & Roles, Pricing & Tariffs, Fleet & Compliance, Reports, Settings
**Dashboard**: Platform overview with company management KPIs

### OPERATIONS_MANAGER
**Menu**: Dashboard, Bookings, Dispatch, Drivers, Fleet, Tracking
**Dashboard**: Operations overview with active bookings and fleet status

### FINANCE_USER
**Menu**: Dashboard, Invoices, Payments, Driver Payouts, Financial Reports
**Dashboard**: Financial overview with revenue and payment tracking

### DISPATCHER
**Menu**: Dashboard, Jobs, Assign Driver, Live Tracking
**Dashboard**: Job assignment and driver coordination

### DRIVER
**Menu**: Dashboard, My Jobs, POD Upload, My Earnings
**Dashboard**: Driver-specific view with active jobs and earnings

### CUSTOMER
**Menu**: Dashboard, My Bookings, Invoices, Payments, Support
**Dashboard**: Customer portal with shipment tracking

## Notes

- This is a UI-only application with mock data
- No backend API calls
- Authentication is simulated using Context API
- All data is stored in memory (resets on refresh)


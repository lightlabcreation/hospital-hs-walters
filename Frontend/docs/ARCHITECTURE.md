# 🏗️ Application Architecture
Digital Clinic EMR System

---

## 1. Architecture Overview

The Digital Clinic EMR System follows a *clean separation of concerns* between frontend and backend while enforcing *strict role-based access control*.

- Frontend: React-based, role-driven UI
- Backend: Node.js + Express with Prisma ORM
- Authentication: JWT-based
- Authorization: Role middleware
- Data Source: Prisma schema as single source of truth

---

## 2. Frontend Architecture

### 2.1 Key Principles

- Axios is used for API calls
- APIs are called *directly inside pages/components*
- ❌ No service layer
- One shared Base URL file
- Role-based routing & UI rendering
- Toast notifications for all messages
- Shared utilities for date handling and storage

---

### 2.2 Frontend Folder Philosophy (Logical)

```text
src/
├── api/
│   └── baseUrl.js              # Backend base URL
│
├── auth/
│   └── Login.jsx               # Single login page
│
├── dashboards/
│   ├── super-admin/
│   ├── doctor/
│   ├── receptionist/
│   ├── billing-staff/
│   └── patient/
│
├── common/
│   ├── components/             # Shared UI components
│   ├── utils/
│   │   ├── dateFormatter.js    # Custom date handling
│   │   └── storage.js          # Custom localStorage wrapper
│   └── constants/
│       └── roles.js
│
├── routes/
│   └── ProtectedRoute.jsx
│
└── App.jsx

# Application Architecture

## High-Level Architecture

- Frontend: React
- Backend: Node.js + Express
- ORM: Prisma
- Auth: JWT
- Authorization: Role-based middleware
## Backend Folder Structure (STRICT)

common-backend-auth/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   │
│   ├── common/
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   └── config/
│   │       └── env.js
│   │
│   └── server.js

---

## Backend Design Rules

- Prisma schema controls all models
- Controllers contain business logic only
- Routes define endpoints only
- Middleware handles authentication and roles
- No database access outside controllers

---

## Authentication Architecture

1. Login request
2. Credential validation
3. JWT generation
4. Token verification middleware
5. Role validation middleware

---

## Authorization Rules

- Admin: full access
- Doctor: assigned data only
- Receptionist: patient and appointment creation
- Billing Staff: billing-related access
- Patient: view-only

---

## Constraints

- No extra roles
- No permission escalation
- No undocumented APIs
- Strict role enforcement

---

## Status

Architecture is final and locked.
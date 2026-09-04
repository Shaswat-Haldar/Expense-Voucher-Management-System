# 💼 Expense Voucher Management System

> A production-quality, role-based expense voucher management web application built for **ABC Company** as part of a Prachay Securities Pvt. Ltd. internship assignment.

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🔐 Role-Based Access | Employee, Director, and Accounts roles with strictly scoped permissions |
| 👤 User Management | Director can create, edit, and deactivate employee and accounts team members |
| 📄 Voucher Lifecycle | `Draft → Pending Approval → Approved / Rejected` state machine |
| ✍️ Digital Signatures | Upload JPG / PNG / WEBP signature images (max 5 MB) |
| 📊 Role Dashboards | Custom stats and recent activity per role |
| 🔍 Advanced Filters | Multi-dimensional filters for Accounts team (date, amount, status, dept.) |
| 🖨️ Print Vouchers | Print-ready layout for approved vouchers |
| 🌙 Dark Mode | Persistent dark / light mode toggle with system preference detection |
| 🔒 Secure Auth | JWT via HTTP-only cookies, no tokens exposed to JavaScript |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 8, Tailwind CSS v4, shadcn/ui, React Router v7 |
| **Forms** | React Hook Form + Zod validation |
| **Backend** | Node.js, Express.js, JWT (HTTP-only cookies) |
| **Database** | PostgreSQL 16 (via Docker) — raw SQL migrations |
| **File Uploads** | Multer (signature images) |
| **Dev Tools** | Nodemon, Docker Desktop |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/)

> PostgreSQL runs in a Docker container — no native installation required.

---

### Step 1 — Clone & Install

```bash
# Clone the repo
git clone https://github.com/<your-username>/expense-voucher-management.git
cd expense-voucher-management

# Install backend dependencies
cd expense-voucher/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Environment Variables

Copy the example files and fill in your values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**`backend/.env.example`**
```bash
PORT=4000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/expense_voucher
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=8h
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=5
ALLOWED_ORIGINS=http://localhost:5173
```

**`frontend/.env.example`**
```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

> ⚠️ **Never commit your actual `.env` files.** They are listed in `.gitignore`.  
> ⚠️ **Production:** Replace `JWT_SECRET` with a cryptographically random string and update `DATABASE_URL` and `ALLOWED_ORIGINS` accordingly.


---

### Step 3 — Start PostgreSQL (Docker)

```bash
# First time — create and start the container
docker run -d \
  --name expense_pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=expense_voucher \
  -p 5432:5432 \
  postgres:16-alpine

# Every subsequent session — just start the existing container
docker start expense_pg
```

---

### Step 4 — Migrate & Seed Database (First Time Only)

```bash
cd expense-voucher/backend

node src/config/migrate.js   # Creates all tables
node src/config/seed.js      # Inserts demo user accounts
```

> Migration 002_add_user_management.sql is applied automatically by the migration runner on the same command.

Expected output:
```
Running migration: 001_init.sql
Successfully applied: 001_init.sql
All migrations applied successfully.
Database seeded successfully.
```

---

### Step 5 — Start the Servers

**Terminal 1 — Backend:**
```bash
cd expense-voucher/backend
npm run dev
# ✅ Server is running on port 4000
```

**Terminal 2 — Frontend:**
```bash
cd expense-voucher/frontend
npm run dev
# ✅ Local: http://localhost:5173/
```

---

## 🔄 Fresh Start (Every Session)

```
1. Open Docker Desktop → wait for engine to show green
2. docker start expense_pg
3. cd backend  →  npm run dev
4. cd frontend →  npm run dev
5. Open http://localhost:5173
```

---

## 👤 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Employee | `employee@demo.com` | `Employee@123` |
| Employee 2 | `employee2@demo.com` | `Employee@123` |
| Director | `director@demo.com` | `Director@123` |
| Accounts | `accounts@demo.com` | `Accounts@123` |

> 💡 **Tip**: On the Login page, click the **Employee / Director / Accounts** quick-fill buttons to auto-populate credentials instantly.

> 💡 **Log in as Director** to access User Management via the sidebar.

---

## 📁 Project Structure

```
expense-voucher/
├── .env.example                 # Root environment template
├── AI_USE_LOG.md                # AI attribution and model usage log
├── backend/
│   ├── .env.example             # Backend environment template
│   ├── migrations/              # Raw SQL migration files
│   ├── uploads/                 # Uploaded signature images
│   └── src/
│       ├── config/              # db.js, env.js, migrate.js, seed.js
│       ├── middleware/          # auth.js, errorHandler.js, upload.js, roleGuard.js
│       └── modules/
│           ├── auth/            # Login, logout, /me
│           ├── vouchers/        # CRUD, file upload, status transitions
│           └── dashboard/       # Role-specific stats
└── frontend/
    ├── .env.example             # Frontend environment template
    └── src/
        ├── api/                 # Axios instance + per-resource API functions
        ├── components/          # Shared UI (Layout, Sidebar, Header, dialogs, etc.)
        ├── context/             # AuthContext, ThemeContext
        ├── hooks/               # useDashboard, useVouchers
        ├── pages/
        │   ├── auth/            # LoginPage
        │   ├── employee/        # Dashboard, MyVouchers, CreateVoucher, EditVoucher, VoucherDetail
        │   ├── director/        # Dashboard, PendingApprovals, AllVouchers, VoucherDetail
        │   └── accounts/        # Dashboard, AllVouchers, VoucherDetail
        ├── router/              # AppRouter, ProtectedRoute, RoleRoute
        └── utils/               # formatters, constants, fileHelpers, cn()
```

---

## 🔌 API Endpoints

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login with email + password |
| `POST` | `/api/auth/logout` | Auth | Clear JWT cookie |
| `GET` | `/api/auth/me` | Auth | Get current user profile |
| `GET` | `/api/vouchers` | Auth | List vouchers (role-filtered) |
| `POST` | `/api/vouchers` | Employee | Create draft voucher |
| `PATCH` | `/api/vouchers/:id` | Employee | Update draft |
| `DELETE` | `/api/vouchers/:id` | Employee | Delete draft |
| `POST` | `/api/vouchers/:id/submit` | Employee | Submit for approval |
| `POST` | `/api/vouchers/:id/approve` | Director | Approve voucher |
| `POST` | `/api/vouchers/:id/reject` | Director | Reject with reason |
| `POST` | `/api/vouchers/:id/signature/:role` | Auth | Upload signature image |
| `GET` | `/api/dashboard` | Auth | Role-specific dashboard stats |
| `GET` | `/api/users` | Director | List users |
| `POST` | `/api/users` | Director | Create user |
| `GET` | `/api/users/:id` | Director | Get user detail |
| `PATCH` | `/api/users/:id` | Director | Update user |
| `PATCH` | `/api/users/:id/toggle-active` | Director | Activate/Deactivate |
| `GET` | `/api/users/stats` | Director | User stats |

---

## 🐞 Known Issues & Fixes Applied

| Issue | Fix |
|---|---|
| PostgreSQL not installed locally | Switched to Docker PostgreSQL container |
| Environment credentials disclosure risk | Enforced `.env.example` pattern: ignored real `.env` in `.gitignore`, provided sanitized templates and copy instructions |
| Missing `useState`/`useEffect` imports in director page | Added to React import, blank page crash resolved |
| Images showing 404 (wrong URL base) | Stripped `/api` suffix from `VITE_API_BASE_URL` before building upload paths; added `/api/uploads` static route on backend |
| `res.data.data` undefined crash on voucher lists | Added safe array unwrapping with fallback to `[]` |
| Reject dialog transparent / unreadable | Replaced transparent dialog with opaque `bg-white dark:bg-slate-900` |

---

## 📜 License

This project is created for educational/internship purposes at Prachay Securities Pvt. Ltd.

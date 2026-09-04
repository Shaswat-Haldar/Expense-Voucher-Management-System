# 💼 Expense Voucher Management System

> A production-quality, role-based expense voucher management web application built for **ABC Company** as part of a Prachay Securities Pvt. Ltd. internship assignment.

> ## Deployed Link: - https://expense-voucher-management-system-rose.vercel.app

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
| ✨ AI Description Generator | Employees can auto-generate professional expense justifications using Gemini AI directly from the voucher form |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 8, Tailwind CSS v4, shadcn/ui, React Router v7 |
| **Forms** | React Hook Form + Zod validation |
| **Backend** | Node.js, Express.js, JWT (HTTP-only cookies) |
| **Database** | PostgreSQL 16 (via Docker) — raw SQL migrations |
| **File Uploads** | Multer (signature images) |
| **AI** | Google Gemini 2.0 Flash Lite (via @google/generative-ai) |
| **Dev Tools** | Nodemon, Docker Desktop |

---

## 👥 Role Permissions — Detailed Reference

> This section documents exactly what each role **can** and **cannot** do, derived from the live backend enforcement logic. All restrictions are applied server-side and cannot be bypassed from the frontend.

---

### 👤 Employee

The Employee role represents frontline staff who create and submit expense requests for reimbursement or approval.

#### ✅ What an Employee CAN do

**Authentication & Account**
- Log in using their registered email and password.
- Log out at any time, which clears the HTTP-only JWT cookie.
- View their own profile via `/api/auth/me` (returns `id`, `role`, `name`, `email`).
- Their `last_login_at` timestamp is automatically recorded on every successful login.

**Dashboard**
- View a personalised dashboard showing metrics scoped exclusively to their own vouchers:
  - Total number of vouchers created.
  - Count broken down by status: `draft`, `pending_approval`, `approved`, `rejected`.
  - Total cumulative monetary amount across all submitted vouchers.

**Voucher — Creation**
- Create new expense vouchers in `draft` status.
- Fill in the following fields when creating a voucher:
  - `expense_title` (required, min 1 character) — a short label for the expense.
  - `department` (required) — the business unit the expense belongs to.
  - `expense_date` (required) — the actual date the expense occurred.
  - `amount` (required, must be a positive number) — the monetary value of the claim.
  - `expense_description` (optional) — free-text notes about the expense.
  - `expense_category` (optional, defaults to `"General"`) — e.g. Travel, Meals, Office Supplies.
  - `voucher_date` (optional) — overrides the default voucher date if provided.
- Receive a system-generated unique voucher number in the format `EV-YYYY-XXXX` (e.g. `EV-2026-0001`), assigned atomically with row-level locking to prevent duplicates.

**✨ AI-Powered Smart Expense Description Generation (Gemini AI)**
- **Autonomous Justification Generation**: Employees can auto-generate professional, corporate-grade business justifications for expense reimbursement vouchers with a single click on the **✨ Generate** button in the voucher form.
- **Context-Aware Synthesis**: The system sends existing form parameters (`expense_title`, `department`, `amount`, and `expense_category`) to Google Gemini (`POST /api/ai/generate-description`), formatting INR currency and constructing structured prompts adhering to strict corporate rules (concise 40–80 words, formal business English, strictly prohibits fabricated meeting details, dates, or non-provided entities).
- **Full Human Autonomy & Override**: Employees retain complete editorial authority — the generated text populates the standard `expense_description` textarea where it remains 100% editable, refinable, or removable before saving as draft or submitting for approval.
- **Graceful Degradation**: If the AI service is unconfigured or rate-limited, employees receive clear, non-blocking toast notifications and can proceed with standard manual entry without any hindrance to voucher creation or submission.
- **Exclusive Role Access**: Access to `/api/ai/generate-description` is strictly role-guarded to authenticated Employees (`roleGuard('employee')`), preventing unauthorized invocation from unauthenticated sessions or other role surfaces.

**Voucher — Editing (Draft Only)**
- Edit any field on a voucher they own, **but only while it is in `draft` status**.
- Perform partial updates — can update one or more fields without resubmitting the full payload.
- Cannot edit vouchers belonging to other employees.

**Voucher — Deleting (Draft Only)**
- Permanently delete a voucher they own, **but only while it is in `draft` status**.
- Deleting a draft also removes any associated signature image file from disk.
- Cannot delete vouchers once they have been submitted.

**Voucher — Signature Upload**
- Upload their own handwritten signature image to a draft or pre-submission voucher.
  - Accepted file formats: **PNG, JPEG, WEBP** only.
  - Maximum file size: **5 MB**.
  - Each upload replaces any previously uploaded signature for that voucher.
- Cannot upload a director's signature.

**Voucher — Submission**
- Submit a `draft` voucher for director approval, transitioning its status to `pending_approval`.
- **Signature is mandatory** before submission — the system rejects submission attempts without a valid `employee_sig_path`.
- Can only submit their own vouchers.
- Cannot re-submit a voucher that has already been submitted, approved, or rejected.

**Voucher — Viewing**
- View a list of their own vouchers only (backend enforces `WHERE employee_id = <their id>`).
- Filter their own voucher list by: `status`, `department`, `expense_category`, `date range`, `amount range`, `voucher_number`.
- Sort results by: `created_at`, `expense_date`, `amount`, `status`, `voucher_number`.
- View paginated results (up to 20 per page by default).
- View full details of any single voucher they own.
- View their voucher's full audit trail: submission timestamp, approval/rejection timestamp, rejection reason (if any), director's signature.

#### ❌ What an Employee CANNOT do

- **Cannot** view, edit, delete, or access vouchers belonging to other employees — the server returns `403 Forbidden`.
- **Cannot** approve or reject any voucher, including their own.
- **Cannot** upload a director signature.
- **Cannot** edit a voucher once it has been submitted (status `pending_approval`, `approved`, or `rejected`).
- **Cannot** delete a submitted, approved, or rejected voucher.
- **Cannot** change their own account details (name, email, password, role) — there is no self-edit endpoint for employees.
- **Cannot** access the Director dashboard or Accounts dashboard.
- **Cannot** access the User Management panel.
- **Cannot** view other users' profiles or account information.
- **Cannot** log in if their account has been deactivated by the Director — login returns `401 Invalid email or password` (no information leakage).
- **Cannot** access any `/api/users` endpoints.
- **Cannot** invoke the AI description generator without the mandatory foundation fields (`expense_title`, `department`, and `amount`) — validated both client-side and server-side.

---

### 🎯 Director

The Director role has full voucher governance authority and complete control over the user roster of the organisation. This is the most privileged role in the system.

#### ✅ What a Director CAN do

**Authentication & Account**
- Log in using their registered email and password.
- Log out at any time.
- View their own profile via `/api/auth/me`.
- `last_login_at` is updated automatically on every login.

**Dashboard**
- View a Director-specific dashboard showing:
  - Number of vouchers currently in `pending_approval` status (awaiting their action).
  - Number of vouchers approved today.
  - Number of vouchers rejected today.
  - Total monetary value of all pending vouchers (aggregate sum).
  - A live feed of the **10 most recently updated vouchers** across all employees (excludes pure drafts).

**Voucher — Viewing (All Vouchers)**
- View **all** vouchers from all employees across the organisation — no employee scoping is applied to Directors.
- Apply multi-dimensional filters: `status`, `department`, `expense_category`, `employee_name`, `voucher_number`, `date_from`, `date_to`, `amount_min`, `amount_max`.
- Sort results by: `created_at`, `expense_date`, `amount`, `status`, `voucher_number` in either direction.
- View full details of any single voucher.
- See submitted timestamps, employee signatures, director signatures, approval/rejection timestamps, and rejection reasons.

**Voucher — Signature Upload**
- Upload their own handwritten director signature to any voucher at any time.
  - Accepted formats: **PNG, JPEG, WEBP** only.
  - Maximum file size: **5 MB**.
  - The system records `director_id` when a director signature is uploaded.
- Director signature is **required** before a voucher can be approved.

**Voucher — Approval**
- Approve a `pending_approval` voucher, transitioning it to `approved` status.
- **Director signature (`director_sig_path`) is mandatory** before approval — the server enforces this and returns `400 Bad Request` if the signature is absent.
- Records `approved_at` timestamp and stamps `director_id` on the voucher.

**Voucher — Rejection**
- Reject a `pending_approval` voucher, transitioning it to `rejected` status.
- A `rejection_reason` (minimum 10 characters) is **required** — the server validates this with Zod and returns `400` if it is missing or too short.
- Records `rejected_at` timestamp, `rejection_reason`, and stamps `director_id`.
- Unlike approval, rejection does **not** require a director signature.

**User Management — Listing & Filtering**
- View a paginated list of all registered users in the system (10 per page by default).
- Filter users by:
  - Free-text search across `name` and `email` (case-insensitive, partial match).
  - `role` filter: `employee` or `accounts`.
  - `is_active` filter: `true` (active only) or `false` (deactivated only).
- View returned user fields: `id`, `name`, `email`, `role`, `employee_id`, `is_active`, `last_login_at`, `created_at`.
- Note: `password_hash` is **never** returned by the API — it is excluded at the query level.

**User Management — Stats Dashboard**
- Fetch an aggregate summary of all user accounts:
  - Total user count.
  - Count of active vs. inactive users.
  - Count by role: `employee`, `director`, `accounts`.

**User Management — User Detail**
- View the full profile of any individual user by their `id`.

**User Management — User Creation**
- Create new user accounts for **Employee** or **Accounts** roles only.
- Required fields: `name` (min 2 chars), `email` (valid format), `role` (`employee` or `accounts`).
- Optional: `employee_id` (only meaningful for `employee` role; stored as `null` for `accounts`).
- Password: can be provided explicitly, or the system auto-generates a cryptographically random temporary password (16-char hex + complexity suffix).
- The temporary password is returned in the API response once (only at creation time) so it can be shared with the new user.
- New accounts are always created as `is_active = true`.
- If a duplicate email is attempted, the server returns `409 Conflict`.

**User Management — Edit User**
- Update an existing user's `name`, `role`, or `employee_id`.
- Changing a user's role between `employee` and `accounts` is permitted.
- Does **not** change or expose password hashes.

**User Management — Activate / Deactivate User**
- Toggle any user's `is_active` status to `true` (active) or `false` (deactivated).
- A deactivated user **immediately** loses the ability to log in — login queries filter by `is_active = true`, so deactivated accounts return `401 Invalid email or password`.
- The `is_active` value must be an explicit boolean; the server returns `400` for any other type.

#### ❌ What a Director CANNOT do

- **Cannot** deactivate their own account — `PATCH /api/users/:id/toggle-active` returns `403 Forbidden` if `req.user.id === req.params.id`.
- **Cannot** change their own role via the user update endpoint — server returns `403 Forbidden`.
- **Cannot** create other Director-level accounts — the create user endpoint validates `role` and only accepts `employee` or `accounts`; attempting `director` returns `400 Bad Request`.
- **Cannot** approve a voucher that is not in `pending_approval` status — returns `422 Unprocessable Entity`.
- **Cannot** approve without their signature being uploaded first — returns `400 Bad Request`.
- **Cannot** reject a voucher that is not in `pending_approval` status — returns `422`.
- **Cannot** reject without providing a rejection reason of at least 10 characters — returns `400` with Zod validation details.
- **Cannot** create vouchers themselves — the `POST /api/vouchers` route is guarded with `roleGuard('employee')` and returns `403` for Directors.
- **Cannot** edit or delete employee vouchers — edit/delete routes are guarded with `roleGuard('employee')`.
- **Cannot** change passwords of any user through the User Management panel (no password update endpoint exists).
- **Cannot** delete user accounts — only deactivation (soft-delete) is supported.

---

### 🧾 Accounts

The Accounts role is a read-only audit and finance team role. They can inspect all submitted vouchers in detail for reconciliation and reporting but have no write authority over the voucher lifecycle.

#### ✅ What an Accounts User CAN do

**Authentication & Account**
- Log in using their registered email and password.
- Log out at any time.
- View their own profile via `/api/auth/me`.
- `last_login_at` is automatically recorded on every successful login.

**Dashboard**
- View an Accounts-specific dashboard showing metrics across the **entire organisation** (excluding drafts):
  - Total non-draft vouchers in the system.
  - Count of vouchers in `pending_approval` status.
  - Count of `approved` vouchers.
  - Count of `rejected` vouchers.
  - Total cumulative monetary value of all **approved** vouchers (finance reconciliation metric).
  - A live feed of the **10 most recently approved vouchers**.

**Voucher — Viewing (All Non-Draft Vouchers)**
- View all vouchers from all employees that have been submitted (i.e. not pure drafts).
- Apply multi-dimensional filters for reconciliation:
  - `status` — e.g. filter to `approved` only for payment processing.
  - `department` — partial match, case-insensitive.
  - `expense_category` — exact match.
  - `employee_name` — partial match, case-insensitive.
  - `voucher_number` — partial match for quick lookup.
  - `date_from` / `date_to` — expense date range.
  - `amount_min` / `amount_max` — monetary range filter.
- Sort results by: `created_at`, `expense_date`, `amount`, `status`, `voucher_number`.
- View paginated results (up to 20 per page).
- View full detail of any single voucher, including:
  - All voucher fields (department, category, description, amount, dates).
  - Employee name and employee ID.
  - Voucher status and all status timestamps (submitted, approved, rejected).
  - Rejection reason (if any).
  - Employee signature image path.
  - Director signature image path and `director_id`.

**Print-Ready Vouchers**
- Access a print-optimised layout for approved vouchers including company letterhead, voucher details, and dual signature fields for physical record-keeping.

#### ❌ What an Accounts User CANNOT do

- **Cannot** create, edit, or delete any voucher — these routes are guarded with `roleGuard('employee')`.
- **Cannot** approve or reject any voucher — these routes are guarded with `roleGuard('director')`.
- **Cannot** upload employee or director signatures — both signature upload routes are role-guarded.
- **Cannot** submit vouchers — submission is `roleGuard('employee')` only.
- **Cannot** view pure draft vouchers — the Accounts dashboard query explicitly excludes `WHERE status != 'draft'`.
- **Cannot** access any `/api/users` User Management endpoints — all are guarded with `roleGuard('director')`.
- **Cannot** create, edit, activate, or deactivate any user accounts.
- **Cannot** access the Director or Employee dashboards.
- **Cannot** change their own account details (name, email, password, role).
- **Cannot** log in if their account has been deactivated by the Director — returns `401 Invalid email or password`.

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

# ─── AI (Google Gemini) ───────────────────────────────────
# Get your free API key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
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

npm run migrate   # Runs 001_init.sql and 002_add_user_management.sql
npm run seed      # Inserts demo user accounts
```

> **Migrations applied:**
> - `001_init.sql` — Creates base schemas, tables (`users`, `vouchers`), enums, and timestamp triggers.
> - `002_add_user_management.sql` — Extends `users` table with `is_active` (soft-delete flag) and `last_login_at` (audit timestamp).

Expected output:
```
Running migration: 001_init.sql
Successfully applied: 001_init.sql
Running migration: 002_add_user_management.sql
Successfully applied: 002_add_user_management.sql
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

### Step 6 — Run Tests (Optional)

Backend unit and middleware test suite powered by **Vitest**:

```bash
cd expense-voucher/backend
npm test
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
│   ├── migrations/              # Raw SQL migration files (001_init.sql, 002_add_user_management.sql)
│   ├── uploads/                 # Uploaded signature images
│   └── src/
│       ├── config/              # db.js, env.js, migrate.js, seed.js
│       ├── middleware/          # auth.js, auth.test.js, errorHandler.js, upload.js, roleGuard.js
│       └── modules/
│           ├── auth/            # Login, logout, /me
│           ├── vouchers/        # CRUD, file upload, status transitions
│           ├── dashboard/       # Role-specific stats
│           └── users/           # Director user lifecycle management (queries, controller, routes)
└── frontend/
    ├── .env.example             # Frontend environment template
    └── src/
        ├── api/                 # Axios client + per-resource API modules (auth, vouchers, dashboard, users)
        ├── components/          # Shared UI (Layout, Sidebar, Header, dialogs, etc.)
        ├── context/             # AuthContext, ThemeContext
        ├── hooks/               # useDashboard, useVouchers
        ├── pages/
        │   ├── auth/            # LoginPage
        │   ├── employee/        # Dashboard, MyVouchers, CreateVoucher, EditVoucher, VoucherDetail
        │   ├── director/        # Dashboard, PendingApprovals, AllVouchers, VoucherDetail, UserManagement, CreateUser, UserDetail, EditUserModal
        │   └── accounts/        # Dashboard, AllVouchers, VoucherDetail
        ├── router/              # AppRouter, ProtectedRoute, RoleRoute
        └── utils/               # formatters, constants, fileHelpers, cn()
```

---

## 🔌 API Endpoints

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login with email + password (checks `is_active`, records `last_login_at`) |
| `POST` | `/api/auth/logout` | Auth | Clear JWT HTTP-only cookie |
| `GET` | `/api/auth/me` | Auth | Get authenticated user profile |
| `GET` | `/api/vouchers` | Auth | List vouchers (role-filtered) |
| `POST` | `/api/vouchers` | Employee | Create draft voucher |
| `PATCH` | `/api/vouchers/:id` | Employee | Update draft voucher |
| `DELETE` | `/api/vouchers/:id` | Employee | Delete draft voucher |
| `POST` | `/api/vouchers/:id/submit` | Employee | Submit draft for director approval |
| `POST` | `/api/vouchers/:id/approve` | Director | Approve voucher |
| `POST` | `/api/vouchers/:id/reject` | Director | Reject voucher with reason |
| `POST` | `/api/vouchers/:id/signature/:role` | Auth | Upload signature image |
| `GET` | `/api/dashboard` | Auth | Role-specific dashboard metrics |
| `GET` | `/api/users` | Director | List users with search, role, & status filters |
| `POST` | `/api/users` | Director | Create new employee or accounts team member |
| `GET` | `/api/users/stats` | Director | Summary statistics (total, active, roles count) |
| `GET` | `/api/users/:id` | Director | Get user details and voucher history |
| `PATCH` | `/api/users/:id` | Director | Update user profile (name, role, employee ID) |
| `PATCH` | `/api/users/:id/toggle-active` | Director | Activate or deactivate user (self-deactivation blocked) |
| `POST` | `/api/ai/generate-description` | Employee | Generate AI expense description from voucher fields |

---

## 🐞 Known Issues & Fixes Applied

| Issue | Fix |
|---|---|
| PostgreSQL not installed locally | Switched to Docker PostgreSQL container (`postgres:16-alpine`) |
| Environment credentials disclosure risk | Enforced `.env.example` pattern: ignored real `.env` in `.gitignore`, provided sanitized templates and copy instructions |
| Missing `useState`/`useEffect` imports in director page | Added to React import, blank page crash resolved |
| Images showing 404 (wrong URL base) | Stripped `/api` suffix from `VITE_API_BASE_URL` before building upload paths; added `/api/uploads` static route on backend |
| `res.data.data` undefined crash on voucher lists | Added safe array unwrapping with fallback to `[]` |
| Reject dialog transparent / unreadable | Replaced transparent dialog with opaque `bg-white dark:bg-slate-900` |
| `column "is_active" does not exist` on login | Executed `npm run migrate` to apply migration `002_add_user_management.sql` to database |
| `ReferenceError: jest is not defined` in `auth.test.js` | Updated test mocks to use native Vitest (`vi.fn()`, `vi.mock()`) and verify `env.JWT_SECRET` |
| Director self-deactivation & privilege escalation | Added server-side validation in `users.controller.js` preventing directors from altering their own active state or provisioning duplicate director roles |

---

## ✨ AI Features

### Smart Description Generator

Employees filling out the voucher form can click the
**✨ Generate** button next to the Description field.
The system sends the voucher's Title, Category, Department,
and Amount to Google Gemini 2.0 Flash Lite and returns a
professional 2–3 sentence business justification in under
2 seconds.

**How to enable:**
1. Get a free API key at https://aistudio.google.com/app/apikey
2. Add it to `backend/.env`:
   GEMINI_API_KEY=your_key_here
3. Restart the backend server

**Graceful degradation:**
If the API key is missing or the Gemini API is unreachable,
the button shows an error toast and the description field
remains editable manually. The rest of the application is
completely unaffected.

**Free tier limits (Gemini 2.0 Flash Lite):**
- 1,500 requests/day
- 1M input tokens/day
- 250K output tokens/day
Sufficient for demo and real-world internship usage.

---

## 📜 License

This project is created for educational/internship purposes at Prachay Securities Pvt. Ltd.

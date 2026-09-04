# 🤖 AI Use & Attribution Log

> **Project**: Expense Voucher Management System  
> **Client / Organization**: ABC Company (Prachay Securities Pvt. Ltd. Internship Technical Assignment)  
> **Author**: Shaswat Haldar  
> **Repository**: `expense-voucher-management`  
> **Last Updated**: September 2026  

---

## 📌 Executive Summary & Policy Compliance

This document provides a comprehensive, transparent record of how Artificial Intelligence (AI) models, tools, and coding assistants were utilized during the design, development, debugging, and documentation of the **Expense Voucher Management System**.

In accordance with academic and technical assessment integrity guidelines, this log details:
- Exact dates and milestones where AI assistance was engaged.
- Specific AI models and development tools utilized.
- Concise summaries of prompts and engineering requirements.
- The raw output received from the models.
- The manual modifications, architectural decisions, and human verification performed before incorporating any AI output into production code.

---

## 🧰 AI Tools & Models Leveraged

| Tool / Model | Version / Provider | Primary Area of Utilization |
|---|---|---|
| **Claude 3.5 Sonnet** | Anthropic | Architecture planning, state machine logic, frontend component drafting, complex debugging |
| **Gemini 1.5 Pro / Flash** | Google DeepMind | PostgreSQL schema design, Zod validation schemas, API route design, SQL aggregation |
| **Gemini 3.5 Flash Lite** | Google DeepMind | Smart expense description generator, corporate justification prompt engineering |
| **GPT-4o** | OpenAI | Filter logic, role-based dashboard metrics, error diagnosis |
| **GitHub Copilot / IDE Assistant** | GitHub / DeepMind | Context-aware code completions, boilerplate generation, unit test scaffolding |

---

## 📋 Comprehensive AI Use Log

The following chronological log records each distinct technical task where AI tools were used during the project lifecycle.

| Date | Task | AI Tool Used | Prompt Summary | Output Used | Manual Edits Made |
|---|---|---|---|---|---|
| **2026-09-02** | Database Schema & Relational Design | Gemini 1.5 Pro | Design PostgreSQL schema for an expense voucher system with roles (Employee, Director, Accounts), voucher statuses, timestamps, signature paths, and audit indexes. | SQL DDL schema defining `users` and `vouchers` tables with foreign keys and index definitions. | Added `CHECK` constraints for role and status enums, UUID default generators (`gen_random_uuid()`), and adjusted precision for currency numeric types (`NUMERIC(12,2)`). |
| **2026-09-02** | Sequential Voucher Number Generator | GitHub Copilot / GPT-4o | Write a concurrent-safe sequential voucher number generator (format `EV-YYYY-XXXX`) using PostgreSQL transaction locks. | Utility function `generateVoucherNumber(client)` with row-locking logic. | Integrated into `voucher.controller.js` inside `BEGIN` / `COMMIT` transaction block to avoid race conditions. |
| **2026-09-02** | JWT Auth & Role-Based Middleware | Claude 3.5 Sonnet | Implement secure Express auth middleware with JWT stored in HTTP-only cookies and a reusable `roleGuard` middleware. | `auth.js` verifying token from `req.cookies`, and `roleGuard.js` checking `allowedRoles.includes(req.user.role)`. | Added token expiration checks, sanitized user payload attached to `req.user`, and configured secure cookie flags (`httpOnly`, `sameSite`, `secure`). |
| **2026-09-02** | Voucher State Machine & Approval Workflow | Gemini 1.5 Pro | Create Express controllers for voucher lifecycle transitions: draft creation, employee submission, director approval/rejection with mandatory notes. | Controller methods `createVoucher`, `submitVoucher`, `approveVoucher`, `rejectVoucher` with status transition checks. | Enforced strict role-based permission checks (e.g. employee cannot submit others' vouchers, directors cannot edit amounts). |
| **2026-09-03** | Multer Digital Signature Upload | GitHub Copilot / Claude 3.5 Sonnet | Set up Multer file upload middleware for signature images with mime-type filtering (PNG, JPEG, WEBP) and 5MB size limit. | `upload.js` Multer storage configuration with disk storage and file filter callback. | Added file extension sanitization, automated folder creation if absent, and helper functions to purge old signature files upon re-upload. |
| **2026-09-03** | Aggregation Dashboard Queries | GPT-4o | Write PostgreSQL queries to compute role-based dashboard metrics (e.g. total expenses, pending approval count, monthly spend breakdown). | SQL aggregation queries with `COUNT`, `SUM(amount)`, `FILTER (WHERE status = ...)`, and date groupings. | Handled null values with `COALESCE`, parameterized query variables to prevent SQL injection, and optimized index usage. |
| **2026-09-03** | React Router v7 & Role-Based Protected Routes | Claude 3.5 Sonnet | Set up React Router v7 with nested layout, protected auth routes, and role-based route guards for Employee, Director, and Accounts. | `AppRouter.jsx`, `ProtectedRoute.jsx`, and `RoleRoute.jsx` wrapping layout and page trees. | Hooked up redirect paths to `/login` for unauthenticated sessions and `/unauthorized` fallback for forbidden role access. |
| **2026-09-03** | Form Validation with React Hook Form + Zod | Gemini 1.5 Pro | Build a dynamic voucher submission form with Zod schema validation for expense items, titles, dates, and amounts. | `VoucherForm.jsx` with `useForm`, `zodResolver`, dynamic fields, error display. | Customized validation error messages, added date restrictions (preventing future dates for past expenses), and currency formatting. |
| **2026-09-03** | Digital Signature Upload Component & Preview | Claude 3.5 Sonnet | Build a React component for uploading signature image files with drag-and-drop, preview modal, and clear button. | `SignatureUpload.jsx` component utilizing HTML5 file input, FileReader API, and preview dialog. | Styled using Tailwind CSS, added file size validation toast notifications, and connected to `/api/vouchers/:id/signature/:role`. |
| **2026-09-03** | Accounts Advanced Filter Panel | GPT-4o | Create a multi-criteria filter component for Accounts team with date range, status dropdown, department search, and amount min/max. | `FilterPanel.jsx` component with debounce input, dropdown selectors, and URL query param synchronization. | Integrated with custom hook `useVouchers` and backend query string parameters. |
| **2026-09-03** | Print Layout for Approved Vouchers | GitHub Copilot | Generate print-ready CSS and HTML layout for voucher invoice receipts including ABC Company letterhead and dual signatures. | Print media queries `@media print`, hide navigation bars, clean table typography, signature alignment. | Tuned page margins, ensured digital signatures maintain aspect ratio without pixelation, and added automated print dialog trigger. |
| **2026-09-04** | Bug Fix: Blank Director Approval Screen | Claude 3.5 Sonnet / Gemini | Diagnose why `DirectorDashboard.jsx` and `PendingApprovals.jsx` produced a blank white screen with `ReferenceError: useState is not defined`. | Identified missing React hook imports (`useState`, `useEffect`) at top of component. | Added `{ useState, useEffect }` to `import React` statements across affected director views. |
| **2026-09-04** | Bug Fix: Signature 404 & Upload URL Base | Claude 3.5 Sonnet | Resolve 404 error when frontend attempts to load uploaded signature images (`/api/uploads/...` vs static `/uploads/...`). | Recommended serving static files under Express `/api/uploads` and stripping `/api` prefix when resolving image URLs. | Updated `app.js` with `express.static`, updated `fileHelpers.js` URL builder, and confirmed cross-origin asset loading. |
| **2026-09-04** | Bug Fix: Safe Array Unwrapping for Vouchers List | GitHub Copilot | Fix runtime exception `Cannot read properties of undefined (reading 'map')` when backend returns wrapped `{ success, data: [] }`. | Suggested safe unwrapping pattern: `const list = Array.isArray(res.data?.data) ? res.data.data : []`. | Applied defensive array handling across `MyVouchers.jsx`, `AllVouchers.jsx`, and `PendingApprovals.jsx`. |
| **2026-09-04** | UI Enhancement: Infinite Canvas Background Animation | Gemini 1.5 Pro / Claude 3.5 Sonnet | Create a smooth, futuristic interactive canvas grid background (`InfiniteGrid.jsx`) for login and dashboard layouts with mouse parallax. | Standalone HTML5 Canvas React component `InfiniteGrid.jsx` utilizing `requestAnimationFrame` and pointer coordinates. | Integrated into `Layout.jsx` and `LoginPage.jsx`, tuned grid opacity, color hues for light/dark themes, and ensured zero CPU hogging when unmounted. |
| **2026-09-04** | Security Hardening: `.env.example` Pattern Enforcement | Claude 3.5 Sonnet / Antigravity | Audit repository for credential exposure risks, configure strict `.gitignore` rules for environment files, generate `.env.example` templates, and update setup docs. | Template files (`.env.example`, `backend/.env.example`, `frontend/.env.example`) and revised README instructions (`copy .env.example → .env`). | Confirmed git exclusion via `git check-ignore`, sanitized default keys in templates, and documented platform-specific copy commands. |
| **2026-09-04** | Feature: AI Smart Expense Description Generator | Google Gemini 2.0 Flash Lite / Antigravity | Build end-to-end AI justification assistant using `@google/generative-ai` SDK, role-guarded `/api/ai/generate-description` endpoint, and responsive form integration in `VoucherForm.jsx`. | Controller `ai.controller.js`, route `ai.routes.js`, frontend API `ai.js`, and form trigger button with loading state. | Designed strict system prompt with corporate rules (no hallucinations, INR currency format, 40-80 words), attached employee role guard, ensured non-blocking graceful degradation. |
| **2026-09-04** | UI Polish: Centered Authentication Layout | Antigravity / Gemini | Fix layout alignment where login container rendered offset on the left when wrapped in animated infinite grid canvas. | Nested flex container `<div className="min-h-screen flex flex-col items-center justify-center px-4 relative">` with `mx-auto` on card. | Verified screen centering across viewports while preserving absolute positioning of the theme toggle and interactive canvas background. |

---

## 🔍 Quality Assurance, Human Oversight & Verification

AI was utilized strictly as an accelerator for boilerplate generation, pattern exploration, and debugging assistance. All mission-critical business logic underwent rigorous human oversight:

1. **Security & Authentication Verification**:
   - Manually audited JWT signing and cookie policies to ensure zero exposure to client-side scripts (`HttpOnly=true`, `SameSite=Lax`).
   - Verified that all destructive endpoints (`DELETE`, `PATCH`, `POST /approve`, `POST /reject`) validate user permissions on the server side via `roleGuard`, preventing client-side bypasses.

2. **Database & Data Integrity**:
   - Manually validated foreign key constraints and index performance on PostgreSQL.
   - Tested voucher number generation under concurrent transactions to prevent duplicates.
   - Used parameterized queries across all database operations to eliminate SQL injection risks.

3. **User Experience & Edge Cases**:
   - Tested voucher submission with missing signatures, oversized attachments, and negative amounts to verify fallback handling.
   - Validated dark/light theme switching with Tailwind v4 across all dashboard views.
   - Tested print layout across different screen sizes and browsers (Chrome, Edge, Firefox).

---

## 📜 Developer Declaration

I hereby declare that:
- The usage of AI in this project has been fully disclosed in this log.
- All code generated with AI assistance was comprehensively reviewed, understood, modified where necessary, and tested by me.
- The business architecture, component composition, and workflow decisions reflect my own problem-solving approach to the ABC Company expense voucher requirements.

**Signed,**  
*Shaswat Haldar*  
Candidate / Full-Stack Developer  
Prachay Securities Pvt. Ltd. Internship Assignment

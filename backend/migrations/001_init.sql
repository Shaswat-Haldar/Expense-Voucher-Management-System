-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('employee','director','accounts')),
  employee_id   VARCHAR(50),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Create vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_number      VARCHAR(30) UNIQUE NOT NULL,
  voucher_date        DATE NOT NULL,
  expense_date        DATE NOT NULL,
  department          VARCHAR(255) NOT NULL,
  expense_title       VARCHAR(255) NOT NULL,
  expense_category    VARCHAR(100) NOT NULL DEFAULT 'General',
  expense_description TEXT,
  amount              NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  employee_id         UUID NOT NULL REFERENCES users(id),
  employee_name       VARCHAR(255) NOT NULL,
  employee_sig_path   TEXT,
  status              VARCHAR(30) NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','submitted','pending_approval',
                                        'approved','rejected')),
  submitted_at        TIMESTAMPTZ,
  approved_at         TIMESTAMPTZ,
  rejected_at         TIMESTAMPTZ,
  rejection_reason    TEXT,
  director_id         UUID REFERENCES users(id),
  director_sig_path   TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_vouchers_employee_id ON vouchers(employee_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status);
CREATE INDEX IF NOT EXISTS idx_vouchers_voucher_number ON vouchers(voucher_number);

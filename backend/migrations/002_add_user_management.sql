-- Migration: 002_add_user_management.sql
-- Extends users table to support director-managed user lifecycle
-- Run AFTER 001_init.sql

-- 1. Add soft-delete support
ALTER TABLE users ADD COLUMN IF NOT EXISTS
  is_active BOOLEAN NOT NULL DEFAULT true;

-- 2. Add last login tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS
  last_login_at TIMESTAMPTZ;

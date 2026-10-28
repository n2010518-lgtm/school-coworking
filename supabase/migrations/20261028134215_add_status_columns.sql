/*
# Add status columns to bookings and equipment_requests

1. Modified Tables
- `bookings`: add `status` text column (default 'pending') — tracks booking lifecycle: pending, confirmed, cancelled
- `equipment_requests`: add `status` text column (default 'pending') — tracks request lifecycle: pending, approved, issued, rejected
2. Security
- No new tables; existing RLS policies and grants already cover UPDATE on both tables for anon + authenticated.
3. Notes
- Uses DO $$ block to add columns idempotently (IF NOT EXISTS).
- New bookings and requests default to 'pending' status.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'status') THEN
    ALTER TABLE bookings ADD COLUMN status text NOT NULL DEFAULT 'pending';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment_requests' AND column_name = 'status') THEN
    ALTER TABLE equipment_requests ADD COLUMN status text NOT NULL DEFAULT 'pending';
  END IF;
END $$;

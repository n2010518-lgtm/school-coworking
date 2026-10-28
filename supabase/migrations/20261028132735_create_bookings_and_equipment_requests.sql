/*
# Create bookings and equipment_requests tables (single-tenant, no auth)

1. New Tables
- `bookings`
  - `id` (uuid, primary key)
  - `zone` (text, not null) — which coworking zone: quiet, team, meeting
  - `date` (date, not null) — booking date
  - `time_slot` (text, not null) — e.g. "14:00 - 16:00"
  - `student_name` (text, not null) — student full name
  - `class_name` (text, not null) — e.g. "10-А"
  - `created_at` (timestamp)
- `equipment_requests`
  - `id` (uuid, primary key)
  - `equipment_id` (text, not null) — which equipment item
  - `equipment_name` (text, not null) — display name
  - `purpose` (text, not null) — shooting purpose
  - `student_name` (text, not null)
  - `class_name` (text, not null)
  - `created_at` (timestamp)
2. Security
- Enable RLS on both tables.
- Grant CRUD to `anon` + `authenticated` so the anon-key frontend can read/write.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no-auth hackathon demo).
3. Notes
- No user_id / auth — this is a public hackathon demo with no sign-in.
- Bookings and equipment requests are visible to all visitors.
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone text NOT NULL,
  date date NOT NULL,
  time_slot text NOT NULL,
  student_name text NOT NULL,
  class_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id text NOT NULL,
  equipment_name text NOT NULL,
  purpose text NOT NULL,
  student_name text NOT NULL,
  class_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_requests ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON bookings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON equipment_requests TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_equipment_requests" ON equipment_requests;
CREATE POLICY "anon_select_equipment_requests" ON equipment_requests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_equipment_requests" ON equipment_requests;
CREATE POLICY "anon_insert_equipment_requests" ON equipment_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_equipment_requests" ON equipment_requests;
CREATE POLICY "anon_update_equipment_requests" ON equipment_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_equipment_requests" ON equipment_requests;
CREATE POLICY "anon_delete_equipment_requests" ON equipment_requests FOR DELETE
  TO anon, authenticated USING (true);

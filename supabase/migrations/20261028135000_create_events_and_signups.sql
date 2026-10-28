/*
# Create events and event_signups tables

1. New Tables
- `events`
  - `id` (uuid, primary key)
  - `title` (text, not null) — event name
  - `description` (text, not null) — what the event is about
  - `category` (text, not null) — workshop, lecture, meetup, etc.
  - `date` (date, not null) — when the event happens
  - `time` (text, not null) — e.g. "16:00"
  - `location` (text, not null) — where in the coworking
  - `max_seats` (int, not null, default 20) — capacity
  - `registered` (int, not null, default 0) — current signup count
  - `speaker` (text) — who leads the event
  - `created_at` (timestamp)
- `event_signups`
  - `id` (uuid, primary key)
  - `event_id` (uuid, references events, ON DELETE CASCADE)
  - `student_name` (text, not null)
  - `class_name` (text, not null)
  - `created_at` (timestamp)
2. Security
- Enable RLS on both tables.
- Grant CRUD to `anon` + `authenticated` (no-auth hackathon demo, public data).
- Allow anon + authenticated full CRUD on both tables.
3. Notes
- No auth — this is a public hackathon demo.
- event_signups cascades on event deletion.
- Seeded with 4 initial events.
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  max_seats int NOT NULL DEFAULT 20,
  registered int NOT NULL DEFAULT 0,
  speaker text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  class_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_signups ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON events TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON event_signups TO anon, authenticated;

-- events policies
DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE TO anon, authenticated USING (true);

-- event_signups policies
DROP POLICY IF EXISTS "anon_select_signups" ON event_signups;
CREATE POLICY "anon_select_signups" ON event_signups FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_signups" ON event_signups;
CREATE POLICY "anon_insert_signups" ON event_signups FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_signups" ON event_signups;
CREATE POLICY "anon_update_signups" ON event_signups FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_signups" ON event_signups;
CREATE POLICY "anon_delete_signups" ON event_signups FOR DELETE TO anon, authenticated USING (true);

-- Seed initial events
INSERT INTO events (title, description, category, date, time, location, max_seats, registered, speaker) VALUES
('Воркшоп по подкастам', 'Научись записывать, монтировать и публиковать подкасты с нуля. Работа со студийными микрофонами и звуковой картой.', 'workshop', '2026-11-02', '16:00', 'Медиацентр', 15, 3, 'Айгерим К., 10-А'),
('Лекция по ИИ-промптингу', 'Как правильно формулировать запросы к нейросетям для учебы и проектов. Практические примеры и разбор кейсов.', 'lecture', '2026-11-05', '15:00', 'Переговорная', 25, 8, 'Бекзат С., 11-А'),
('Митап школьных стартапов', 'Питчи проектов от учеников, обратная связь от жюри и нетворкинг. Приходи показать свой проект!', 'meetup', '2026-11-08', '17:00', 'Мини-лекторий', 30, 12, 'Команда NexusLab'),
('Воркшоп по видеосъёмке', 'Основы работы с камерой Sony A7 III, композиция кадра и цветокоррекция. Практика на реальном оборудовании.', 'workshop', '2026-11-10', '16:00', 'Медиацентр', 12, 5, 'Динара М., 9-В')
ON CONFLICT DO NOTHING;

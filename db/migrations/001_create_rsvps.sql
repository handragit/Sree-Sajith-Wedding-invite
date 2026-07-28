CREATE TABLE IF NOT EXISTS rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 1 AND 120),
  attendance_status text NOT NULL CHECK (attendance_status IN ('attending', 'unable_to_attend')),
  events text[] NOT NULL DEFAULT '{}' CHECK (
    events <@ ARRAY['evening_reception', 'main_reception']::text[]
    AND cardinality(events) <= 2
    AND (
      (attendance_status = 'attending' AND cardinality(events) >= 1)
      OR (attendance_status = 'unable_to_attend' AND cardinality(events) = 0)
    )
  ),
  guest_count integer NOT NULL CHECK (guest_count BETWEEN 1 AND 12),
  email text CHECK (email IS NULL OR char_length(email) <= 254),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 32),
  dietary_requirements text CHECK (dietary_requirements IS NULL OR char_length(dietary_requirements) <= 500),
  message text CHECK (message IS NULL OR char_length(message) <= 1000),
  submission_hash text UNIQUE CHECK (submission_hash IS NULL OR submission_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rsvps_created_at_idx ON rsvps (created_at DESC);

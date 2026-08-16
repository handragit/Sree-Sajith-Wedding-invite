BEGIN;

ALTER TABLE rsvps
  DROP CONSTRAINT IF EXISTS rsvps_attendance_status_check,
  DROP CONSTRAINT IF EXISTS rsvps_events_check,
  DROP CONSTRAINT IF EXISTS rsvps_check;

ALTER TABLE rsvps
  ADD CONSTRAINT rsvps_attendance_status_check
    CHECK (attendance_status IN ('attending', 'unable_to_attend', 'not_sure')),
  ADD CONSTRAINT rsvps_events_check
    CHECK (
      events <@ ARRAY['evening_reception', 'main_reception']::text[]
      AND cardinality(events) <= 2
      AND (
        (attendance_status = 'attending' AND cardinality(events) >= 1)
        OR (attendance_status = 'unable_to_attend' AND cardinality(events) = 0)
        OR attendance_status = 'not_sure'
      )
    );

COMMIT;

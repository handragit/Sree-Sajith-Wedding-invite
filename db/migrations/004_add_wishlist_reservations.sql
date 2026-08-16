BEGIN;

ALTER TABLE wishlist_items
  ADD COLUMN is_reserved boolean NOT NULL DEFAULT false,
  ADD COLUMN reserved_by text NULL,
  ADD COLUMN reserved_at timestamptz NULL,
  ADD CONSTRAINT wishlist_items_reserved_by_length_check CHECK (
    reserved_by IS NULL OR char_length(reserved_by) <= 160
  );

CREATE INDEX wishlist_items_public_availability_order_idx
  ON wishlist_items (is_visible, is_reserved, sort_order, created_at, id);

COMMIT;

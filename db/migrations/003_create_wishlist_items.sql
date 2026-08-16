BEGIN;

CREATE TABLE wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (
    char_length(btrim(title)) >= 1
    AND char_length(title) <= 160
  ),
  description text CHECK (
    description IS NULL OR char_length(description) <= 1000
  ),
  url text CHECK (
    url IS NULL OR char_length(url) <= 2000
  ),
  image_url text CHECK (
    image_url IS NULL OR char_length(image_url) <= 2000
  ),
  category text CHECK (
    category IS NULL OR char_length(category) <= 80
  ),
  is_visible boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0 CHECK (
    sort_order BETWEEN -100000 AND 100000
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX wishlist_items_visibility_order_idx
  ON wishlist_items (is_visible, sort_order, created_at, id);

-- Future application update queries should set updated_at = now() explicitly.

COMMIT;

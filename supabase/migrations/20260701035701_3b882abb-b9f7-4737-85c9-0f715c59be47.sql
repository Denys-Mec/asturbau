ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS featured_pages text[] NOT NULL DEFAULT '{}';

UPDATE public.gallery_items
   SET featured_pages = ARRAY['home']::text[]
 WHERE featured_on_home = true
   AND NOT ('home' = ANY(featured_pages));

CREATE INDEX IF NOT EXISTS gallery_items_featured_pages_idx
  ON public.gallery_items USING GIN (featured_pages);
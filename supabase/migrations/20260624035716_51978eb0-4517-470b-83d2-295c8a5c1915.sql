
CREATE TABLE public.gallery_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_categories TO anon, authenticated;
GRANT ALL ON public.gallery_categories TO service_role, authenticated;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery_categories" ON public.gallery_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage gallery_categories" ON public.gallery_categories FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

ALTER TABLE public.gallery_items
  ADD COLUMN category_id uuid REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
  ADD COLUMN featured_on_home boolean NOT NULL DEFAULT false,
  ADD COLUMN home_sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX gallery_items_category_idx ON public.gallery_items(category_id);
CREATE INDEX gallery_items_featured_idx ON public.gallery_items(featured_on_home) WHERE featured_on_home;

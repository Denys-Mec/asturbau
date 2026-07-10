-- 1. Create app_role ENUM safely
DO $$
BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END$$;

-- 2. Create tables
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('image','video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  orientation TEXT NOT NULL DEFAULT 'vertical' CHECK (orientation IN ('vertical','horizontal','square')),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_recipients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id bigint NOT NULL UNIQUE,
  name text,
  phone text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bot_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  password text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Alter tables safely (avoiding duplicate column errors)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery_items' AND column_name='category_id') THEN
    ALTER TABLE public.gallery_items ADD COLUMN category_id uuid REFERENCES public.gallery_categories(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery_items' AND column_name='featured_on_home') THEN
    ALTER TABLE public.gallery_items ADD COLUMN featured_on_home boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery_items' AND column_name='home_sort_order') THEN
    ALTER TABLE public.gallery_items ADD COLUMN home_sort_order integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery_items' AND column_name='featured_pages') THEN
    ALTER TABLE public.gallery_items ADD COLUMN featured_pages text[] NOT NULL DEFAULT '{}';
  END IF;
END$$;

-- 4. Enable RLS and grants
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.gallery_categories TO anon, authenticated;
GRANT ALL ON public.gallery_categories TO service_role, authenticated;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_recipients TO authenticated;
GRANT ALL ON public.notification_recipients TO service_role;
ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.bot_settings TO authenticated;
GRANT ALL ON public.bot_settings TO service_role;
ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;

-- 5. Create functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- 6. Recreate DDL Policies (using direct subqueries to prevent CASCADE drop issues)
DROP POLICY IF EXISTS "users see own roles" ON public.user_roles;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "public read content" ON public.site_content;
CREATE POLICY "public read content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admins write content" ON public.site_content;
CREATE POLICY "admins write content" ON public.site_content FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role)) WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "public read gallery" ON public.gallery_items;
CREATE POLICY "public read gallery" ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admins manage gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "admins manage gallery_items" ON public.gallery_items;
CREATE POLICY "admins manage gallery_items" ON public.gallery_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "anyone can submit leads" ON public.leads;
CREATE POLICY "anyone can submit leads" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 100
  AND length(phone) BETWEEN 3 AND 30
  AND (email IS NULL OR length(email) <= 255)
  AND (message IS NULL OR length(message) <= 2000)
);

DROP POLICY IF EXISTS "admins read leads" ON public.leads;
CREATE POLICY "admins read leads" ON public.leads FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins update leads" ON public.leads;
CREATE POLICY "admins update leads" ON public.leads FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins delete leads" ON public.leads;
CREATE POLICY "admins delete leads" ON public.leads FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "public read gallery_categories" ON public.gallery_categories;
CREATE POLICY "public read gallery_categories" ON public.gallery_categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admins manage gallery_categories" ON public.gallery_categories;
CREATE POLICY "admins manage gallery_categories" ON public.gallery_categories FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins manage recipients" ON public.notification_recipients;
CREATE POLICY "admins manage recipients" ON public.notification_recipients FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "admins manage bot settings" ON public.bot_settings;
CREATE POLICY "admins manage bot settings" ON public.bot_settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 7. Recreate storage policies (outside the drop cascading dependency logic)
DROP POLICY IF EXISTS "admins upload to gallery" ON storage.objects;
CREATE POLICY "admins upload to gallery" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins update gallery" ON storage.objects;
CREATE POLICY "admins update gallery" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins delete gallery" ON storage.objects;
CREATE POLICY "admins delete gallery" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins read gallery" ON storage.objects;
CREATE POLICY "admins read gallery" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'gallery' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role));

-- 8. Seed default content safely
INSERT INTO public.site_content (key, value) VALUES
('home', '{
  "hero_title": "Asturbau Construcción",
  "hero_subtitle": "Будівництво та ремонт під ключ в Астурії",
  "hero_cta": "Залишити заявку",
  "about_title": "Наші переваги",
  "about_text": "У сфері будівництва та ремонту сьогодні працює багато компаній, але наша головна відмінність полягає не лише в якості виконання робіт, а й у підході до кожного клієнта та кожного проєкту. Ми не розглядаємо ремонт або будівництво як просте виконання технічного завдання. Для нас кожен обʼєкт — це інвестиція клієнта, його майбутній комфорт, репутація бізнесу або цінність нерухомості.",
  "advantages": [
    "Багаторічний практичний досвід у будівництві та ремонті",
    "Виконання робіт «під ключ»",
    "Високі стандарти якості на кожному етапі",
    "Прозорість кошторису та вартості робіт",
    "Дотримання узгоджених термінів",
    "Постійний звʼязок із замовником",
    "Індивідуальний підхід до кожного проєкту",
    "Робота як з приватними, так і з комерційними обʼєктами",
    "Використання сучасних технологій та матеріалів",
    "Контроль якості на всіх етапах виконання"
  ],
  "services": [
    {"title":"Комплексний ремонт квартир і будинків","desc":"Виконуємо ремонт під ключ — від демонтажу і чорнових робіт до фінішного оздоблення, електрики, сантехніки та дизайну інтерʼєру. Працюємо з квартирами будь-якої площі та приватними будинками, підбираємо матеріали під бюджет і чітко тримаємося термінів."},
    {"title":"Ремонт комерційних приміщень","desc":"Облаштовуємо офіси, магазини, кафе та ресторани — з урахуванням норм безпеки, бренду й щоденного навантаження. Працюємо позмінно або вночі, щоб мінімізувати простій бізнесу, і здаємо обʼєкт готовим до відкриття."},
    {"title":"Монтаж гіпсокартонних конструкцій","desc":"Зводимо стіни, перегородки, ніші, багаторівневі стелі та декоративні елементи з гіпсокартону. Дотримуємося геометрії, звуко- й теплоізоляції, готуємо поверхні під фарбу, шпалери чи декоративну штукатурку."},
    {"title":"Монтаж автономного опалення","desc":"Проєктуємо й встановлюємо системи індивідуального опалення: газові та електричні котли, радіатори, тепла підлога, розводка труб. Підбираємо обладнання під площу й бюджет, запускаємо систему та навчаємо нею користуватися."}
  ],
  "process": [
    {"step":"01","title":"Перший контакт","desc":"Обговорюємо ваші потреби та задачі"},
    {"step":"02","title":"Виїзд на обʼєкт","desc":"Приїжджаємо на обʼєкт, робимо заміри й оцінюємо обсяг майбутніх робіт."},
    {"step":"03","title":"Кошторис","desc":"Готуємо повний розрахунок вартості з деталізованим списком матеріалів, робіт і встановлюємо терміни виконання."},
    {"step":"04","title":"Договір","desc":"Фіксуємо обсяг, терміни та ціну"},
    {"step":"05","title":"Виконання","desc":"Робота згідно з графіком"},
    {"step":"06","title":"Контроль","desc":"Контроль якості на всіх етапах"},
    {"step":"07","title":"Здача обʼєкта","desc":"Приймання готового результату"}
  ],
  "values_title": "Наші цінності",
  "values_text": "Asturbau Construcción — це команда фахівців із понад 10-річним досвідом ремонту під ключ та будівельних робіт в Астурії. Працюємо чесно, прозоро і відповідально: фіксуємо ціну та строки у договорі, використовуємо сертифіковані матеріали та надаємо гарантію на всі виконані роботи. Виконуємо комплексний ремонт квартир, будинків, офісів і комерційних приміщень у Хіхоні, Овʼєдо, Авілесі та по всьому Князівству Астурія — від демонтажу до фінішного оздоблення під ключ."
}'::jsonb),
('contacts', '{
  "company": "Asturbau Construcción",
  "phone": "+34 643 329 216",
  "email": "info@asturbau.com",
  "address": "Астурія, Іспанія",
  "hours": "Пн–Сб: 9:00 – 19:00",
  "tagline": "Звʼяжіться з нами — підготуємо безкоштовний кошторис"
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.bot_settings (id, password)
VALUES (true, encode(gen_random_bytes(6), 'hex'))
ON CONFLICT (id) DO NOTHING;

-- 9. Create indexes safely
CREATE INDEX IF NOT EXISTS gallery_items_sort_idx ON public.gallery_items(sort_order);
CREATE INDEX IF NOT EXISTS gallery_items_category_idx ON public.gallery_items(category_id);
CREATE INDEX IF NOT EXISTS gallery_items_featured_idx ON public.gallery_items(featured_on_home) WHERE featured_on_home;
CREATE INDEX IF NOT EXISTS gallery_items_featured_pages_idx ON public.gallery_items USING GIN (featured_pages);

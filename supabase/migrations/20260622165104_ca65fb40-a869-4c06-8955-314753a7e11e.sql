
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Editable content (key/value JSON)
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Gallery
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('image','video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  orientation TEXT NOT NULL DEFAULT 'vertical' CHECK (orientation IN ('vertical','horizontal','square')),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX gallery_items_sort_idx ON public.gallery_items(sort_order);
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT ALL ON public.gallery_items TO service_role, authenticated;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery" ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage gallery" ON public.gallery_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed default content
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
    {"title":"Ремонт квартир і будинків","desc":"Повний цикл ремонту житлових приміщень під ключ"},
    {"title":"Реконструкція","desc":"Повна реконструкція житлових та комерційних обʼєктів"},
    {"title":"Внутрішнє оздоблення","desc":"Якісне внутрішнє оздоблення приміщень"},
    {"title":"Гіпсокартонні конструкції","desc":"Монтаж стін, перегородок та стельових систем"},
    {"title":"Ресторани та комерція","desc":"Роботи в ресторанах та комерційних приміщеннях"},
    {"title":"Офіси та реконструкція","desc":"Офіси, туристичні обʼєкти та реконструкція будівель"}
  ],
  "process": [
    {"step":"01","title":"Перший контакт","desc":"Обговорюємо ваші потреби та задачі"},
    {"step":"02","title":"Виїзд на обʼєкт","desc":"Замір та оцінка фронту робіт"},
    {"step":"03","title":"Кошторис","desc":"Прозорий розрахунок вартості"},
    {"step":"04","title":"Договір","desc":"Фіксуємо обсяг, терміни та ціну"},
    {"step":"05","title":"Виконання","desc":"Робота згідно з графіком"},
    {"step":"06","title":"Контроль","desc":"Контроль якості на всіх етапах"},
    {"step":"07","title":"Здача обʼєкта","desc":"Приймання готового результату"}
  ],
  "values_title": "Наші цінності",
  "values_text": "Чесність, якість, відповідальність, професіоналізм та довгострокові відносини з клієнтами. Ми прагнемо стати однією з найбільш надійних будівельно-ремонтних компаній в Астурії."
}'::jsonb),
('contacts', '{
  "company": "Asturbau Construcción",
  "phone": "+34 643 329 216",
  "email": "info@asturbau.com",
  "address": "Астурія, Іспанія",
  "hours": "Пн–Сб: 9:00 – 19:00",
  "tagline": "Звʼяжіться з нами — підготуємо безкоштовний кошторис"
}'::jsonb);

UPDATE public.site_content
SET value = jsonb_set(
  value,
  '{process,2,desc}',
  '"Готуємо повний розрахунок вартості з деталізованим списком матеріалів, робіт і встановлюємо терміни виконання."'
)
WHERE key = 'home';
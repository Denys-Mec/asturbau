UPDATE public.site_content
SET value = jsonb_set(
  jsonb_set(
    value,
    '{process,1,desc}',
    '"Приїжджаємо на обʼєкт, робимо заміри й оцінюємо обсяг майбутніх робіт."'
  ),
  '{process,2,desc}',
  '"Готуємо повний розрахунок вартості з деталізованим списком матеріалів, робіт і встановлюємо строки."'
)
WHERE key = 'home';
import svcApartment from "@/assets/svc-apartment.jpg";
import svcRestaurant from "@/assets/svc-restaurant.jpg";
import svcDrywall from "@/assets/svc-drywall.jpg";
import svcHeating from "@/assets/svc-heating.jpg";
import collageBathroom from "@/assets/collage-bathroom.jpg";
import collageKitchen from "@/assets/collage-kitchen.jpg";
import collageLiving from "@/assets/collage-living.jpg";
import heroConstruction from "@/assets/hero-construction.jpg";
import type { Lang } from "./translations";

type LocalizedFields = {
  title: string;
  shortTitle: string;
  desc: string;
  features: string[];
  includes: { title: string; items: string[] }[];
};

export type ServiceDef = LocalizedFields & {
  slug: string;
  image: string;
};

type RawService = {
  slug: string;
  image: string;
  es: LocalizedFields;
  uk: LocalizedFields;
};

const RAW: RawService[] = [
  {
    slug: "remont-kvartyr",
    image: collageLiving,
    es: {
      shortTitle: "Reforma de pisos",
      title: "Reforma de pisos",
      desc: "Realizamos reformas de pisos de cualquier superficie — desde renovaciones cosméticas hasta reformas integrales. Trabajamos en edificios residenciales, obra nueva y viviendas de segunda mano, acordamos plazos y presupuesto desde el inicio y mantenemos la obra limpia.",
      features: [
        "Niveles cosmético, integral y premium",
        "Trabajos en bruto y de acabado",
        "Selección y suministro de materiales",
        "Plazos y presupuesto acordados con claridad",
      ],
      includes: [
        { title: "Trabajos en bruto", items: ["Demolición", "Solera", "Enlucido", "Electricidad", "Fontanería"] },
        { title: "Acabados", items: ["Azulejos", "Pintura", "Papel pintado", "Tarima laminada", "Estuco decorativo"] },
        { title: "Final", items: ["Puertas y ventanas", "Iluminación", "Sanitarios", "Mobiliario llave en mano"] },
      ],
    },
    uk: {
      shortTitle: "Ремонт квартир",
      title: "Ремонт квартир",
      desc: "Виконуємо ремонт квартир будь-якої площі — від косметичного оновлення до капітального переобладнання. Працюємо у житлових будинках, новобудовах і вторинному житлі, погоджуємо терміни та бюджет на старті й тримаємо чисто на обʼєкті.",
      features: [
        "Косметичний, капітальний, преміум рівні",
        "Чорнові та чистові роботи",
        "Підбір і доставка матеріалів",
        "Чітко погоджені терміни й кошторис",
      ],
      includes: [
        { title: "Чорнові роботи", items: ["Демонтаж", "Стяжка підлоги", "Штукатурка", "Електрика", "Сантехніка"] },
        { title: "Оздоблення", items: ["Плитка", "Фарбування", "Шпалери", "Ламінат", "Декоративна штукатурка"] },
        { title: "Фінал", items: ["Двері й вікна", "Освітлення", "Сантехнічне обладнання", "Меблі під ключ"] },
      ],
    },
  },
  {
    slug: "remont-budynkiv",
    image: heroConstruction,
    es: {
      shortTitle: "Reforma de casas",
      title: "Reforma de casas particulares",
      desc: "Reforma y reconstrucción de casas particulares, chalets y adosados. Trabajamos con fachadas, cubiertas, sistemas de ingeniería y acabados interiores — desde habitaciones individuales hasta la obra completa llave en mano.",
      features: [
        "Reconstrucción y ampliación",
        "Aislamiento de fachadas y cubiertas",
        "Redes de ingeniería y calefacción autónoma",
        "Acabados interiores llave en mano",
      ],
      includes: [
        { title: "Estructura", items: ["Cimentaciones y refuerzos", "Cubierta y tejado", "Fachadas y aislamiento", "Forjados"] },
        { title: "Ingeniería", items: ["Calefacción", "Suministro de agua", "Saneamiento", "Electricidad"] },
        { title: "Acabados", items: ["Trabajos interiores", "Escaleras y barandillas", "Suelos", "Techos"] },
      ],
    },
    uk: {
      shortTitle: "Ремонт будинків",
      title: "Ремонт приватних будинків",
      desc: "Ремонт і реконструкція приватних будинків, котеджів і таунхаусів. Працюємо з фасадами, дахами, інженерними системами та внутрішнім оздобленням — від окремих кімнат до повного обʼєкта під ключ.",
      features: [
        "Реконструкція й добудова",
        "Утеплення фасадів і дахів",
        "Інженерні мережі та автономне опалення",
        "Внутрішнє оздоблення під ключ",
      ],
      includes: [
        { title: "Конструктив", items: ["Фундаменти й підсилення", "Дах і покрівля", "Фасади та утеплення", "Перекриття"] },
        { title: "Інженерія", items: ["Опалення", "Водопостачання", "Каналізація", "Електрика"] },
        { title: "Оздоблення", items: ["Внутрішні роботи", "Сходи й перила", "Підлоги", "Стелі"] },
      ],
    },
  },
  {
    slug: "remont-ofisiv",
    image: svcRestaurant,
    es: {
      shortTitle: "Reforma de oficinas",
      title: "Reforma de oficinas",
      desc: "Adecuamos oficinas y coworkings teniendo en cuenta los flujos de trabajo, la acústica y la marca de la empresa. Trabajamos por turnos o fuera del horario laboral para no detener su negocio, y entregamos la obra lista para ocupar.",
      features: [
        "Zonificación y planificación open-space",
        "Soluciones acústicas y mamparas",
        "Cableado estructurado",
        "Trabajo fuera del horario laboral",
      ],
      includes: [
        { title: "Planificación", items: ["Open-space", "Despachos", "Salas de reuniones", "Recepción", "Cocina y aseos"] },
        { title: "Ingeniería", items: ["Electricidad y cableado", "Ventilación y climatización", "Iluminación"] },
        { title: "Acabados", items: ["Suelos", "Techos (Armstrong, pladur)", "Mamparas de cristal", "Elementos de marca"] },
      ],
    },
    uk: {
      shortTitle: "Ремонт офісів",
      title: "Ремонт офісних приміщень",
      desc: "Облаштовуємо офіси й коворкінги з урахуванням робочих процесів, акустики та бренду компанії. Працюємо позмінно або в неробочий час, щоб не зупиняти бізнес, і здаємо обʼєкт готовим до заселення.",
      features: [
        "Зонування та open-space планування",
        "Акустичні рішення й перегородки",
        "Структурована кабельна мережа",
        "Робота в неробочий час",
      ],
      includes: [
        { title: "Планування", items: ["Open-space", "Кабінети", "Переговорні", "Reception", "Кухня й санвузли"] },
        { title: "Інженерія", items: ["Електрика й СКС", "Вентиляція й кондиціонування", "Освітлення"] },
        { title: "Оздоблення", items: ["Підлоги", "Стелі (Armstrong, ГКЛ)", "Скляні перегородки", "Брендовані елементи"] },
      ],
    },
  },
  {
    slug: "komertsiynyi-remont",
    image: svcRestaurant,
    es: {
      shortTitle: "Reforma de locales comerciales",
      title: "Reforma de locales comerciales",
      desc: "Adecuamos tiendas, cafeterías, restaurantes, hoteles y salones — teniendo en cuenta la normativa de seguridad, la marca y el uso diario. Trabajamos por turnos o de noche para minimizar el tiempo de inactividad, y entregamos el local listo para abrir.",
      features: [
        "Trabajo por turnos y en horario nocturno",
        "Cumplimiento de normas de seguridad y sanitarias",
        "Estilo de acabado según marca",
        "Puesta en marcha rápida del local",
      ],
      includes: [
        { title: "Tipos de local", items: ["Tiendas y showrooms", "Cafeterías y restaurantes", "Hoteles y apartamentos", "Salones de belleza"] },
        { title: "Qué incluye", items: ["Planificación del espacio", "Electricidad y ventilación", "Fontanería", "Acabados de paredes, suelo y techo", "Instalación de equipamiento comercial"] },
      ],
    },
    uk: {
      shortTitle: "Ремонт комерційних приміщень",
      title: "Ремонт комерційних приміщень",
      desc: "Облаштовуємо магазини, кафе, ресторани, готелі та салони — з урахуванням норм безпеки, бренду й щоденного навантаження. Працюємо позмінно або вночі, щоб мінімізувати простій бізнесу, і здаємо обʼєкт готовим до відкриття.",
      features: [
        "Робота позмінно та в нічний час",
        "Дотримання норм безпеки та санітарії",
        "Брендована оздоблювальна стилістика",
        "Швидкий запуск обʼєкта в експлуатацію",
      ],
      includes: [
        { title: "Типи обʼєктів", items: ["Магазини й шоуруми", "Кафе та ресторани", "Готелі й апартаменти", "Салони краси"] },
        { title: "Що входить", items: ["Планування простору", "Електрика та вентиляція", "Сантехніка", "Оздоблення стін, підлоги, стелі", "Монтаж торгового обладнання"] },
      ],
    },
  },
  {
    slug: "remont-novobudov",
    image: svcApartment,
    es: {
      shortTitle: "Reforma de obra nueva",
      title: "Reforma de pisos de obra nueva",
      desc: "Nos especializamos en reformar pisos desde cero — desde el estado bruto hasta la entrada completa. Tenemos en cuenta las particularidades de la obra nueva (asentamiento, insonorización, redistribución), construimos la ingeniería desde cero y preparamos el piso para su estilo de vida.",
      features: [
        "Reforma desde cero de promotor",
        "Insonorización de paredes y techos",
        "Electricidad y fontanería desde cero",
        "Posibilidad de redistribución",
      ],
      includes: [
        { title: "Trabajos en bruto", items: ["Levantamiento de tabiques", "Solera", "Enlucido de paredes", "Electricidad", "Fontanería"] },
        { title: "Acabados", items: ["Azulejos", "Pintura", "Papel pintado", "Suelos", "Techos"] },
        { title: "Finalización", items: ["Puertas", "Iluminación", "Sanitarios", "Cocina y mobiliario"] },
      ],
    },
    uk: {
      shortTitle: "Ремонт новобудов",
      title: "Ремонт квартир у новобудовах",
      desc: "Спеціалізуємось на ремонті квартир з нуля — від чорнового стану до повного заїзду. Враховуємо особливості новобудов (усадка, шумоізоляція, перепланування), будуємо інженерію з нуля та готуємо квартиру під ваш стиль життя.",
      features: [
        "Ремонт з нуля від забудовника",
        "Шумоізоляція стін і стелі",
        "Електрика й сантехніка з нуля",
        "Можливість перепланування",
      ],
      includes: [
        { title: "Чорнові роботи", items: ["Зведення перегородок", "Стяжка підлоги", "Штукатурка стін", "Електрика", "Сантехніка"] },
        { title: "Оздоблення", items: ["Плитка", "Фарбування", "Шпалери", "Підлоги", "Стелі"] },
        { title: "Завершення", items: ["Двері", "Освітлення", "Сантехнічне обладнання", "Кухня й меблі"] },
      ],
    },
  },
  {
    slug: "montazh-avtonomnoho-opalennia",
    image: svcHeating,
    es: {
      shortTitle: "Instalación de calefacción",
      title: "Instalación de calefacción autónoma",
      desc: "Diseñamos e instalamos sistemas de calefacción autónoma para pisos, casas y locales comerciales. Instalamos calderas de gas y eléctricas, suelo radiante, radiadores y colectores — con puesta en marcha y garantía.",
      features: [
        "Calderas de gas y eléctricas",
        "Suelo radiante (agua y eléctrico)",
        "Calefacción por radiadores",
        "Puesta en marcha del sistema",
      ],
      includes: [
        { title: "Equipamiento", items: ["Calderas", "Termos de acumulación", "Colectores", "Bombas circuladoras", "Vasos de expansión"] },
        { title: "Instalación", items: ["Distribución de tuberías", "Radiadores", "Suelo radiante", "Automatismos y termostatos", "Prueba de presión y arranque"] },
      ],
    },
    uk: {
      shortTitle: "Монтаж автономного опалення",
      title: "Монтаж автономного опалення",
      desc: "Проєктуємо й монтуємо системи автономного опалення для квартир, будинків і комерційних обʼєктів. Встановлюємо газові та електричні котли, теплу підлогу, радіатори й колекторні групи — з пусконалагодженням і гарантією.",
      features: [
        "Газові та електричні котли",
        "Тепла підлога (водяна й електрична)",
        "Радіаторне опалення",
        "Пусконалагодження системи",
      ],
      includes: [
        { title: "Обладнання", items: ["Котли", "Бойлери непрямого нагріву", "Колектори й гребінки", "Циркуляційні насоси", "Розширювальні баки"] },
        { title: "Монтаж", items: ["Розводка труб", "Радіатори", "Тепла підлога", "Автоматика й термостати", "Опресовка та запуск"] },
      ],
    },
  },
  {
    slug: "pereplanuvannya-kvartyr",
    image: collageLiving,
    es: {
      shortTitle: "Redistribución de pisos",
      title: "Redistribución de pisos",
      desc: "Realizamos la redistribución de pisos — desde el proyecto y la tramitación hasta el derribo de tabiques, el levantamiento de nuevas divisiones y la restauración de los acabados. Le ayudamos a legalizar los cambios y tramitar la documentación.",
      features: [
        "Proyecto de redistribución",
        "Tramitación de documentos",
        "Derribo y construcción de tabiques",
        "Restauración de acabados",
      ],
      includes: [
        { title: "Fases", items: ["Inspección del piso", "Desarrollo del proyecto", "Tramitación", "Derribo de paredes", "Levantamiento de nuevos tabiques"] },
        { title: "Después", items: ["Electricidad y fontanería", "Acabados", "Puesta en servicio"] },
      ],
    },
    uk: {
      shortTitle: "Перепланування квартир",
      title: "Перепламування квартир",
      desc: "Виконуємо перепланування квартир — від проєктування й погодження до демонтажу стін, зведення нових перегородок і відновлення оздоблення. Допомагаємо легалізувати зміни та оформити документи.",
      features: [
        "Проєкт перепланування",
        "Узгодження документів",
        "Демонтаж і зведення перегородок",
        "Відновлення оздоблення",
      ],
      includes: [
        { title: "Етапи", items: ["Обстеження квартири", "Розробка проєкту", "Узгодження", "Демонтаж стін", "Зведення нових перегородок"] },
        { title: "Після", items: ["Електрика й сантехніка", "Оздоблення", "Введення в експлуатацію"] },
      ],
    },
  },
  {
    slug: "santekhnichni-roboty",
    image: collageBathroom,
    es: {
      shortTitle: "Servicios de fontanería",
      title: "Trabajos de fontanería",
      desc: "Realizamos toda la gama de trabajos de fontanería: instalación y sustitución de tuberías, montaje de bañeras, mamparas, inodoros, grifos y termos. Trabajamos con sistemas de cobre, multicapa y polipropileno.",
      features: [
        "Distribución de agua y saneamiento",
        "Instalación de aparatos sanitarios",
        "Sustitución de bajantes",
        "Reparación de fugas y averías",
      ],
      includes: [
        { title: "Instalación", items: ["Tuberías de suministro", "Saneamiento", "Colectores", "Filtros y reductores"] },
        { title: "Equipamiento", items: ["Bañeras y mamparas", "Inodoros y bidés", "Lavabos y grifos", "Termos", "Lavadoras y lavavajillas"] },
      ],
    },
    uk: {
      shortTitle: "Послуги сантехніка",
      title: "Сантехнічні роботи",
      desc: "Виконуємо повний спектр сантехнічних робіт: монтаж і заміна труб, встановлення ванн, душових кабін, унітазів, змішувачів і бойлерів. Працюємо з мідними, металопластиковими й поліпропіленовими системами.",
      features: [
        "Розводка води й каналізації",
        "Монтаж сантехнічних приладів",
        "Заміна стояків",
        "Усунення протікань і аварій",
      ],
      includes: [
        { title: "Монтаж", items: ["Труби водопостачання", "Каналізація", "Колектори й гребінки", "Фільтри та редуктори"] },
        { title: "Обладнання", items: ["Ванни й душові кабіни", "Унітази й біде", "Раковини й змішувачі", "Бойлери", "Пральні й посудомийні машини"] },
      ],
    },
  },
  {
    slug: "elektromontazhni-roboty",
    image: svcDrywall,
    es: {
      shortTitle: "Servicios de electricidad",
      title: "Instalación eléctrica",
      desc: "Diseñamos y realizamos la instalación eléctrica en pisos, casas y locales comerciales. Tendemos canalizaciones, montamos cuadros, instalamos enchufes, interruptores y luminarias — cumpliendo la normativa de seguridad.",
      features: [
        "Diseño de la instalación eléctrica",
        "Tendido de canalizaciones",
        "Montaje de cuadros eléctricos",
        "Toma de tierra y diferenciales",
      ],
      includes: [
        { title: "Cableado", items: ["Rozas", "Tendido de cable", "Cajas de mecanismos", "Cajas de derivación"] },
        { title: "Equipamiento", items: ["Cuadros eléctricos", "Magnetotérmicos y diferenciales", "Enchufes e interruptores", "Luminarias y apliques", "Sistemas de domótica"] },
      ],
    },
    uk: {
      shortTitle: "Послуги електрика",
      title: "Електромонтажні роботи",
      desc: "Проєктуємо й виконуємо електрику в квартирах, будинках і комерційних приміщеннях. Прокладаємо кабельні траси, збираємо щити, встановлюємо розетки, вимикачі та світильники — з дотриманням норм безпеки.",
      features: [
        "Проєктування електрики",
        "Прокладання кабельних трас",
        "Збірка електрощитів",
        "Заземлення й УЗО",
      ],
      includes: [
        { title: "Розводка", items: ["Штроблення", "Прокладання кабелю", "Підрозетники", "Розподільчі коробки"] },
        { title: "Обладнання", items: ["Електрощити", "Автомати й УЗО", "Розетки й вимикачі", "Світильники й бра", "Системи розумного дому"] },
      ],
    },
  },
  {
    slug: "plytkovi-roboty",
    image: collageBathroom,
    es: {
      shortTitle: "Servicios de alicatado",
      title: "Colocación de azulejos",
      desc: "Colocamos azulejos cerámicos, gres porcelánico, mosaico y piedra natural en baños, cocinas, suelos, encimeras y fachadas. Respetamos la geometría de las juntas, trabajamos con impermeabilización y suelo radiante.",
      features: [
        "Preparación de la base e impermeabilización",
        "Geometría precisa de las juntas",
        "Colocación en diagonal, espiga, sin juntas",
        "Trabajo con formato grande",
      ],
      includes: [
        { title: "Superficies", items: ["Paredes", "Suelo", "Encimeras", "Escaleras", "Fachadas"] },
        { title: "Materiales", items: ["Azulejo cerámico", "Gres porcelánico", "Mosaico", "Piedra natural", "Clinker"] },
      ],
    },
    uk: {
      shortTitle: "Послуги плиточника",
      title: "Укладання плитки",
      desc: "Укладаємо керамічну плитку, керамограніт, мозаїку та натуральний камінь у ванних, кухнях, на підлозі, фартухах і фасадах. Дотримуємось геометрії швів, працюємо з гідроізоляцією й теплою підлогою.",
      features: [
        "Підготовка основи й гідроізоляція",
        "Точна геометрія швів",
        "Укладання діагональ, ялинка, безшовно",
        "Робота з великим форматом",
      ],
      includes: [
        { title: "Поверхні", items: ["Стіни", "Підлога", "Фартухи", "Сходи", "Фасади"] },
        { title: "Матеріали", items: ["Керамічна плитка", "Керамограніт", "Мозаїка", "Натуральний камінь", "Клінкер"] },
      ],
    },
  },
  {
    slug: "stolyarni-roboty",
    image: collageKitchen,
    es: {
      shortTitle: "Servicios de carpintería",
      title: "Trabajos de carpintería",
      desc: "Fabricamos e instalamos productos de carpintería: puertas, ventanas, escaleras, armarios empotrados, cocinas y mobiliario a medida. Trabajamos con madera maciza, chapa, aglomerado y MDF — desde el montaje inicial hasta el acabado final.",
      features: [
        "Mobiliario a medida",
        "Instalación de puertas y ventanas",
        "Armarios empotrados y vestidores",
        "Escaleras y barandillas de madera",
      ],
      includes: [
        { title: "Productos", items: ["Puertas de interior", "Ventanas", "Escaleras", "Cocinas", "Armarios y vestidores"] },
        { title: "Instalación", items: ["Preparación de huecos", "Montaje", "Ajuste de herrajes", "Acabado de uniones"] },
      ],
    },
    uk: {
      shortTitle: "Послуги столяра",
      title: "Столярні роботи",
      desc: "Виготовляємо й монтуємо столярні вироби: двері, вікна, сходи, вбудовані шафи, кухні й меблі під замовлення. Працюємо з масивом дерева, шпоном, ЛДСП та МДФ — від чорнового монтажу до фінішного оздоблення.",
      features: [
        "Меблі під замовлення",
        "Монтаж дверей і вікон",
        "Вбудовані шафи та гардеробні",
        "Дерев'яні сходи й перила",
      ],
      includes: [
        { title: "Вироби", items: ["Двері міжкімнатні", "Вікна", "Сходи", "Кухні", "Шафи-купе та гардеробні"] },
        { title: "Монтаж", items: ["Підготовка прорізів", "Встановлення", "Регулювання фурнітури", "Оздоблення примикань"] },
      ],
    },
  },
];

function toService(raw: RawService, lang: Lang): ServiceDef {
  const l = raw[lang] ?? raw.es;
  return { slug: raw.slug, image: raw.image, ...l };
}

export function getServices(lang: Lang): ServiceDef[] {
  return RAW.map((r) => toService(r, lang));
}

export function getServiceBySlug(slug: string, lang: Lang): ServiceDef | undefined {
  const raw = RAW.find((r) => r.slug === slug);
  return raw ? toService(raw, lang) : undefined;
}

// Slug list used by loaders (language-independent).
export const SERVICE_SLUGS = RAW.map((r) => r.slug);

export function serviceExists(slug: string) {
  return RAW.some((r) => r.slug === slug);
}

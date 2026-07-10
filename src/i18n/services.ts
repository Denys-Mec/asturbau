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
    slug: "remont-pid-kliuch",
    image: collageLiving,
    es: {
      shortTitle: "Reforma integral",
      title: "Reforma integral de pisos y casas",
      desc: "Ofrecemos servicios profesionales de reformas integrales en Gijón, Oviedo, Avilés y toda Asturias. Nos encargamos de todo el proceso de renovación de su vivienda: desde la demolición de tabiques, desescombro y renovación completa de instalaciones, hasta el enlucido de paredes, colocación de pavimentos y montaje de mobiliario. Ejecutamos proyectos llave en mano con presupuesto cerrado garantizado por contrato, control técnico riguroso de cada etapa de obra y la máxima limpieza para que disfrute de su hogar renovado sin preocupaciones.\n\nNuestra metodología se basa en la coordinación centralizada de todos los gremios bajo la supervisión de un único jefe de obra. Esto elimina los errores de comunicación comunes y reduce los tiempos de ejecución hasta en un 30%. Trabajamos con materiales certificados de primeras marcas y adaptamos las soluciones de aislamiento termoacústico y climatización a las necesidades climáticas específicas de Asturias.\n\nCon más de 10 años de experiencia, ofrecemos una total transparencia en el presupuesto detallado por partidas de obra. Los pagos se realizan de forma escalonada tras la finalización y aprobación de cada fase de los trabajos por su parte, proporcionándole la tranquilidad y confianza que merece en su proyecto de reforma.",
      features: [
        "Coordinación completa de oficios",
        "Presupuesto cerrado sin sorpresas",
        "Garantía de calidad por escrito",
        "Control técnico de cada etapa",
      ],
      includes: [
        { title: "Fase inicial", items: ["Demoliciones", "Retirada de escombros", "Levantamiento de tabiques", "Planificación de espacios"] },
        { title: "Fase técnica", items: ["Fontanería completa", "Instalación eléctrica", "Sistemas de calefacción y climatización"] },
        { title: "Acabados premium", items: ["Enlucido y yeso", "Alicatado y solados", "Pintura y papel pintado", "Montaje de iluminación y sanitarios"] },
      ],
    },
    uk: {
      shortTitle: "Комплексний ремонт",
      title: "Комплексний ремонт квартир та приватних будинків",
      desc: "Професійні послуги з комплексного ремонту квартир, котеджів та приватних будинків у Хіхоні, Ов'єдо, Авілесі та по всій Астурії. Ми виконуємо повний спектр будівельно-оздоблювальних робіт під ключ: від перепланування, демонтажу старих конструкцій, прокладання нових інженерних мереж до чистового оздоблення стін, укладання підлоги та встановлення вбудованих меблів. Завдяки власному штату майстрів та суворому дотриманню технологій, ми гарантуємо фіксовану вартість кошторису, офіційну гарантію за договором та здачу об'єкта в ідеальному стані без затримок.\n\nНаша методологія базується на єдиному центрі координації всіх процесів: за кожним об'єктом закріплюється досвідчений виконроб, який контролює кожен етап — від доставки будматеріалів до фінішного прибирання. Це повністю позбавляє вас потреби спілкуватися з окремими майстрами та узгоджувати їхні графіки. Ми використовуємо виключно сертифіковані будівельні матеріали європейських брендів і суворо дотримуємося технологічних перерв для забезпечення максимальної міцності й довговічності покриттів.\n\nПеред початком робіт ми складаємо деталізований кошторис, де кожна послуга розписана по статтях. Оплата здійснюється поетапно — ви платите лише за фактично виконані та прийняті вами етапи робіт. Такий підхід забезпечує повну прозорість бюджету та дає впевненість у відсутності прихованих платежів і непередбачуваних витрат.",
      features: [
        "Повний супровід та координація робіт",
        "Фіксований кошторис без переплат",
        "Офіційна гарантія на всі роботи",
        "Контроль якості на кожному етапі",
      ],
      includes: [
        { title: "Початковий етап", items: ["Демонтажні роботи", "Вивіз будівельного сміття", "Зведення нових перегородок", "Планування простору"] },
        { title: "Інженерний етап", items: ["Нова сантехніка й опалення", "Електромонтажні роботи", "Шумо- та теплоізоляція"] },
        { title: "Чистове оздоблення", items: ["Вирівнювання стін та підлоги", "Укладання плитки та підлогових покриттів", "Фарбування та декор", "Монтаж освітлення й сантехприладів"] },
      ],
    },
  },
  {
    slug: "remont-ofisiv-ta-komertsii",
    image: svcRestaurant,
    es: {
      shortTitle: "Locales y oficinas",
      title: "Reforma de locales comerciales, oficinas y restaurantes",
      desc: "Especialistas en reforma y adecuación de locales comerciales, oficinas, tiendas y espacios de hostelería en Asturias. Optimizamos la distribución de su negocio para cumplir con las normativas municipales vigentes de accesibilidad e insonorización, instalamos sistemas de ventilación comercial, climatización e iluminación LED de alta eficiencia. Ofrecemos una planificación ágil de los trabajos, con posibilidad de ejecución en horario nocturno o en días festivos para minimizar el tiempo de inactividad de su negocio y asegurar una apertura rápida.\n\nEntendemos que en el sector comercial cada día de inactividad representa una pérdida económica. Por ello, desarrollamos un cronograma de obra extremadamente ajustado y coordinamos los trabajos de fontanería, electricidad y acabados de forma paralela. Utilizamos materiales de alta resistencia al tránsito diario y de fácil mantenimiento, ideales para locales comerciales concurridos y oficinas corporativas.\n\nNos encargamos de toda la preparación técnica de la obra para facilitar la obtención de las licencias de apertura correspondientes. Desde la insonorización acústica hasta la accesibilidad para personas con movilidad reducida, garantizamos el estricto cumplimiento del Código Técnico de la Edificación (CTE) y las ordenanzas locales.",
      features: [
        "Planificación optimizada del espacio",
        "Instalaciones eléctricas y climatización comercial",
        "Acabados de alta resistencia",
        "Trabajo nocturno y festivo disponible",
      ],
      includes: [
        { title: "Espacios y zonificación", items: ["Mamparas divisorias y de cristal", "Falsos techos técnicos", "Zonas comunes", "Salas de reuniones", "Comedores y aseos"] },
        { title: "Ingeniería técnica", items: ["Iluminación led comercial", "Climatización y ventilación forzada", "Cableado de red y telefonía estructurada"] },
        { title: "Normativa y seguridad", items: ["Instalaciones contra incendios", "Salidas de emergencia", "Accesibilidad para personas con movilidad reducida", "Licencias de apertura"] },
      ],
    },
    uk: {
      shortTitle: "Комерція та офіси",
      title: "Ремонт офісів, ресторанів та комерційних приміщень",
      desc: "Якісний ремонт комерційної нерухомості, офісів, коворкінгів, магазинів та закладів громадського харчування в Астурії. Ми розробляємо функціональне зонування для покращення продуктивності працівників та привабливості для клієнтів. Виконуємо професійний монтаж комерційного освітлення, систем кондиціонування, вентиляції, зносостійких підлогових покриттів та офісних перегородок. Надаємо гнучкий графік робіт (зокрема нічні зміни та вихідні дні), щоб ваш бізнес не зупиняв свою діяльність під час ремонту.\n\nУ комерційному секторі кожен день простою — це втрачений прибуток. Саме тому ми складаємо детальний мережевий графік виконання робіт і паралельно залучаємо майстрів різних спеціальностей. Завдяки чіткій координації електромонтажні, сантехнічні та оздоблювальні роботи виконуються без жодних затримок, а матеріали високої зносостійкості забезпечать довговічність інтер'єру за умов великого щоденного потоку людей.\n\nМи ретельно готуємо об'єкт до відповідності всім вимогам безпеки та санітарних норм для безперешкодного отримання дозвільних документів на ведення діяльності. Звукоізоляція перегородок, пожежна безпека інженерних систем та створення безбар'єрного простору — кожен технічний параметр буде виконано у суворій відповідності до регламентів та ліцензійних умов.",
      features: [
        "Оптимізація робочого простору під задачі бізнесу",
        "Зносостійкі та довговічні матеріали",
        "Професійні системи вентиляції та кондиціонування",
        "Гнучкий графік робіт (нічні зміни)",
      ],
      includes: [
        { title: "Планування та зони", items: ["Офісні та скляні перегородки", "Підвісні технічні стелі (Armstrong)", "Облаштування рецепції та переговорних", "Кухні та санвузли"] },
        { title: "Інженерні системи", items: ["Спеціалізоване комерційне освітлення", "Системи вентиляції та клімат-контролю", "Прокладання СКС та локальних мереж"] },
        { title: "Безпека та нормативи", items: ["Пожежна сигналізація", "Аварійні виходи та освітлення", "Інклюзивність приміщень", "Підготовка під дозвільну документацію"] },
      ],
    },
  },
  {
    slug: "planuvannia-ta-pereplanuvannia",
    image: collageKitchen,
    es: {
      shortTitle: "Planificación",
      title: "Planificación y redistribución de espacios",
      desc: "Servicio técnico de estudio, planificación y optimización del plano de distribución de viviendas y locales en Asturias. Con el asesoramiento directo de nuestro diseñador de plantilla, creamos propuestas detalladas de tabiquería para maximizar la luz natural, ampliar visualmente las estancias y mejorar la ergonomía de su hogar. Preparamos los planos de planta técnicos necesarios para la ejecución de la obra, incluyendo el replanteo de muros, esquemas de electricidad y fontanería, garantizando que cada metro cuadrado sea útil y funcional antes de comenzar la reforma.\n\nUn buen plano de distribución es el pilar de cualquier reforma exitosa. Analizamos la estructura del inmueble, detectamos los muros de carga y las bajantes para proponer una redistribución realista que evite costes innecesarios. Nuestro enfoque técnico nos permite redefinir el espacio uniendo estancias (como cocinas abiertas al salón) o creando zonas de almacenamiento integradas de manera natural.\n\nAunque contamos con el asesoramiento de nuestro diseñador de interiores para definir las mejores distribuciones y optimizar la iluminación, no ofrecemos este servicio como un costoso proyecto de decoración independiente. Lo integramos directamente dentro de nuestra planificación técnica para que ahorre costes innecesarios y obtenga planos constructivos listos para ejecutar la obra con total precisión.",
      features: [
        "Distribución óptima de tabiques",
        "Maximización de la superficie útil",
        "Soluciones ergonómicas a medida",
        "Planos de planta técnicos detallados",
      ],
      includes: [
        { title: "Estudio inicial", items: ["Medición de cotas", "Análisis de muros de carga", "Propuestas de distribución de planta"] },
        { title: "Planes de distribución", items: ["Diseño de tabiquería nueva", "Zonificación funcional", "Planos técnicos de distribución para la obra"] },
        { title: "Instalaciones", items: ["Esquema de distribución de tomas", "Coordinación con fontanería y electricidad"] },
      ],
    },
    uk: {
      shortTitle: "Планування приміщень",
      title: "Планування та перепланування приміщень",
      desc: "Технічні послуги з планування, перепланування та ергономічної оптимізації простору квартир, офісів та комерційних площ. За допомогою нашого штатного дизайнера ми розробляємо детальні планувальні рішення, креслення демонтажу та монтажу стін, враховуючи наявність несучих конструкцій та розташування мокрих зон. Складаємо точні плани розстановки меблів та прив'язки інженерних виводів для будівельників, що дозволяє отримати максимально функціональний простір без переплат за повноцінний дизайн-проєкт.\n\nПрофесійно розроблене планування — це фундамент комфорту та довговічності вашого ремонту. Ми аналізуємо архітектурні особливості приміщення, розташування стояків водопостачання та вентиляційних каналів, щоб запропонувати реалістичні рішення перепланування. Наш підхід допомагає розширити простір, об'єднати кімнати (наприклад, створити кухню-студію) або виділити зони зберігання, не порушуючи капітальної міцності будівлі.\n\nХоча наш штатний дизайнер допомагає знайти найкращі ергономічні рішення та оптимізувати світлові сценарії, ми не нав'язуємо це як окрему дорогу послугу візуалізації чи декорування. Цей етап повністю орієнтований на будівельну логіку та інтегрований у підготовчу стадію розробки робочих креслень, що суттєво економить ваш бюджет і гарантує безпомилковий монтаж стін та інженерії.",
      features: [
        "Оптимальний розподіл перегородок",
        "Максимальне використання корисної площі",
        "Зручне й ергономічне зонування",
        "Детальні технічні плани планування",
      ],
      includes: [
        { title: "Вивчення обʼєкта", items: ["Точні обміри приміщень", "Визначення несучих стін", "Розробка варіантів планувань"] },
        { title: "Технічна частина", items: ["План монтажу/демонтажу перегородок", "Функціональне зонування простору", "Схеми розташування меблів"] },
        { title: "Узгодження мереж", items: ["Схематичне розміщення виводів сантехніки", "Прив'язка розеток до нового планування"] },
      ],
    },
  },
  {
    slug: "inzhenerni-merezhi",
    image: svcHeating,
    es: {
      shortTitle: "Instalaciones",
      title: "Instalaciones de fontanería, electricidad y calefacción",
      desc: "Diseño y montaje completo de redes de fontanería, calefacción y sistemas eléctricos para viviendas y locales en Asturias. Realizamos la instalación de fontanería con colectores de agua (sistemas multicapa y polipropileno de alta resistencia), cableado eléctrico completo bajo normativa REBT con montaje de cuadros de protección y emisión de boletines. Especialistas en sistemas de calefacción eficiente: instalación de suelo radiante por agua, aerotermia y calderas de condensación de primeras marcas, garantizando la máxima seguridad y ahorro energético.\n\nLas redes de ingeniería invisibles son el corazón del confort y la seguridad de cualquier hogar. En Asturbau instalamos cableado eléctrico utilizando mangueras libres de halógenos y canalizaciones protegidas, con cuadros eléctricos equipados con diferenciales individuales por zonas para evitar cortes generales. En fontanería, utilizamos un sistema en estrella (colectores) para que cada grifo o electrodoméstico tenga su propia toma directa, evitando pérdidas de presión y facilitando el mantenimiento futuro sin cortar el suministro general.\n\nSomos especialistas en calefacción adaptada al clima asturiano. Realizamos proyectos de alta eficiencia mediante el montaje de suelo radiante por agua combinándolo con bombas de calor de aerotermia, lo que reduce el consumo energético mensual hasta en un 60% comparado con la calefacción convencional. Realizamos pruebas de presión y estanqueidad antes de cerrar cualquier falso techo o verter soleras, garantizando la ausencia absoluta de fugas.",
      features: [
        "Instalaciones seguras y certificadas",
        "Sistemas de calefacción de alta eficiencia",
        "Materiales de primeras marcas",
        "Garantía total de estanqueidad y funcionamiento",
      ],
      includes: [
        { title: "Electricidad y redes", items: ["Tendido de líneas eléctricas", "Montaje de cuadros con protecciones", "Tomas de tierra", "Instalación de telecomunicaciones y red"] },
        { title: "Fontanería y desagües", items: ["Tuberías de agua fría y caliente", "Sistemas de colectores", "Desagües silenciosos", "Grupos de presión y filtrado"] },
        { title: "Calefacción y climatización", items: ["Suelo radiante por agua", "Instalación de calderas y aerotermia", "Radiadores y fancoils", "Termostatos inteligentes"] },
      ],
    },
    uk: {
      shortTitle: "Інженерні мережі",
      title: "Монтаж інженерних мереж: опалення, сантехніка, електрика",
      desc: "Проєктуємо та монтуємо надійні інженерні комунікації будь-якої складності для квартир, котеджів та комерційних об'єктів. Виконуємо повну розводку труб водопостачання (сучасна колекторна система) та каналізації з шумоізоляцією, монтаж сучасного опалення (водяна тепла підлога, радіатори, підключення котлів або теплових насосів). Здійснюємо комплексний електромонтаж від прокладання негорючого кабелю в гофрі до збірки щитів із надійною автоматикою, УЗО та захистом від перенапруги з проведенням пусконалагоджувальних робіт.\n\nЯкісні інженерні мережі — це запорука безпеки та безперебійного функціонування будинку на десятиліття. У роботі з електрикою ми використовуємо якісний негорючий мідний кабель із прокладанням у захисних гофротрубах та збираємо щитові з обов'язковим розділенням ліній споживання. У сантехніці колекторний метод підключення дозволяє подавати воду до кожного змішувача окремою трубою без трійникових з'єднань у підлозі, що мінімізує будь-які ризики протікання та забезпечує стабільний тиск у системі.\n\nМи спеціалізуємося на енергоефективному опаленні, що вкрай важливо для вологого клімату Астурії. Встановлення водяної теплої підлоги у поєднанні з тепловими насосами (аеротермія) дозволяє знизити витрати на опалення до 60% у порівнянні з традиційними радіаторними системами. Усі змонтовані нами трубопроводи водопостачання та опалення проходять обов'язкові випробування під високим тиском (опресовку) з фіксацією показників у технічному звіті перед початком оздоблювальних робіт.",
      features: [
        "Робота за європейськими стандартами безпеки",
        "Енергоефективне автономне опалення",
        "Використання надійних та перевірених матеріалів",
        "Випробування систем під тиском (опресовка)",
      ],
      includes: [
        { title: "Електромонтаж", items: ["Прокладання силових та слаботочних кабелів", "Збірка розподільних щитів із ПЗВ", "Влаштування заземлення", "Монтаж світильників та фурнітури"] },
        { title: "Сантехнічні мережі", items: ["Розводка труб водопостачання (колекторна)", "Встановлення безшумної каналізації", "Фільтрація води та редуктори тиску", "Монтаж інсталяцій та вбудованих змішувачів"] },
        { title: "Опалення та клімат", items: ["Монтаж водяної або електричної теплої підлоги", "Встановлення газових, електричних котлів та теплових насосів", "Радіатори опалення та термостати"] },
      ],
    },
  },
  {
    slug: "montazh-gipsokartonu",
    image: svcDrywall,
    es: {
      shortTitle: "Pladur y tabiquería",
      title: "Instalación de Pladur y tabiquería seca",
      desc: "Realizamos trabajos profesionales de instalación de Pladur (cartón-yeso) y tabiquería seca en Asturias. Construimos tabiques divisorios, trasdosados autoportantes, techos suspendidos continuos y desmontables, estanterías de Pladur y aislamientos termoacústicos con lana de roca. Garantizamos una perfecta planeidad de las superficies, colocación precisa de cintas de juntas y acabado listo para pintar o empapelar.\n\nLa tabiquería seca de cartón-yeso es una solución moderna que permite cambiar la distribución de un piso en pocos días sin generar los pesados escombros ni la humedad del ladrillo tradicional. En Asturbau prestamos especial atención al aislamiento acústico interior: rellenamos la estructura metálica con lana de roca de alta densidad para asegurar el confort y privacidad entre estancias. Utilizamos placas hidrófugas de color verde en baños y cocinas para evitar problemas de humedad y condensación.\n\nNuestros instaladores especializados garantizan un encintado y masillado de juntas perfecto bajo los estándares de calidad más exigentes (hasta nivel Q4). Este proceso meticuloso de lijado y preparación previa evita la aparición de fisuras posteriores y sombras ópticas en las uniones de las placas, asegurando una superficie lisa óptima para las pinturas más exigentes o papeles pintados finos.",
      features: [
        "Estructuras metálicas reforzadas",
        "Aislamiento térmico y acústico",
        "Planeidad perfecta sin fisuras",
        "Techos suspendidos y cajones",
      ],
      includes: [
        { title: "Tabiques y trasdosados", items: ["Montaje de estructura metálica", "Colocación de placas estándar, hidrófugas o ignífugas", "Instalación de aislamiento termoacústico"] },
        { title: "Falsos techos", items: ["Techos continuos de pladur", "Techos desmontables para oficinas", "Cajones y candilejas para iluminación LED"] },
        { title: "Acabados", items: ["Encintado de juntas", "Masillado completo (niveles Q1 a Q4)", "Lijado y preparación para pintura"] },
      ],
    },
    uk: {
      shortTitle: "Гіпсокартонні роботи",
      title: "Монтаж гіпсокартонних конструкцій та перегородок",
      desc: "Професійний монтаж гіпсокартонних конструкцій будь-якої складності в Астурії. Будуємо міжкімнатні перегородки, фальшстіни, однорівневі та багаторівневі підвісні стелі, декоративні ніші та короби для приховання комунікацій. Використовуємо якісні металеві профілі, обов'язкове заповнення мінеральною ватою для звуко- й теплоізоляції, а також виконуємо ретельне армування швів та шпаклювання під фарбування чи шпалери.\n\nВикористання технологій сухого будівництва дозволяє змінити конфігурацію приміщень за лічені дні, уникаючи тривалого сушіння стін та зайвого бруду. Ми будуємо металевий каркас із використанням оцинкованих профілів від перевірених виробників, монтуємо звукоізоляційні демпферні стрічки та повністю заповнюємо внутрішній простір плитним шумопоглинаючим утеплювачем. У санвузлах та кухонних зонах використовується виключно вологостійкий гіпсокартон зеленого кольору для захисту від впливу пари й вологи.\n\nОсобливу увагу ми приділяємо етапу обробки швів та кутів. Використання міцних армуючих стрічок (паперових або скловолоконних) та фінішних шпаклювальних сумішей за технологією Q3-Q4 запобігає виникненню тріщин у майбутньому. В результаті ви отримуєте ідеально плоску, геометрично вивірену стіну без найменших перепадів, повністю готову під високоякісне фарбування, декоративну штукатурку чи шпалери.",
      features: [
        "Міцні металеві каркаси",
        "Ефективна шумо- та теплоізоляція стін",
        "Ідеально рівна геометрія поверхонь",
        "Монтаж ніш та світлових коробів",
      ],
      includes: [
        { title: "Стіни та перегородки", items: ["Збірка металевого каркаса", "Обшивка стін гіпсокартоном (вологостійкий, вогнестійкий)", "Укладання мінеральної вати (звукоізоляція)"] },
        { title: "Підвісні стелі", items: ["Однорівневі та багаторівневі стелі з ГКЛ", "Монтаж коробок під світлодіодні стрічки", "Ніші для прихованих карнизів"] },
        { title: "Фінішна підготовка", items: ["Армування швів стрічкою", "Шпаклювання поверхонь (під шпалери або фарбування)", "Шліфування стін"] },
      ],
    },
  },
  {
    slug: "remont-vannykh-ta-plytka",
    image: collageBathroom,
    es: {
      shortTitle: "Baños y alicatado",
      title: "Reforma de baños, cocinas y colocación de azulejos",
      desc: "Especialistas en reforma integral de cocinas y baños, y colocación profesional de azulejos y pavimentos en Asturias. Realizamos trabajos de alicatado de alta precisión con gres porcelánico de gran formato, rectificado, piedra natural y mosaicos, garantizando esquinas perfectas con cortes a inglete a 45 grados. Nos encargamos de la impermeabilización previa de zonas húmedas, nivelación de soleras, cambio de bañera por plato de ducha de obra a ras de suelo y la instalación de griferías empotradas y sanitarios suspendidos con un acabado estético impecable.\n\nLa reforma del baño y la cocina requiere una precisión milimétrica debido a la presencia de tuberías y sumideros. Por ello, aplicamos sistemas de impermeabilización líquida bicomponente en todas las paredes de la ducha y zonas de salpicaduras para proteger la estructura del edificio contra filtraciones de agua y la aparición de moho. Realizamos la nivelación perfecta de suelos mediante morteros autonivelantes para asegurar una colocación del gres limpia y sin cejas.\n\nNuestros colocadores cuentan con amplia experiencia en porcelánicos de gran formato (placas de 120x240cm y similares), utilizando sistemas de nivelación por calzos y ventosas de succión. Prestamos especial cuidado al corte a inglete (juntas a 45º) pulido a mano para evitar perfiles metálicos y lograr esquinas limpias de alta costura, y utilizamos resinas epoxídicas para el rejuntado en zonas expuestas a la humedad constante para evitar manchas y asegurar la higiene.",
      features: [
        "Impermeabilización total garantizada",
        "Cortes a inglete de precisión (45 grados)",
        "Experiencia en porcelánicos de gran formato",
        "Diseño ergonómico de cocinas y baños",
      ],
      includes: [
        { title: "Reformas de baños", items: ["Sustitución de bañera por plato de ducha", "Montaje de mamparas", "Instalación de inodoros suspendidos", "Mobiliario de baño y grifería empotrada"] },
        { title: "Alicatado y solados", items: ["Colocación de gres porcelánico", "Mosaico y piedra natural", "Alicatado de paredes y nivelación de suelos", "Revestimientos cerámicos en cocinas"] },
        { title: "Preparación previa", items: ["Aplicación de membranas impermeabilizantes", "Recrecidos de mortero nivelantes", "Tratamiento de juntas elásticas"] },
      ],
    },
    uk: {
      shortTitle: "Ванні кімнати та плитка",
      title: "Ремонт ванних кімнат, кухонь та укладання плитки",
      desc: "Професійний ремонт санвузлів, ванних кімнат та кухонь «під ключ» з гарантією високої якості в Астурії. Наші майстри-плиточники спеціалізуються на професійному укладанні плитки та великоформатного керамограніту, виконанні ідеальних запилів під 45° для зовнішніх кутів, укладанні мозаїки та натурального каменю. Перед облицюванням ми обов'язково проводимо підготовку поверхонь: вирівнювання стін, заливку самовирівнювальної стяжки та нанесення надійної еластичної обмазувальної гідроізоляції мокрих зон для захисту від протікань.\n\nРемонт мокрих зон вимагає бездоганного дотримання будівельних нормативів. Ми приділяємо колосальну увагу захисту стін та підлоги від вологи: наносимо двокомпонентну гідроізоляційну мастику на зони душових кабін, кухонних фартухів та раковин, а також проклеюємо кути спеціальною еластичною стрічкою. Завдяки власному влаштуванню ідеально рівних стяжок підлога під плитку вирівнюється бездоганно, що гарантує відсутність «сходинок» та перепадів між плитками.\n\nНаші майстри працюють із плитами великого формату (наприклад, 60х120 см та 120х240 см), використовуючи сучасні системи вирівнювання плитки (СВП). Ми відмовилися від дешевих пластикових куточків на користь прецизійного запилу зовнішніх кутів під 45 градусів із подальшим шліфуванням краю вручну. Для затирання швів використовуються виключно вологостійкі епоксидні суміші, які з часом не темніють, не тріскаються та запобігають утворенню цвілі та грибка.",
      features: [
        "100% захист від протікань (професійна гідроізоляція)",
        "Ідеальні шви та запили плитки під 45°",
        "Досвід роботи з плитами великого формату (плиточник-профі)",
        "Ергономічне планування розводки сантехніки та меблів",
      ],
      includes: [
        { title: "Ремонт санвузлів", items: ["Заміна ванни на душову кабіну або душовий піддон", "Монтаж скляних перегородок", "Встановлення підвісних унітазів (інсталяцій)", "Монтаж прихованої сантехніки"] },
        { title: "Плиткові роботи", items: ["Укладання керамограніту на підлогу та стіни", "Облицювання кухонних фартухів мозаїкою або склом", "Укладання натурального каменю та клінкеру", "Затирання швів (епоксидні та цементні суміші)"] },
        { title: "Підготовчий етап", items: ["Гідроізоляція мокрих зон", "Влаштування стяжки та вирівнювання стін", "Звукоізоляція труб каналізації"] },
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

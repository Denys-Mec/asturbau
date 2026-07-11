import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getSiteContent } from "@/lib/content.functions";
import { updateContent } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus, Star } from "lucide-react";
import { RAW } from "@/i18n/services";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEFAULT_FAQS_ES = [
  { q: "¿Qué tipo de reformas realizan?", a: "Realizamos reformas de pisos (de un dormitorio, de obra nueva, de segunda mano), reformas de casas, chalets y adosados, así como reformas de oficinas, locales comerciales y no residenciales. Trabajamos en formatos de reforma cosmética, integral, de diseño y premium — desde reformas para alquiler hasta reformas llave en mano con proyecto de diseño completo." },
  { q: "¿Qué incluye una reforma llave en mano?", a: "Ciclo completo: trabajos de demolición, albañilería, montaje de ventanas y puertas, trabajos en bruto y de acabado (suelo, paredes, techo, azulejos), pladur, pintura, enlucido y yeso, fontanería (grifos, inodoros, cisternas, mamparas, bañeras, hidromasajes, agua y saneamiento), electricidad (cableado, enchufes, interruptores, lámparas, contadores, diferenciales, magnetotérmicos, cuadros, videoporteros), instalación de calefacción (calderas, radiadores, suelo radiante), carpintería, pintura y acabado final." },
  { q: "¿Cuánto cuesta una reforma llave en mano?", a: "El coste depende de la superficie, tipo de inmueble (piso, casa, oficina, local comercial), nivel de reforma (cosmética, confort, integral, premium) y materiales elegidos. Tras la visita al inmueble entregamos un presupuesto detallado con desglose por cada capítulo — acabados, fontanería, electricidad, calefacción, etc." },
  { q: "¿La visita y la valoración son gratuitas?", a: "Sí, la visita del técnico al inmueble en Asturias, las mediciones, la consulta del encargado y la valoración previa son gratuitas. Recibe el presupuesto y los plazos claros sin ningún compromiso." },
  { q: "¿Realizan cambios de distribución y proyectos de diseño?", a: "Sí. Desarrollamos proyectos de diseño de pisos y casas, realizamos distribución y redistribución con la tramitación documental necesaria. Llevamos la reforma de diseño desde el boceto hasta la entrega." },
  { q: "¿Cuáles son los plazos de ejecución?", a: "Los plazos exactos se determinan en la fase de valoración y dependen del volumen y complejidad de los trabajos. Comunicamos el tiempo estimado en la consulta, una vez conocemos los detalles de su proyecto." },
  { q: "¿Firman contrato y ofrecen garantía?", a: "Sí, trabajamos exclusivamente con contrato, con precio y plazos fijados. Sobre todos los trabajos realizados — acabados, fontanería, electricidad, calefacción — ofrecemos garantía de hasta 2 años." },
  { q: "¿Pueden comprar los materiales?", a: "Sí, trabajamos directamente con proveedores y podemos encargarnos de la compra y logística de materiales — azulejos, fontanería, material eléctrico, equipos de calefacción, acabados y carpintería. Le ahorramos tiempo y dinero." },
  { q: "¿En qué zonas trabajan?", a: "Realizamos reformas de pisos, casas y locales comerciales en todo el Principado de Asturias. Trabajamos en Gijón, Oviedo, Avilés, así como en Siero, Langreo, Mieres, Castrillón, Villaviciosa, Gozón y otros municipios de la región. Bajo petición valoramos desplazamientos a regiones limítrofes." }
];

const DEFAULT_FAQS_UK = [
  { q: "Які види ремонту ви виконуєте?", a: "Виконуємо ремонт квартир (однокімнатних, новобудов, вторинного житла), ремонт будинків, котеджів і таунхаусів, а також ремонт офісів, комерційних і нежитлових приміщень. Працюємо у форматах косметичного, капітального, комплексного, дизайнерського та преміум/елітного ремонту — від ремонту під здачу до ремонту під ключ із повним дизайн-проектом." },
  { q: "Що входить у ремонт під ключ?", a: "Повний цикл: демонтажні роботи, кладка, монтаж вікон і дверей, чорнові й оздоблювальні роботи (підлога, стіни, стеля, плитка), гіпсокартонні, малярні, шпаклювальні та штукатурні роботи, сантехніка (змішувачі, унітази, інсталяції, душові кабіни, ванни, джакузі, водопостачання та каналізація), електрика (електропроводка, розетки, вимикачі, люстри, лічильники, автомати, ПЗВ, електрощитові, домофони), монтаж опалення (котли, радіатори, тепла підлога), столярні роботи, покраска та фінішне оздоблення." },
  { q: "Скільки коштує ремонт під ключ?", a: "Вартість залежить від площі, типу обʼєкта (квартира, будинок, офіс, комерційне приміщення), рівня ремонту (косметичний, комфорт, капітальний, преміум) та обраних матеріалів. Після виїзду на обʼєкт ми надаємо деталізований кошторис із розбивкою по кожному напрямку — оздоблення, сантехніка, електрика, опалення тощо." },
  { q: "Чи робите ви безкоштовний виїзд та оцінку?", a: "Так, виїзд інженера на обʼєкт в межах Астурії, заміри, консультації прораба та попередня оцінка — безкоштовні. Ви отримуєте кошторис і чіткі терміни без жодних зобовʼязань." },
  { q: "Чи робите ви перепланування і дизайн-проект?", a: "Так. Розробляємо дизайн-проекти квартир і будинків, виконуємо планування та перепланування з оформленням необхідної документації. Дизайнерський ремонт ведемо від ескізу до здачі обʼєкта." },
  { q: "Які терміни виконання ремонту?", a: "Точні терміни визначаються на етапі оцінки об'єкта та залежать від обсягу й складності робіт. Орієнтовний час виконання ми озвучуємо вже на консультації — після того, як дізнаємося деталі вашого проєкту." },
  { q: "Чи укладаєте ви договір та надаєте гарантію?", a: "Так, ми працюємо виключно за договором, із зафіксованою ціною та термінами. На всі виконані роботи — оздоблення, сантехніку, електрику, монтаж опалення — надаємо гарантію до 2 років." },
  { q: "Чи можете ви закупити матеріали?", a: "Так, ми працюємо безпосередньо з постачальниками та можемо взяти на себе закупівлю й логістику матеріалів — плитки, сантехніки, електрики, опалювального обладнання, оздоблювальних і столярних матеріалів. Це економить ваш час і гроші." },
  { q: "В яких регіонах ви працюєте?", a: "Ми виконуємо ремонт квартир, будинків і комерційних приміщень по всьому Князівству Астурія (Principado de Asturias). Працюємо у Хіхоні (Gijón), Овʼєдо (Oviedo), Авілесі (Avilés), а також у Сьєро (Siero), Лангрео (Langreo), Мьєресі (Mieres), Кастрильйон (Castrillón), Вільявісьйосі (Villaviciosa), Гозоні (Gozón) та інших муніципалітетах регіону. За запитом можемо розглянути виїзд у сусідні регіони." }
];

const DEFAULT_PROCESS_ES = [
  { step: "01", title: "Primer contacto", desc: "Analizamos sus necesidades, ideas y objetivos para el proyecto." },
  { step: "02", title: "Visita técnica", desc: "Visitamos el inmueble para realizar mediciones y evaluar el estado actual." },
  { step: "03", title: "Presupuesto", desc: "Elaboramos un cálculo de costes desglosado con materiales, mano de obra y plazos." },
  { step: "04", title: "Firma del contrato", desc: "Fijamos el alcance del trabajo, precio cerrado y fechas de entrega en el contrato." },
  { step: "05", title: "Ejecución de obra", desc: "Realizamos los trabajos según la planificación y normativas técnicas." },
  { step: "06", title: "Control de calidad", desc: "Supervisamos rigurosamente cada fase para asegurar acabados de nivel superior." },
  { step: "07", title: "Entrega de llaves", desc: "Recepción del proyecto terminado, limpieza final y entrega de garantías." }
];

const DEFAULT_PROCESS_UK = [
  { step: "01", title: "Перший контакт", desc: "Обговорюємо ваші потреби та задачі" },
  { step: "02", title: "Виїзд на обʼєкт", desc: "Приїжджаємо на обʼєкт, робимо заміри й оцінюємо обсяг майбутніх робіт." },
  { step: "03", title: "Кошторис", desc: "Готуємо повний розрахунок вартості з деталізованим списком матеріалів, робіт і встановлюємо терміни виконання." },
  { step: "04", title: "Договір", desc: "Фіксуємо обсяг, терміни та ціну" },
  { step: "05", title: "Виконання", desc: "Робота згідно з графіком" },
  { step: "06", title: "Контроль", desc: "Контроль якості на всіх етапах" },
  { step: "07", title: "Здача обʼєкта", desc: "Приймання готового результату" }
];

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentEditor,
});

function ContentEditor() {
  const get = useServerFn(getSiteContent);
  const upd = useServerFn(updateContent);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site_content"], queryFn: () => get() });

  const [form, setForm] = useState<any>(null);
  const [activeLangTab, setActiveLangTab] = useState<"es" | "uk">("es");

  useEffect(() => {
    if (data?.home) {
      const isLegacy = !data.home.es && !data.home.uk;
      let esData = isLegacy ? { ...data.home } : (data.home.es || {});
      let ukData = isLegacy ? { ...data.home } : (data.home.uk || {});

      if (!esData.faq) esData.faq = DEFAULT_FAQS_ES;
      if (!ukData.faq) ukData.faq = DEFAULT_FAQS_UK;

      const hasUkrainianInEsProcess = esData.process?.some((p: any) => p.title === "Перший контакт" || p.title === "Виїзд на обʼєкт");
      if (isLegacy || hasUkrainianInEsProcess || !esData.process) {
        esData.process = DEFAULT_PROCESS_ES;
      }
      if (!ukData.process || ukData.process.length === 0) {
        ukData.process = DEFAULT_PROCESS_UK;
      }

      const DEFAULT_ICONS_MAP: Record<string, string> = {
        "remont-pid-kliuch": "home",
        "remont-ofisiv-ta-komertsii": "building",
        "planuvannia-ta-pereplanuvannia": "layers",
        "inzhenerni-merezhi": "flame",
        "montazh-gipsokartonu": "hammer",
        "remont-vannykh-ta-plytka": "bath"
      };

      if (!esData.services_cards) {
        esData.services_cards = RAW.map(s => ({
          title: s.es.title,
          desc: s.es.shortDesc,
          image: s.image,
          serviceSlug: s.slug,
          icon: DEFAULT_ICONS_MAP[s.slug] || ""
        }));
      }
      if (!ukData.services_cards) {
        ukData.services_cards = RAW.map(s => ({
          title: s.uk.title,
          desc: s.uk.shortDesc,
          image: s.image,
          serviceSlug: s.slug,
          icon: DEFAULT_ICONS_MAP[s.slug] || ""
        }));
      }

      setForm({
        es: esData,
        uk: ukData,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () => upd({ data: { key: "home", value: form } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site_content"] }); toast.success("Збережено"); },
    onError: (e: any) => toast.error(e?.message || "Помилка"),
  });

  if (isLoading || !form) return <div className="text-muted-foreground">Завантаження...</div>;

  const l = form[activeLangTab] || {};
  const allServices = data?.services || RAW;
  const serviceOptions = allServices.map((s: any) => ({
    slug: s.slug,
    title: s[activeLangTab]?.shortTitle || s.slug
  }));

  const set = (k: string, v: any) => {
    setForm({
      ...form,
      [activeLangTab]: {
        ...l,
        [k]: v
      }
    });
  };

  return (
    <div className="max-w-4xl bg-background border border-border rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-display tracking-wide">Головна сторінка</h1>
      </div>

      {/* Lang switch */}
      <div className="flex gap-2 border-b border-border pb-px mb-6">
        <button
          type="button"
          onClick={() => setActiveLangTab("es")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeLangTab === "es"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Іспанська версія (ES)
        </button>
        <button
          type="button"
          onClick={() => setActiveLangTab("uk")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeLangTab === "uk"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Українська версія (UK)
        </button>
      </div>

      <div className="grid gap-6">
        <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Hero</h2>
          <Field label="Заголовок" value={l.hero_title} onChange={(v) => set("hero_title", v)} />
          <Field label="Підзаголовок" value={l.hero_subtitle} onChange={(v) => set("hero_subtitle", v)} multiline />
          <Field label="Текст кнопки" value={l.hero_cta} onChange={(v) => set("hero_cta", v)} />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Про нас</h2>
          <Field label="Заголовок" value={l.about_title} onChange={(v) => set("about_title", v)} />
          <Field label="Текст" value={l.about_text} onChange={(v) => set("about_text", v)} multiline rows={6} />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Послуги на головній сторінці (Сітка)</h2>
          <p className="text-xs text-muted-foreground -mt-2">Налаштуйте картки послуг, які відображаються на головній сторінці.</p>
          <ArrayEditor
            label=""
            items={l.services_cards || []}
            onChange={(v) => set("services_cards", v)}
            renderItem={(item, ch) => (
              <div className="border border-border bg-background p-4 rounded-md w-full grid gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Заголовок картки</Label>
                    <Input
                      value={item.title || ""}
                      onChange={(e) => ch({ ...item, title: e.target.value })}
                      placeholder="Заголовок"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Посилання на зображення (URL / шлях)</Label>
                    <Input
                      value={item.image || ""}
                      onChange={(e) => ch({ ...item, image: e.target.value })}
                      placeholder="e.g. /src/assets/collage-living.jpg"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Опис картки</Label>
                    <Input
                      value={item.desc || ""}
                      onChange={(e) => ch({ ...item, desc: e.target.value })}
                      placeholder="Опис"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Перехід на сторінку послуги</Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                      value={item.serviceSlug || ""}
                      onChange={(e) => ch({ ...item, serviceSlug: e.target.value })}
                    >
                      <option value="">Виберіть послугу...</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt.slug} value={opt.slug}>
                          {opt.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Іконка картки</Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1"
                      value={item.icon || ""}
                      onChange={(e) => ch({ ...item, icon: e.target.value })}
                    >
                      <option value="">За замовчуванням</option>
                      <option value="home">Будинок (Home)</option>
                      <option value="building">Офіс / Комерція (Building)</option>
                      <option value="layers">Дизайн / Перепланування (Layers)</option>
                      <option value="flame">Вогонь (Flame)</option>
                      <option value="hammer">Гіпсокартон / Роботи (Hammer)</option>
                      <option value="bath">Ванна кімната (Bath)</option>
                      <option value="wrench">Інструменти / Ключ (Wrench)</option>
                      <option value="paintbrush">Малярні роботи / Пензель (Paintbrush)</option>
                      <option value="ruler">Заміри / Лінійка (Ruler)</option>
                      <option value="hardhat">Безпека / Каска (HardHat)</option>
                      <option value="droplet">Вода / Сантехніка (Droplet)</option>
                      <option value="lightbulb">Світло / Лампочка (Lightbulb)</option>
                      <option value="plug">Електромонтаж / Розетка (Plug)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            newItem={() => ({ title: "", desc: "", image: "", serviceSlug: "", icon: "" })}
          />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Процес (Кроки таймлайну)</h2>
          <ArrayEditor
            label=""
            items={l.process || []}
            onChange={(v) => set("process", v)}
            renderItem={(item, ch) => (
              <div className="grid sm:grid-cols-3 gap-2 flex-1">
                <Input placeholder="Крок (e.g. 01)" value={item.step} onChange={(e) => ch({ ...item, step: e.target.value })} />
                <Input placeholder="Назва" value={item.title} onChange={(e) => ch({ ...item, title: e.target.value })} />
                <Input placeholder="Опис" value={item.desc} onChange={(e) => ch({ ...item, desc: e.target.value })} />
              </div>
            )}
            newItem={() => ({ step: "", title: "", desc: "" })}
          />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Чому обирають нас?</h2>
          <Field label="Заголовок" value={l.values_title} onChange={(v) => set("values_title", v)} />
          <Field label="Текст" value={l.values_text} onChange={(v) => set("values_text", v)} multiline rows={4} />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Часті запитання (FAQ)</h2>
          <ArrayEditor
            label=""
            items={l.faq || []}
            onChange={(v) => set("faq", v)}
            renderItem={(item, ch) => (
              <div className="grid gap-2 flex-1">
                <Input placeholder="Запитання" value={item.q || ""} onChange={(e) => ch({ ...item, q: e.target.value })} />
                <Textarea placeholder="Відповідь" value={item.a || ""} onChange={(e) => ch({ ...item, a: e.target.value })} rows={2} />
              </div>
            )}
            newItem={() => ({ q: "", a: "" })}
          />
        </div>
      </div>

      <div className="sticky bottom-4 mt-8 flex justify-end">
        <Button size="lg" onClick={() => save.mutate()} disabled={save.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-elegant">
          {save.isPending ? "Збереження..." : "Зберегти всі зміни"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      {multiline
        ? <Textarea className="mt-1" rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} />
        : <Input className="mt-1" value={value || ""} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

function ArrayEditor<T>({ label, items, onChange, renderItem, newItem }: {
  label: string;
  items: T[];
  onChange: (v: T[]) => void;
  renderItem: (item: T, change: (v: T) => void) => React.ReactNode;
  newItem: () => T;
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="mt-2 grid gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">{renderItem(it, (v) => { const arr = [...items]; arr[i] = v; onChange(arr); })}</div>
            <Button type="button" size="icon" variant="ghost" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, newItem()])}>
          <Plus className="h-4 w-4 mr-1" /> Додати
        </Button>
      </div>
    </div>
  );
}

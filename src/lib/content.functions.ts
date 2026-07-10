import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error) throw error;
  const map: Record<string, any> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map as { home?: any; contacts?: any };
});

export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("id, type, url, thumbnail_url, title, orientation, sort_order, category_id, featured_on_home, featured_pages, home_sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
});

export const getGalleryCategories = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("gallery_categories")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
});

const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(3).max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("").transform(() => undefined)),
  message: z.string().trim().max(2000).optional(),
  source: z.string().max(50).optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => leadSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, data: row } = await supabaseAdmin
      .from("leads")
      .insert({ name: data.name, phone: data.phone, email: data.email ?? null, message: data.message ?? null, source: data.source ?? "website" })
      .select("id")
      .single();
    if (error) throw error;

    // Fire-and-forget notification
    try {
      const { notifyNewLead } = await import("./notify.server");
      await notifyNewLead({ name: data.name, phone: data.phone, email: data.email, message: data.message });
    } catch (e) {
      console.error("[notify] failed", e);
    }
    return { id: row.id };
  });

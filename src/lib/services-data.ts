// Legacy shim — bilingual services live in @/i18n/services.
// Kept for backwards-compat with admin pages that read a flat slug/title list.
import { getServices } from "@/i18n/services";
export { getServices, getServiceBySlug, SERVICE_SLUGS, serviceExists } from "@/i18n/services";
export type { ServiceDef } from "@/i18n/services";

// Default (Spanish) flat list for admin/legacy consumers.
export const SERVICES = getServices("es");

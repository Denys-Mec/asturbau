
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;
-- Recreate leads insert policy with explicit check on required fields (length limits)
DROP POLICY "anyone can submit leads" ON public.leads;
CREATE POLICY "anyone can submit leads" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 100
  AND length(phone) BETWEEN 3 AND 30
  AND (email IS NULL OR length(email) <= 255)
  AND (message IS NULL OR length(message) <= 2000)
);
-- has_role is now service_role only; admin RLS still works because Postgres allows SECURITY DEFINER functions called by row policies
-- But policies execute as the calling role, so we need to keep authenticated EXECUTE actually.
-- Revert grant: allow authenticated to call has_role (needed for RLS policy evaluation).
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

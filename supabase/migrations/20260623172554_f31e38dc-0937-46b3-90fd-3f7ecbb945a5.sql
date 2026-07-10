
DROP POLICY IF EXISTS "admins upload to gallery" ON storage.objects;
DROP FUNCTION IF EXISTS public.has_role(UUID, public.app_role) CASCADE;

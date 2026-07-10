
CREATE POLICY "admins upload to gallery" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update gallery" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete gallery" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins read gallery" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

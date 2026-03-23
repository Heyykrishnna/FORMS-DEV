-- SECURE FORMS AND RESPONSES WITH RLS
-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- ==============================================================================
-- 1. FORMS TABLE SECURITY
-- ==============================================================================
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies to avoid errors
DROP POLICY IF EXISTS "Users can view own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can insert own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can update own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can delete own forms" ON public.forms;
DROP POLICY IF EXISTS "Public can view forms" ON public.forms;
DROP POLICY IF EXISTS "Public can view forms to fill" ON public.forms;

-- Re-create Policies
CREATE POLICY "Users can view own forms" ON public.forms FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own forms" ON public.forms FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forms" ON public.forms FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own forms" ON public.forms FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Allow public access for viewing forms (needed for filling them out via link)
CREATE POLICY "Public can view forms" ON public.forms FOR SELECT TO anon, authenticated USING (true);


-- ==============================================================================
-- 2. RESPONSES TABLE SECURITY
-- ==============================================================================
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies
DROP POLICY IF EXISTS "Users can view responses to own forms" ON public.responses;
DROP POLICY IF EXISTS "Public can submit responses" ON public.responses;
DROP POLICY IF EXISTS "Users can delete responses to own forms" ON public.responses;
DROP POLICY IF EXISTS "Enable delete for users based on form ownership" ON public.responses; -- Dropping old policy if exists from setup

-- Policy: Form Owners can VIEW responses
-- We check if the current user owns the form that the response belongs to.
CREATE POLICY "Users can view responses to own forms"
ON public.responses
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = responses.form_id
        AND (forms.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
);

-- Policy: Anyone can INSERT responses (Submission)
CREATE POLICY "Public can submit responses"
ON public.responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Form Owners can DELETE responses
CREATE POLICY "Users can delete responses to own forms"
ON public.responses
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = responses.form_id
        AND (forms.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
);

-- SECURE FORMS TABLE WITH ROW LEVEL SECURITY (RLS)
-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Enable RLS on forms table
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES TO AVOID ERRORS
DROP POLICY IF EXISTS "Users can view own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can insert own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can update own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can delete own forms" ON public.forms;
-- Also drop the public policy if it exists from previous attempts
DROP POLICY IF EXISTS "Public can view forms" ON public.forms;
DROP POLICY IF EXISTS "Public can view forms to fill" ON public.forms;


-- 2. Create Policy: Users can only see their own forms
-- NOTE: We keep this policy for the Dashboard context primarily. 
-- Does it conflict with "Public can view forms"?
-- If we have "Public can view forms" using (true), it overrides this for SELECT.
-- However, for COMPLIANCE and CLARITY, we define the Owner policy.
-- AND we define the Public policy.
-- If we want to be STRICT:
-- "Users can view own forms" is redundant if "Public can view forms" allows everything.
-- BUT, if we ever switch "Public can view forms" to `status = 'published'`, then "Users can view own forms" enables them to see DRAFTS.
-- So we NEED both.

CREATE POLICY "Users can view own forms" 
ON public.forms 
FOR SELECT 
TO authenticated 
USING (
    auth.uid() = user_id 
    OR 
    public.has_role(auth.uid(), 'admin')
);

-- 3. Create Policy: Users can insert their own forms
CREATE POLICY "Users can insert own forms" 
ON public.forms 
FOR INSERT 
TO authenticated 
WITH CHECK (
    auth.uid() = user_id
);

-- 4. Create Policy: Users can update their own forms
CREATE POLICY "Users can update own forms" 
ON public.forms 
FOR UPDATE 
TO authenticated 
USING (
    auth.uid() = user_id 
    OR 
    public.has_role(auth.uid(), 'admin')
);

-- 5. Create Policy: Users can delete their own forms
CREATE POLICY "Users can delete own forms" 
ON public.forms 
FOR DELETE 
TO authenticated 
USING (
    auth.uid() = user_id 
    OR 
    public.has_role(auth.uid(), 'admin')
);

-- 6. Allow public access for filling forms
-- We allow everyone to SELECT.
-- This ensures that public links (e.g. /f/123) work for everyone.
-- The Dashboard privacy is enforced by the Frontend Filter `.eq('user_id', user.id)` 
-- AND the fact that `select * from forms` (all) isn't exposed in the UI.
CREATE POLICY "Public can view forms" 
ON public.forms 
FOR SELECT 
TO anon, authenticated
USING (true);

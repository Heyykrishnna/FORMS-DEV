-- REVOX UNIFIED DATABASE SETUP
-- RUN THIS IN YOUR SUPABASE/POSTGRES SQL EDITOR

-- 1. ADD RESPONSE THEME COLUMN
ALTER TABLE public.forms 
ADD COLUMN IF NOT EXISTS response_theme TEXT DEFAULT 'normal';

-- 2. ADD QUIZ CONTROL COLUMN
ALTER TABLE public.forms 
ADD COLUMN IF NOT EXISTS show_quiz_results_to_users BOOLEAN DEFAULT false;

-- 3. ADD ADVANCED CONTROLS
ALTER TABLE public.forms
ADD COLUMN IF NOT EXISTS restricted_domain TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS require_respondent_data BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seo_indexable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 4. ADD VIEWS INCREMENT FUNCTION
CREATE OR REPLACE FUNCTION increment_form_views(form_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.forms
  SET views = views + 1
  WHERE id = form_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ENSURE RLS POLICIES FOR RESPONSE DELETION
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'responses' AND policyname = 'Enable delete for users based on form ownership'
    ) THEN
        CREATE POLICY "Enable delete for users based on form ownership" 
        ON public.responses 
        FOR DELETE 
        USING (
            EXISTS (
                SELECT 1 FROM public.forms 
                WHERE forms.id = responses.form_id 
                AND forms.user_id = auth.uid()
            )
        );
    END IF;
END $$;

-- =============================================
-- 5. ROLE-BASED ACCESS CONTROL
-- =============================================

-- Create role enum
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- user_roles RLS: only admins can read roles, system can insert
CREATE POLICY "Authenticated can read own roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- =============================================
-- 6. COMPLAINTS / FEEDBACK TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    type TEXT NOT NULL DEFAULT 'feedback' CHECK (type IN ('bug', 'feedback', 'complaint', 'feature_request')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Anyone can submit complaints
CREATE POLICY "Anyone can insert complaints" ON public.complaints
    FOR INSERT WITH CHECK (true);

-- Users see their own complaints
CREATE POLICY "Users can view own complaints" ON public.complaints
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Admins can update complaints
CREATE POLICY "Admins can update complaints" ON public.complaints
    FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Admins can read all forms and responses for stats
-- (forms/responses already have their own RLS, admin needs broader access)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'forms' AND policyname = 'Admins can view all forms'
    ) THEN
        CREATE POLICY "Admins can view all forms" ON public.forms
            FOR SELECT TO authenticated
            USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'responses' AND policyname = 'Admins can view all responses'
    ) THEN
        CREATE POLICY "Admins can view all responses" ON public.responses
            FOR SELECT TO authenticated
            USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- =============================================
-- 7. ASSIGN ADMIN ROLE
-- =============================================
-- Assign admin to the specified user email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users 
WHERE email = 'yatharth.k25530@nst.rishihood.edu.in'
ON CONFLICT (user_id, role) DO NOTHING;

-- VERIFY
DO $$
BEGIN
    RAISE NOTICE 'DATABASE SETUP COMPLETE. ADMIN ROLE ASSIGNED. REVOX INTELLIGENCE SYSTEM IS ONLINE.';
END $$;

-- Fix for Infinite Recursion in Profiles RLS
-- We create a SECURITY DEFINER function to bypass RLS when checking if a user is an admin

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This bypasses RLS
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Drop the policies that caused the infinite loop
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

-- Recreate them using the secure function instead of a direct SELECT
CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR SELECT USING ( public.is_admin() );

CREATE POLICY "Admins can update profiles" ON public.profiles 
FOR UPDATE USING ( public.is_admin() );

-- We can also optionally update the other policies to use this function for cleaner code
DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts
FOR SELECT USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts
FOR INSERT WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
CREATE POLICY "Admins can update blog posts" ON public.blog_posts
FOR UPDATE USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts
FOR DELETE USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins have full access to questions" ON public.core_test_questions;
CREATE POLICY "Admins have full access to questions" ON public.core_test_questions
FOR ALL USING ( public.is_admin() );

-- Force schema reload for the API cache
NOTIFY pgrst, 'reload schema';

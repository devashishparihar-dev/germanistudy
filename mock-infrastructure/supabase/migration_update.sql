-- Migration Script to update existing database

-- 1. Add 'status' column to existing core_test_questions
ALTER TABLE public.core_test_questions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published'));

-- 2. Create profiles table (if not already created)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    read_time TEXT,
    thumbnail TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts
FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts
FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
CREATE POLICY "Admins can update blog posts" ON public.blog_posts
FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts
FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 4. Apply Admin RLS to core_test_questions
ALTER TABLE public.core_test_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published active questions" ON public.core_test_questions;
CREATE POLICY "Anyone can view published active questions" ON public.core_test_questions
FOR SELECT USING (status = 'published' AND is_active = true);

DROP POLICY IF EXISTS "Admins have full access to questions" ON public.core_test_questions;
CREATE POLICY "Admins have full access to questions" ON public.core_test_questions
FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

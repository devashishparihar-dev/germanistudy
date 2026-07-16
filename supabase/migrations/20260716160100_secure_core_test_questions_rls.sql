-- Migration to secure core_test_questions with strict RLS

-- 1. Ensure RLS is active
ALTER TABLE public.core_test_questions ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies to start fresh
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'core_test_questions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.core_test_questions', pol.policyname);
    END LOOP;
END
$$;

-- 3. Allow any authenticated user (e.g. students) to READ questions
CREATE POLICY "Students can view core_test_questions" 
ON public.core_test_questions 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- 4. Restrict all WRITE operations (INSERT, UPDATE, DELETE) to admins ONLY
CREATE POLICY "Admins can insert core_test_questions" 
ON public.core_test_questions 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update core_test_questions" 
ON public.core_test_questions 
FOR UPDATE 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete core_test_questions" 
ON public.core_test_questions 
FOR DELETE 
USING (public.is_admin());

-- Create active_test_sessions table
CREATE TABLE IF NOT EXISTS public.active_test_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_module_id TEXT NOT NULL,
    current_section_index INTEGER NOT NULL DEFAULT 0,
    current_q_index INTEGER NOT NULL DEFAULT 0,
    answers JSONB DEFAULT '[]'::jsonb,
    flagged_questions JSONB DEFAULT '[]'::jsonb,
    section_end_time TIMESTAMPTZ,
    tab_switch_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_module UNIQUE(user_id, test_module_id)
);

-- RLS Policies
ALTER TABLE public.active_test_sessions ENABLE ROW LEVEL SECURITY;

-- 1. FIX 1: Revoke direct INSERT and UPDATE from authenticated users
REVOKE INSERT, UPDATE ON public.active_test_sessions FROM authenticated;
REVOKE DELETE ON public.active_test_sessions FROM authenticated;

-- Allow SELECT so users can read their own sessions
CREATE POLICY "Users can view their own active sessions"
    ON public.active_test_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Helper function to get current server time securely
CREATE OR REPLACE FUNCTION get_server_time()
RETURNS TIMESTAMPTZ
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT now();
$$;

-- 2. FIX 2: RPC to securely start or resume a subtest timer
-- Duration is resolved server-side based on the module ID
CREATE OR REPLACE FUNCTION start_subtest_timer(p_module_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_duration INTEGER;
  v_existing TIMESTAMPTZ;
BEGIN
  -- Determine duration server-side
  -- Core modules are exactly 25 minutes (1500 seconds)
  IF p_module_id IN ('figure_sequences', 'mathematical_equations', 'latin_squares') THEN
    v_duration := 1500;
  ELSE
    -- If it's a custom mock, you would fetch it from mock_tests here.
    -- Assuming a fallback of 1500 seconds (25 minutes per section) for now.
    -- SELECT duration INTO v_duration FROM mock_tests WHERE id = p_module_id;
    -- IF NOT FOUND THEN
    v_duration := 1500;
  END IF;

  -- Check if a non-expired session already exists
  SELECT section_end_time INTO v_existing
  FROM public.active_test_sessions
  WHERE user_id = auth.uid() AND test_module_id = p_module_id;

  IF v_existing IS NOT NULL AND v_existing > now() THEN
    -- Session already active and not expired, do not reset the clock
    RETURN;
  END IF;

  INSERT INTO public.active_test_sessions (user_id, test_module_id, section_end_time)
  VALUES (auth.uid(), p_module_id, now() + (v_duration * interval '1 second'))
  ON CONFLICT (user_id, test_module_id)
  DO UPDATE SET 
    section_end_time = now() + (v_duration * interval '1 second'),
    updated_at = now();
END;
$$;

-- 3. FIX 1: RPC to securely update session progress
CREATE OR REPLACE FUNCTION save_session_progress(
  p_module_id TEXT,
  p_current_section_index INTEGER,
  p_current_q_index INTEGER,
  p_answers JSONB,
  p_flagged_questions JSONB,
  p_tab_switch_count INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.active_test_sessions
  SET 
    current_section_index = p_current_section_index,
    current_q_index = p_current_q_index,
    answers = p_answers,
    flagged_questions = p_flagged_questions,
    tab_switch_count = p_tab_switch_count,
    updated_at = now()
  WHERE user_id = auth.uid() AND test_module_id = p_module_id;
END;
$$;

-- 4. FIX 1: RPC to securely delete session
CREATE OR REPLACE FUNCTION delete_active_session(p_module_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.active_test_sessions
  WHERE user_id = auth.uid() AND test_module_id = p_module_id;
END;
$$;


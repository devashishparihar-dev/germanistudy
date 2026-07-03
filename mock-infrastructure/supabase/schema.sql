-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. core_test_questions
CREATE TABLE public.core_test_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_number INTEGER,
    section TEXT CHECK (section IN ('quantitative', 'relationships', 'patterns', 'numerical_series')),
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question_type TEXT,
    question TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    hint TEXT,
    estimated_time INTEGER,
    skill TEXT,
    topic TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. mock_tests
CREATE TABLE public.mock_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER, -- in minutes or seconds, typically minutes
    total_questions INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. mock_test_questions (Many-to-many relationship mapping)
CREATE TABLE public.mock_test_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mock_test_id UUID REFERENCES public.mock_tests(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.core_test_questions(id) ON DELETE CASCADE,
    display_order INTEGER,
    UNIQUE(mock_test_id, question_id)
);

-- 4. analytics / mock_test_results
CREATE TABLE public.mock_test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- If auth is integrated, REFERENCES auth.users(id)
    mock_test_id UUID REFERENCES public.mock_tests(id) ON DELETE SET NULL,
    time_per_question JSONB, -- Example: {"question_id_1": 45, "question_id_2": 30}
    selected_answers JSONB,  -- Example: {"question_id_1": "A", "question_id_2": "C"}
    score NUMERIC,
    completion_percentage NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_core_test_questions_updated_at
BEFORE UPDATE ON public.core_test_questions
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_mock_tests_updated_at
BEFORE UPDATE ON public.mock_tests
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

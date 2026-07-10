-- analytics.sql
-- Run this script in the Supabase SQL editor to create the events table

CREATE TABLE IF NOT EXISTS public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- nullable for anonymous landing page visitors
  event_name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert events (both authenticated and anon users)
CREATE POLICY "Anyone can insert events" ON public.events
  FOR INSERT
  WITH CHECK (true);

-- Restrict read access (users can only see their own events, or admin logic)
CREATE POLICY "Users can view their own events" ON public.events
  FOR SELECT
  USING (auth.uid() = user_id);

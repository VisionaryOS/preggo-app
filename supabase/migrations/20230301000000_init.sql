-- Alter existing public.users table to add missing columns if they do not exist
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS email TEXT NOT NULL UNIQUE,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS due_date DATE,
  ADD COLUMN IF NOT EXISTS pregnancy_week INTEGER,
  ADD COLUMN IF NOT EXISTS health_conditions TEXT[],
  ADD COLUMN IF NOT EXISTS interests TEXT[],
  ADD COLUMN IF NOT EXISTS ai_personalization JSONB DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
    "notifications": true,
    "weekly_updates": true, 
    "daily_tips": true,
    "data_collection": true
  }'::JSONB,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL;

-- Create pregnancy_logs table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.pregnancy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  symptoms TEXT[] DEFAULT '{}'::TEXT[],
  mood TEXT,
  weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS pregnancy_logs_user_id_idx ON public.pregnancy_logs(user_id);

-- Enable Row Level Security (RLS) on public.users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on public.users (if they exist)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create new RLS policies for public.users
CREATE POLICY "Users can view own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Enable Row Level Security (RLS) on public.pregnancy_logs table
ALTER TABLE public.pregnancy_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on public.pregnancy_logs (if they exist)
DROP POLICY IF EXISTS "Users can view own logs" ON public.pregnancy_logs;
DROP POLICY IF EXISTS "Users can create own logs" ON public.pregnancy_logs;
DROP POLICY IF EXISTS "Users can update own logs" ON public.pregnancy_logs;
DROP POLICY IF EXISTS "Users can delete own logs" ON public.pregnancy_logs;

-- Create new RLS policies for public.pregnancy_logs
CREATE POLICY "Users can view own logs" 
  ON public.pregnancy_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own logs" 
  ON public.pregnancy_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs" 
  ON public.pregnancy_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own logs" 
  ON public.pregnancy_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, due_date, preferences)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'due_date')::DATE,
    COALESCE(NEW.raw_user_meta_data->'preferences', '{
      "notifications": true,
      "weekly_updates": true,
      "daily_tips": true,
      "data_collection": true
    }'::JSONB)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to create a user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

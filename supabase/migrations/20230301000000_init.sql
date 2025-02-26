-- Create tables
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE public.pregnancy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  symptoms TEXT[] DEFAULT '{}'::TEXT[],
  mood TEXT,
  weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX pregnancy_logs_user_id_idx ON public.pregnancy_logs(user_id);

-- Set up Row Level Security (RLS)
-- Users table security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Only allow users to see and update their own profiles
CREATE POLICY "Users can view own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Pregnancy logs security
ALTER TABLE public.pregnancy_logs ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own logs
CREATE POLICY "Users can view own logs" 
  ON public.pregnancy_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only allow users to create logs for themselves
CREATE POLICY "Users can create own logs" 
  ON public.pregnancy_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Only allow users to update their own logs
CREATE POLICY "Users can update own logs" 
  ON public.pregnancy_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Only allow users to delete their own logs
CREATE POLICY "Users can delete own logs" 
  ON public.pregnancy_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, due_date)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'due_date')::DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 
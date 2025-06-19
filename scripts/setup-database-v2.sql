-- Enable Row Level Security on auth.users (if not already enabled)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'auth' AND tablename = 'users'
    ) THEN
        ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create blood_sugar_readings table
CREATE TABLE IF NOT EXISTS public.blood_sugar_readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    value DECIMAL(5,1) NOT NULL CHECK (value > 0 AND value < 1000),
    type TEXT NOT NULL CHECK (type IN ('fasting', 'before-meal', 'after-meal', 'bedtime', 'random')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    meal TEXT,
    medication TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on blood_sugar_readings
ALTER TABLE public.blood_sugar_readings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own readings" ON public.blood_sugar_readings;
DROP POLICY IF EXISTS "Users can insert their own readings" ON public.blood_sugar_readings;
DROP POLICY IF EXISTS "Users can update their own readings" ON public.blood_sugar_readings;
DROP POLICY IF EXISTS "Users can delete their own readings" ON public.blood_sugar_readings;

-- Create policy so users can only see their own readings
CREATE POLICY "Users can view their own readings" ON public.blood_sugar_readings
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy so users can insert their own readings
CREATE POLICY "Users can insert their own readings" ON public.blood_sugar_readings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy so users can update their own readings
CREATE POLICY "Users can update their own readings" ON public.blood_sugar_readings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy so users can delete their own readings
CREATE POLICY "Users can delete their own readings" ON public.blood_sugar_readings
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blood_sugar_readings_user_timestamp 
ON public.blood_sugar_readings(user_id, timestamp DESC);

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_blood_sugar_readings_updated_at ON public.blood_sugar_readings;

-- Create the trigger
CREATE TRIGGER update_blood_sugar_readings_updated_at 
    BEFORE UPDATE ON public.blood_sugar_readings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- This will only work if there's an authenticated user
-- INSERT INTO public.blood_sugar_readings (user_id, value, type, notes) 
-- VALUES (auth.uid(), 95.0, 'fasting', 'Morning reading after 8 hours of fasting');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.blood_sugar_readings TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify the setup
SELECT 
    'Database setup completed successfully!' as status,
    COUNT(*) as policies_created
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'blood_sugar_readings';

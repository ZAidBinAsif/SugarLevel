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

-- Enable Row Level Security
ALTER TABLE public.blood_sugar_readings ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users can view their own readings" ON public.blood_sugar_readings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own readings" ON public.blood_sugar_readings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own readings" ON public.blood_sugar_readings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own readings" ON public.blood_sugar_readings
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_blood_sugar_readings_user_timestamp 
ON public.blood_sugar_readings(user_id, timestamp DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blood_sugar_readings_updated_at 
    BEFORE UPDATE ON public.blood_sugar_readings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.blood_sugar_readings TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create weather_queries table to store user weather requests
CREATE TABLE IF NOT EXISTS weather_queries (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    city VARCHAR(255) NOT NULL,
    temperature DECIMAL(5,2),
    description TEXT,
    queried_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_weather_queries_user_id ON weather_queries(user_id);

-- Create an index on queried_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_weather_queries_queried_at ON weather_queries(queried_at);

-- Enable Row Level Security
ALTER TABLE weather_queries ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only see their own weather queries
CREATE POLICY "Users can view their own weather queries" ON weather_queries
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy so users can insert their own weather queries
CREATE POLICY "Users can insert their own weather queries" ON weather_queries
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL,
  voter_name TEXT NOT NULL,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, target_user_id)
);

-- Create voting_sessions table
CREATE TABLE IF NOT EXISTS voting_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_active BOOLEAN DEFAULT FALSE,
  time_remaining INTEGER DEFAULT 60,
  total_duration INTEGER DEFAULT 60,
  has_ended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default voting session
INSERT INTO voting_sessions (id, is_active, time_remaining, total_duration, has_ended)
VALUES ('default', FALSE, 60, 60, FALSE)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (true);

-- Create policies for ideas table
CREATE POLICY "Ideas are viewable by everyone" ON ideas FOR SELECT USING (true);
CREATE POLICY "Users can insert ideas" ON ideas FOR INSERT WITH CHECK (true);

-- Create policies for votes table
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can insert votes" ON votes FOR INSERT WITH CHECK (true);

-- Create policies for voting_sessions table
CREATE POLICY "Voting sessions are viewable by everyone" ON voting_sessions FOR SELECT USING (true);
CREATE POLICY "Voting sessions are updatable by everyone" ON voting_sessions FOR UPDATE USING (true);

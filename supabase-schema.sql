-- ============================================
-- Mini Product Feedback Wall - Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Create vote_type enum
-- ============================================
CREATE TYPE vote_type AS ENUM ('up', 'down');

-- ============================================
-- 2. Feedback Table
-- ============================================
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for faster sorting by votes (will use a view)
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);

-- ============================================
-- 3. Votes Table
-- ============================================
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_id UUID REFERENCES feedback(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vote_type vote_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Unique constraint: one vote per user per feedback item
    CONSTRAINT unique_user_feedback_vote UNIQUE (feedback_id, user_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_votes_feedback_id ON votes(feedback_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- ============================================
-- 4. View for Feedback with Vote Counts
-- ============================================
CREATE OR REPLACE VIEW feedback_with_votes AS
SELECT 
    f.id,
    f.title,
    f.description,
    f.created_by,
    f.created_at,
    COALESCE(SUM(CASE WHEN v.vote_type = 'up' THEN 1 WHEN v.vote_type = 'down' THEN -1 ELSE 0 END), 0) AS vote_count,
    COUNT(CASE WHEN v.vote_type = 'up' THEN 1 END) AS upvotes,
    COUNT(CASE WHEN v.vote_type = 'down' THEN 1 END) AS downvotes
FROM feedback f
LEFT JOIN votes v ON f.id = v.feedback_id
GROUP BY f.id, f.title, f.description, f.created_by, f.created_at
ORDER BY vote_count DESC, f.created_at DESC;

-- ============================================
-- 5. Enable Row Level Security
-- ============================================
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. RLS Policies for Feedback Table
-- ============================================

-- Anyone authenticated can read all feedback
CREATE POLICY "Anyone can read feedback" ON feedback
    FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert their own feedback
CREATE POLICY "Users can insert own feedback" ON feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Only creator can update their feedback
CREATE POLICY "Users can update own feedback" ON feedback
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- Only creator can delete their feedback
CREATE POLICY "Users can delete own feedback" ON feedback
    FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- ============================================
-- 7. RLS Policies for Votes Table
-- ============================================

-- Anyone authenticated can read all votes
CREATE POLICY "Anyone can read votes" ON votes
    FOR SELECT
    TO authenticated
    USING (true);

-- Users can insert their own vote (unique constraint handles duplicate prevention)
CREATE POLICY "Users can insert own vote" ON votes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own vote (change vote type)
CREATE POLICY "Users can update own vote" ON votes
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own vote
CREATE POLICY "Users can delete own vote" ON votes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- 8. Enable Realtime for tables
-- ============================================
-- Note: Run these in Supabase Dashboard > Database > Replication
-- or via SQL:

ALTER PUBLICATION supabase_realtime ADD TABLE feedback;
ALTER PUBLICATION supabase_realtime ADD TABLE votes;

-- ============================================
-- 9. Function to get user's vote for a feedback item
-- ============================================
CREATE OR REPLACE FUNCTION get_user_vote(p_feedback_id UUID, p_user_id UUID)
RETURNS vote_type AS $$
    SELECT vote_type FROM votes 
    WHERE feedback_id = p_feedback_id AND user_id = p_user_id;
$$ LANGUAGE SQL STABLE;


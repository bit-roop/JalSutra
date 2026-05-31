CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('voice','text','photo','video')),
  language TEXT NOT NULL,
  thumbnail_url TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS uploads_created_at_idx
ON uploads (created_at DESC);

CREATE TABLE IF NOT EXISTS impact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id TEXT NOT NULL,
  caption TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS impact_submissions_mission_created_at_idx
ON impact_submissions (mission_id, created_at DESC);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT,
  category TEXT,
  description TEXT,
  impact_observation TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  before_image_url TEXT,
  after_image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted')),
  observed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports (created_at DESC);
CREATE INDEX IF NOT EXISTS report_files_report_id_idx ON report_files (report_id);

CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  impact TEXT NOT NULL,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_urls TEXT[],
  document_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'Under Review',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ideas_created_at_idx ON ideas (created_at DESC);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

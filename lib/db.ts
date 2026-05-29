import { neon } from "@neondatabase/serverless";

// Initialize Neon serverless connection
// Set DATABASE_URL in your .env.local file
// Example: DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/jalsutra?sslmode=require
const sql = neon(process.env.DATABASE_URL!);

export default sql;

// ─── Schema helpers ────────────────────────────────────────────────────────────
// Run these once to set up your Neon DB tables:
//
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(100) NOT NULL,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   location VARCHAR(100) DEFAULT 'Patna, Bihar',
//   guardian_level INT DEFAULT 1,
//   points INT DEFAULT 0,
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// CREATE TABLE alerts (
//   id SERIAL PRIMARY KEY,
//   title TEXT NOT NULL,
//   category VARCHAR(50),   -- 'water', 'wildlife', 'event', 'policy'
//   location VARCHAR(100),
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// CREATE TABLE activities (
//   id SERIAL PRIMARY KEY,
//   user_id INT REFERENCES users(id),
//   description TEXT NOT NULL,
//   activity_type VARCHAR(50),  -- 'report', 'sighting', 'mission', 'join'
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// CREATE TABLE biodiversity_reports (
//   id SERIAL PRIMARY KEY,
//   user_id INT REFERENCES users(id),
//   species_name VARCHAR(200),
//   location VARCHAR(200),
//   latitude DECIMAL(10, 8),
//   longitude DECIMAL(11, 8),
//   description TEXT,
//   photo_url TEXT,
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// CREATE TABLE issues (
//   id SERIAL PRIMARY KEY,
//   user_id INT REFERENCES users(id),
//   title VARCHAR(300),
//   description TEXT,
//   location VARCHAR(200),
//   latitude DECIMAL(10, 8),
//   longitude DECIMAL(11, 8),
//   status VARCHAR(50) DEFAULT 'open',  -- 'open', 'in-progress', 'resolved'
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// CREATE TABLE missions (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR(300),
//   description TEXT,
//   points_reward INT DEFAULT 50,
//   deadline TIMESTAMP,
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// CREATE TABLE user_missions (
//   user_id INT REFERENCES users(id),
//   mission_id INT REFERENCES missions(id),
//   completed_at TIMESTAMP DEFAULT NOW(),
//   PRIMARY KEY (user_id, mission_id)
// );

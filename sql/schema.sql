-- Drop and recreate jokes table
DROP TABLE IF EXISTS jokes;

CREATE TABLE IF NOT EXISTS jokes (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  setup TEXT NOT NULL,
  delivery TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_jokes_category ON jokes(category);
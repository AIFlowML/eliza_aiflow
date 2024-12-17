cd /Users/ilessio/dev-agents/eliza_aiflow/local_docs/memory/adapters/adapter_postgres_new
docker-compose up -d-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- Function to determine vector dimension
CREATE OR REPLACE FUNCTION get_embedding_dimension()
RETURNS INTEGER AS $$
BEGIN
    -- Check for OpenAI first
    IF current_setting('app.use_openai_embedding', TRUE) = 'true' THEN
        RETURN 1536;  -- OpenAI dimension
    -- Then check for Ollama
    ELSIF current_setting('app.use_ollama_embedding', TRUE) = 'true' THEN
        RETURN 1024;  -- Ollama mxbai-embed-large dimension
    ELSE
        RETURN 384;   -- BGE/Other embedding dimension
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Begin transaction
BEGIN;

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "details" JSONB DEFAULT '{}'::jsonb
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Memories table with vector support
CREATE TABLE IF NOT EXISTS memories (
    "id" UUID PRIMARY KEY,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "content" JSONB NOT NULL,
    "embedding" vector(get_embedding_dimension()),
    "userId" UUID REFERENCES accounts("id"),
    "agentId" UUID REFERENCES accounts("id"),
    "roomId" UUID REFERENCES rooms("id"),
    "unique" BOOLEAN DEFAULT true NOT NULL,
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE,
    CONSTRAINT fk_agent FOREIGN KEY ("agentId") REFERENCES accounts("id") ON DELETE CASCADE
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID REFERENCES accounts("id"),
    "name" TEXT,
    "status" TEXT,
    "description" TEXT,
    "roomId" UUID REFERENCES rooms("id"),
    "objectives" JSONB DEFAULT '[]'::jsonb NOT NULL,
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE
);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL REFERENCES accounts("id"),
    "body" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "roomId" UUID NOT NULL REFERENCES rooms("id"),
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID REFERENCES accounts("id"),
    "roomId" UUID REFERENCES rooms("id"),
    "userState" TEXT,
    "last_message_read" TEXT,
    UNIQUE("userId", "roomId"),
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE
);

-- Cache table
CREATE TABLE IF NOT EXISTS cache (
    "key" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "value" JSONB DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP,
    PRIMARY KEY ("key", "agentId")
);

-- Add indices for frequently accessed columns
CREATE INDEX IF NOT EXISTS idx_memories_room_id ON memories ("roomId");
CREATE INDEX IF NOT EXISTS idx_memories_agent_id ON memories ("agentId");
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories ("createdAt");
CREATE INDEX IF NOT EXISTS idx_memories_content_gin ON memories USING gin (content jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_memories_embedding ON memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Add indices for participants table
CREATE INDEX IF NOT EXISTS idx_participants_room_id ON participants ("roomId");
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants ("userId");

-- Add indices for goals table
CREATE INDEX IF NOT EXISTS idx_goals_room_id ON goals ("roomId");
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals (status);

-- Add indices for cache table
CREATE INDEX IF NOT EXISTS idx_cache_agent_key ON cache ("agentId", key);

-- Add indices for logs table
CREATE INDEX IF NOT EXISTS idx_logs_room_id ON logs ("roomId");
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs ("userId");
CREATE INDEX IF NOT EXISTS idx_logs_type ON logs (type);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs ("createdAt");

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memories_type_room ON memories("type", "roomId");
CREATE INDEX IF NOT EXISTS idx_participants_user ON participants("userId");
CREATE INDEX IF NOT EXISTS idx_participants_room ON participants("roomId");
CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache("expiresAt");

COMMIT;

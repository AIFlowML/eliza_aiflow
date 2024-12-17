# Memory Dump Script

This script dumps all memories from Eliza's database into JSON files. It's useful for:
- Backing up memories before system reinstallation
- Migrating memories between different database adapters
- Creating snapshots of the memory state

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```bash
DATABASE_URL=           # Database connection string
MODEL_PROVIDER=         # Model provider (e.g., openai)
EMBEDDING_MODEL=        # Embedding model name
```

## Usage

Run the script using:
```bash
./run_dump_from_memory.sh
```

The script will:
1. Connect to the database using Eliza's runtime
2. Retrieve all memories
3. Save them to JSON files in the `json` directory
4. Preserve all memory attributes including embeddings

## Output Format

Memories are saved in JSON files with the following structure:
```json
{
  "id": "uuid",
  "roomId": "uuid",
  "type": "string",
  "content": {},
  "metadata": {},
  "embedding": [],
  "relationships": []
}
```

Each memory is saved in a separate file named `memory_[id].json` to allow for easy importing.

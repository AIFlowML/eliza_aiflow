# Memory Loading Scripts

This directory contains scripts and utilities for loading data into Eliza's memory system from various file formats.

## Directory Structure

- `json/`: JSON file loading scripts and data
- `pdf/`: PDF document loading scripts and data  
- `txt/`: Text file loading scripts and data
- `add_to_memory.js`: Main script for loading data into memory
- `add_to_memory.md`: Documentation and findings
- `run_add_to_memory.sh`: Shell script to run the memory loader

## Setup

1. Install dependencies:
```bash
npm install @ai16z/adapter-postgres @ai16z/eliza glob yargs
```

2. Configure environment variables:
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
export MODEL_PROVIDER="openai"  # or your preferred provider
export EMBEDDING_MODEL="text-embedding-ada-002"  # or your preferred model
```

## Usage

### Automatic Loading

Run the shell script to automatically process all files in the json/, txt/, and pdf/ directories:

```bash
./run_add_to_memory.sh
```

### Manual Loading

Load specific files:

```bash
# Load all files in directories
node add_to_memory.js

# Load a specific file
node add_to_memory.js --source json --file path/to/data.json
node add_to_memory.js --source txt --file path/to/data.txt
node add_to_memory.js --source pdf --file path/to/document.pdf
```

## File Formats

### JSON Format
```json
{
  "type": "memory_type",
  "content": {
    "text": "Memory content text",
    "metadata": {
      // Optional metadata fields
    }
  }
}
```

### Text Format
Plain text files are automatically converted to memories with appropriate metadata.

### PDF Format (Coming Soon)
PDF files will be parsed and converted to text memories with document structure metadata.

# Memory Dump Implementation

This document outlines the implementation details of the memory dump script.

## Architecture

The script uses Eliza's framework components:
- `AgentRuntime`: For initialization and configuration
- `MemoryManager`: For retrieving memories
- `elizaLogger`: For structured logging

## Memory Retrieval Process

1. **Initialization**
   - Load environment variables
   - Initialize Eliza runtime
   - Get memory manager instance

2. **Memory Retrieval**
   - Get all room IDs from the database
   - For each room, retrieve all memories
   - Handle pagination if necessary

3. **Memory Export**
   - Create output directory if not exists
   - Export each memory to a separate JSON file
   - Preserve all memory attributes including embeddings

4. **Error Handling**
   - Handle database connection errors
   - Handle file system errors
   - Implement proper cleanup

## Database Adapter Compatibility

The script works with any database adapter that implements the `IDatabaseAdapter` interface:
- PostgreSQL adapter
- Supabase adapter
- Any custom adapter

It uses the high-level `MemoryManager` API which abstracts the underlying database operations.

## Future Improvements

1. Add support for selective memory export by:
   - Room ID
   - Date range
   - Memory type

2. Add compression support for large memory dumps

3. Add progress reporting for large exports

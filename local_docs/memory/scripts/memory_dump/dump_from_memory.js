/**
 * Memory Dump Script for Eliza AI
 * 
 * This script dumps all memories from the database into JSON files.
 * It works with any database adapter that implements IDatabaseAdapter.
 * 
 * @module dump_from_memory
 */

import { 
  Memory, 
  AgentRuntime, 
  settings, 
  elizaLogger,
  ErrorCode,
  RuntimeError,
  MemoryManager
} from "@ai16z/eliza";
import fs from "fs/promises";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Initialize Eliza runtime with proper configuration
const runtime = new AgentRuntime({
  settings: {
    ...settings,
    MODEL_PROVIDER: process.env.MODEL_PROVIDER || "openai",
    EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || "text-embedding-ada-002",
    DATABASE_URL: process.env.DATABASE_URL,
  }
});

// Configure logger context
elizaLogger.setContext({ component: 'memory-dumper' });
elizaLogger.info('Initializing memory dumper', {
  modelProvider: runtime.settings.MODEL_PROVIDER,
  embeddingModel: runtime.settings.EMBEDDING_MODEL
});

// Get memory manager from runtime
const memoryManager = runtime.getMemoryManager();

/**
 * Ensure output directory exists
 * @param {string} outputDir - Directory path
 */
async function ensureOutputDir(outputDir) {
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    elizaLogger.error('Failed to create output directory', {
      error: error.message,
      outputDir
    });
    throw error;
  }
}

/**
 * Save memory to JSON file
 * @param {Memory} memory - Memory object to save
 * @param {string} outputDir - Output directory
 */
async function saveMemoryToFile(memory, outputDir) {
  try {
    const filename = `memory_${memory.id}.json`;
    const filePath = path.join(outputDir, filename);
    
    await fs.writeFile(
      filePath,
      JSON.stringify(memory, null, 2),
      'utf-8'
    );

    elizaLogger.debug('Saved memory to file', {
      memoryId: memory.id,
      filePath
    });
  } catch (error) {
    elizaLogger.error('Failed to save memory', {
      error: error.message,
      memoryId: memory.id
    });
    throw error;
  }
}

/**
 * Get all rooms from the database
 * @returns {Promise<string[]>} Array of room IDs
 */
async function getAllRooms() {
  try {
    // Get all rooms using the database adapter
    const rooms = await runtime.databaseAdapter.getRooms();
    return rooms.map(room => room.id);
  } catch (error) {
    elizaLogger.error('Failed to get rooms', {
      error: error.message
    });
    throw error;
  }
}

/**
 * Get all memories for a room
 * @param {string} roomId - Room ID
 * @returns {Promise<Memory[]>} Array of memories
 */
async function getMemoriesForRoom(roomId) {
  try {
    // Get all memories for the room using memory manager
    const memories = await memoryManager.getMemories({
      roomId,
      // No need to limit since we want all memories
    });
    
    elizaLogger.info('Retrieved memories for room', {
      roomId,
      count: memories.length
    });
    
    return memories;
  } catch (error) {
    elizaLogger.error('Failed to get memories for room', {
      error: error.message,
      roomId
    });
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    const argv = await yargs(hideBin(process.argv))
      .option("output", {
        alias: "o",
        type: "string",
        description: "Output directory for memory files",
        default: "./json",
      })
      .help()
      .argv;

    elizaLogger.info('Starting memory dump', {
      outputDir: argv.output
    });

    // Ensure output directory exists
    await ensureOutputDir(argv.output);

    // Get all rooms
    const rooms = await getAllRooms();
    elizaLogger.info(`Found ${rooms.length} rooms`);

    let totalMemories = 0;
    let failedMemories = 0;

    // Process each room
    for (const roomId of rooms) {
      try {
        const memories = await getMemoriesForRoom(roomId);
        
        // Save each memory
        for (const memory of memories) {
          try {
            await saveMemoryToFile(memory, argv.output);
            totalMemories++;
          } catch (error) {
            failedMemories++;
            continue; // Continue with next memory even if one fails
          }
        }
      } catch (error) {
        elizaLogger.error('Failed to process room', {
          error: error.message,
          roomId
        });
        continue; // Continue with next room even if one fails
      }
    }

    elizaLogger.info('Memory dump completed', {
      totalRooms: rooms.length,
      totalMemories,
      failedMemories
    });

    // Clean up
    await runtime.shutdown();
  } catch (error) {
    elizaLogger.error('Fatal error during memory dump', {
      error: error.message,
      code: error.code
    });
    process.exit(1);
  }
}

main();

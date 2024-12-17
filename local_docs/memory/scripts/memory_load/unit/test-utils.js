/**
 * Shared test utilities for memory scripts
 */

/**
 * Create a mock memory object
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock memory object
 */
export function createMockMemory(overrides = {}) {
  return {
    id: 'test-memory-id',
    roomId: 'test-room-id',
    type: 'text',
    content: { text: 'Test memory content' },
    metadata: { source: 'test' },
    embedding: [0.1, 0.2, 0.3],
    relationships: [],
    ...overrides
  };
}

/**
 * Create a mock room object
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock room object
 */
export function createMockRoom(overrides = {}) {
  return {
    id: 'test-room-id',
    name: 'Test Room',
    ...overrides
  };
}

/**
 * Create a mock runtime for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock runtime object
 */
export function createMockRuntime(overrides = {}) {
  const memoryManager = {
    getMemories: jest.fn().mockResolvedValue([createMockMemory()]),
    createMemory: jest.fn().mockImplementation(memory => ({
      ...memory,
      id: 'generated-id',
      embedding: [0.1, 0.2, 0.3],
    })),
    ...overrides.memoryManager
  };

  const databaseAdapter = {
    getRooms: jest.fn().mockResolvedValue([createMockRoom()]),
    ...overrides.databaseAdapter
  };

  return {
    getMemoryManager: jest.fn().mockReturnValue(memoryManager),
    databaseAdapter,
    shutdown: jest.fn().mockResolvedValue(),
    ...overrides.runtime
  };
}

/**
 * Create mock file system responses
 * @returns {Object} Mock file system functions
 */
export function createMockFileSystem() {
  return {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn()
  };
}

/**
 * Wait for all promises to settle
 * @returns {Promise<void>}
 */
export async function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

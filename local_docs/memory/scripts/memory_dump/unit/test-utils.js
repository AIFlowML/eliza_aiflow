import { jest } from '@jest/globals';

export const mockMemoryManager = {
  getAllMemories: jest.fn(),
  addMemory: jest.fn(),
  removeMemory: jest.fn(),
};

export const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

export const mockRoom = {
  id: 'test-room-id',
  name: 'Test Room',
  description: 'A test room',
  memories: [],
};

export const mockMemory = {
  id: 'test-memory-id',
  content: 'Test memory content',
  metadata: {
    source: 'test',
    timestamp: new Date().toISOString(),
  },
};

export const mockMemories = [
  mockMemory,
  {
    id: 'test-memory-id-2',
    content: 'Another test memory content',
    metadata: {
      source: 'test',
      timestamp: new Date().toISOString(),
    },
  },
];

export const mockError = new Error('Test error');

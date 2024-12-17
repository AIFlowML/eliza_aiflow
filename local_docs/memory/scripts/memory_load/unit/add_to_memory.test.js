import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import { MemoryManager } from '@ai16z/eliza';
import { glob } from 'glob';

jest.mock('glob');
jest.mock('fs/promises');
jest.mock('@ai16z/eliza', () => ({
  MemoryManager: jest.fn(),
  elizaLogger: {
    setContext: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('Memory Load Script', () => {
  let runtime;
  let memoryManager;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock memory manager
    memoryManager = {
      createMemory: jest.fn().mockImplementation(memory => ({
        ...memory,
        id: 'generated-id',
        embedding: [0.1, 0.2, 0.3],
      })),
    };

    // Setup mock runtime
    runtime = {
      getMemoryManager: jest.fn().mockReturnValue(memoryManager),
      shutdown: jest.fn().mockResolvedValue(),
    };

    MemoryManager.mockImplementation(() => memoryManager);
  });

  describe('JSON Memory Loading', () => {
    it('should load valid JSON memory', async () => {
      const filePath = 'test.json';
      fs.readFile.mockResolvedValue(JSON.stringify({
        type: 'json',
        content: { key: 'value' },
        metadata: { source: 'test' },
      }));

      const result = await loadJsonMemory(filePath);

      expect(result).toBeDefined();
      expect(result.type).toBe('json');
      expect(result.content).toEqual({ key: 'value' });
      expect(memoryManager.createMemory).toHaveBeenCalled();
    });

    it('should handle invalid JSON format', async () => {
      const filePath = 'invalid.json';
      fs.readFile.mockResolvedValue('invalid json');

      await expect(loadJsonMemory(filePath)).rejects.toThrow();
    });

    it('should validate required JSON fields', async () => {
      const filePath = 'invalid.json';
      const invalidMemory = { content: 'missing type' };
      fs.readFile.mockResolvedValue(JSON.stringify(invalidMemory));

      await expect(loadJsonMemory(filePath)).rejects.toThrow();
    });
  });

  describe('Text Memory Loading', () => {
    it('should load text file', async () => {
      const filePath = 'test.txt';
      const content = 'Sample text content';
      fs.readFile.mockResolvedValue(content);

      const result = await loadTextMemory(filePath);

      expect(result).toBeDefined();
      expect(result.type).toBe('text');
      expect(result.content).toBe(content);
      expect(memoryManager.createMemory).toHaveBeenCalled();
    });

    it('should handle text file read errors', async () => {
      const filePath = 'error.txt';
      const error = new Error('Read failed');
      fs.readFile.mockRejectedValue(error);

      await expect(loadTextMemory(filePath)).rejects.toThrow(error);
    });
  });

  describe('PDF Memory Loading', () => {
    it('should throw not implemented error', async () => {
      const filePath = 'test.pdf';
      await expect(loadPdfMemory(filePath)).rejects.toThrow('PDF loading not implemented');
    });
  });

  describe('File Finding', () => {
    it('should find files with specified extensions', async () => {
      const directories = ['./test'];
      const extensions = ['.json', '.txt'];
      glob.sync.mockReturnValue(['test.json', 'test.txt']);

      const files = await findFiles(directories, extensions);

      expect(files).toHaveLength(2);
      expect(glob.sync).toHaveBeenCalled();
    });

    it('should handle no matching files', async () => {
      glob.sync.mockReturnValue([]);

      const files = await findFiles(['./test'], ['.json']);
      expect(files).toHaveLength(0);
    });
  });

  describe('File Processing', () => {
    it('should process JSON file', async () => {
      const filePath = 'test.json';
      fs.readFile.mockResolvedValue(JSON.stringify({
        type: 'json',
        content: { key: 'value' },
        metadata: { source: 'test' },
      }));

      const result = await processFile(filePath);

      expect(result).toBeDefined();
      expect(memoryManager.createMemory).toHaveBeenCalled();
    });

    it('should process text file', async () => {
      const filePath = 'test.txt';
      fs.readFile.mockResolvedValue('text content');

      const result = await processFile(filePath);

      expect(result).toBeDefined();
      expect(memoryManager.createMemory).toHaveBeenCalled();
    });

    it('should handle unknown file types', async () => {
      const filePath = 'test.unknown';
      await expect(processFile(filePath)).rejects.toThrow();
    });
  });

  describe('End-to-End Process', () => {
    it('should process all files successfully', async () => {
      // Mock file discovery
      glob.sync.mockReturnValue(['test.json', 'test.txt']);
      
      // Mock file reads
      fs.readFile
        .mockResolvedValueOnce(JSON.stringify({
          type: 'json',
          content: { key: 'value' },
          metadata: { source: 'test' },
        }))
        .mockResolvedValueOnce('text content');

      await main();

      expect(memoryManager.createMemory).toHaveBeenCalledTimes(2);
      expect(runtime.shutdown).toHaveBeenCalled();
    });

    it('should handle process errors gracefully', async () => {
      // Mock a file read error
      glob.sync.mockReturnValue(['error.json']);
      fs.readFile.mockRejectedValue(new Error('Read failed'));

      await main();

      expect(runtime.shutdown).toHaveBeenCalled();
    });
  });
});

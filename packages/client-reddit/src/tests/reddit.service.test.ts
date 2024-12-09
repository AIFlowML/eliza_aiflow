import { IAgentRuntime, elizaLogger } from "@ai16z/eliza";
import { RedditService } from "../services/reddit.service";
import { ModelProviderName } from "@ai16z/eliza";
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RawRedditUser } from "../types/reddit-types";

// Mock elizaLogger
vi.mock("@ai16z/eliza", async () => {
  const actual = await vi.importActual("@ai16z/eliza");
  return {
    ...actual,
    elizaLogger: {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock Snoowrap
vi.mock('snoowrap', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getSubmission: vi.fn().mockImplementation((id: string) => ({
        fetch: vi.fn().mockImplementation(() => {
          if (id === 'nonexistent_id') {
            return Promise.reject(new Error('Submission not found'));
          }
          return Promise.resolve({
            id,
            title: 'Test Post',
            selftext: 'Test Content',
            author: { name: 'testuser' },
            created_utc: Date.now() / 1000,
            subreddit: { display_name: 'test' },
            url: 'https://reddit.com/test',
            is_self: true
          });
        })
      })),
      getComment: vi.fn().mockImplementation((id: string) => ({
        fetch: vi.fn().mockImplementation(() => {
          if (id === 'nonexistent_id') {
            return Promise.reject(new Error('Comment not found'));
          }
          return Promise.resolve({
            id,
            body: 'Test Comment',
            author: { name: 'testuser' },
            created_utc: Date.now() / 1000,
            subreddit: { display_name: 'test' },
            parent_id: 't3_test',
            link_id: 't3_test'
          });
        })
      })),
      getSubreddit: vi.fn().mockImplementation((name: string) => ({
        fetch: vi.fn().mockImplementation(() => {
          if (name === 'nonexistent_subreddit') {
            return Promise.reject(new Error('Subreddit not found'));
          }
          return Promise.resolve({
            id: `t5_${name}`,
            name: name,
            display_name: name,
            title: `r/${name}`,
            public_description: 'Test subreddit',
            description: 'Test subreddit description',
            subscribers: 1000,
            created_utc: Date.now() / 1000,
            over18: false,
            subreddit_type: 'public',
            url: `/r/${name}`,
            banner_img: '',
            header_img: '',
            icon_img: '',
            active_user_count: 100,
            author: { name: name },
            subreddit: { display_name: name }
          });
        }),
        getNew: vi.fn().mockImplementation(() => {
          return Promise.resolve([{
            id: 'test_post',
            title: 'Test Post',
            selftext: 'Test Content',
            author: { name: 'testuser' },
            created_utc: Date.now() / 1000,
            subreddit: { display_name: name },
            url: 'https://reddit.com/test',
            is_self: true
          }]);
        })
      })),
      search: vi.fn().mockImplementation(() => {
        return Promise.resolve([{
          id: 'test_post',
          title: 'Test Post',
          selftext: 'Test Content',
          author: { name: 'testuser' },
          created_utc: Date.now() / 1000,
          subreddit: { display_name: 'test' },
          url: 'https://reddit.com/test',
          is_self: true
        }]);
      }),
      getMe: vi.fn().mockImplementation(() => {
        const user: RawRedditUser = {
          id: 't2_testuser',
          name: 'testuser',
          created_utc: Date.now() / 1000
        };
        return Promise.resolve(user);
      }),
      getUser: vi.fn().mockImplementation((username: string) => {
        if (username === 'nonexistent_user') {
          return Promise.reject(new Error('User not found'));
        }
        return {
          id: `t2_${username}`,
          name: username,
          created_utc: Date.now() / 1000,
          comment_karma: 100,
          link_karma: 200,
          fetch: vi.fn().mockResolvedValue({
            id: `t2_${username}`,
            name: username,
            created_utc: Date.now() / 1000,
            comment_karma: 100,
            link_karma: 200
          })
        };
      })
    }))
  };
});

// Create a complete mock runtime
const mockRuntime = {
  getSetting: (key: string) => {
    const envMap: { [key: string]: string } = {
      // Reddit OAuth settings
      REDDIT_CLIENT_ID: 'test_client_id',
      REDDIT_CLIENT_SECRET: 'test_client_secret',
      REDDIT_USER_AGENT: 'test_user_agent',
      REDDIT_REFRESH_TOKEN: 'test_refresh_token',
      REDDIT_APP_NAME: 'test_app',
      REDDIT_SERVER_PORT: '3000',
      REDDIT_NGROK_URL: 'https://test.ngrok.io',
      REDDIT_REDIRECT_URI: 'https://test.ngrok.io/callback',
      
      // Reddit content settings
      REDDIT_TOPIC: 'test_topic',
      REDDIT_TOPIC_2: 'test_topic_2',
      REDDIT_SUBREDDIT: 'test',
      REDDIT_SUBREDDIT_1: 'test_sub_1',
      REDDIT_SUBREDDIT_2: 'test_sub_2',
      
      // Reddit rate limiting settings
      REDDIT_COMMENTS_TEST: 'true',
      REDDIT_COMMENTS_LIMIT: '5',
      REDDIT_COMMENT_COOLDOWN: '300',
      REDDIT_MAX_COMMENTS_PER_HOUR: '10',
      REDDIT_MAX_COMMENTS_PER_DAY: '50'
    };
    return envMap[key] || '';
  },
  agentId: 'test-agent',
  serverUrl: 'http://test.com',
  databaseAdapter: null,
  token: 'test-token',
  modelProvider: ModelProviderName.OPENAI,
  imageModelProvider: ModelProviderName.OPENAI,
  providers: [],
  actions: [],
  evaluators: [],
  plugins: [],
  clients: [],
  adapters: [],
  services: {},
  state: {},
  character: {},
  memory: {},
  settings: {},
  messageManager: {
    addEmbeddingToMemory: vi.fn(),
    getMemories: vi.fn(),
    getCachedEmbeddings: vi.fn(),
    getMemoryById: vi.fn(),
    getMemoriesByRoomIds: vi.fn(),
    searchMemoriesByEmbedding: vi.fn(),
    createMemory: vi.fn(),
    removeMemory: vi.fn(),
    removeAllMemories: vi.fn(),
    countMemories: vi.fn(),
  },
  descriptionManager: {
    addEmbeddingToMemory: vi.fn(),
    getMemories: vi.fn(),
    getCachedEmbeddings: vi.fn(),
    getMemoryById: vi.fn(),
    getMemoriesByRoomIds: vi.fn(),
    searchMemoriesByEmbedding: vi.fn(),
    createMemory: vi.fn(),
    removeMemory: vi.fn(),
    removeAllMemories: vi.fn(),
    countMemories: vi.fn(),
  },
  eventEmitter: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
} as unknown as IAgentRuntime;

describe('RedditService', () => {
  let service: RedditService;

  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    service = RedditService.getInstance() as RedditService;
    await service.initialize(mockRuntime);
  });

  afterEach(() => {
    service.cleanup();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const newService = RedditService.getInstance() as RedditService;
      await expect(newService.initialize(mockRuntime)).resolves.not.toThrow();
      
      // Verify logging
      expect(elizaLogger.debug).toHaveBeenCalledWith('🔄 Initializing Reddit service');
      expect(elizaLogger.debug).toHaveBeenCalledWith('✅ Reddit service initialized successfully');
    });

    it('should throw error with invalid credentials', async () => {
      const badRuntime = {
        ...mockRuntime,
        getSetting: () => ''
      } as unknown as IAgentRuntime;

      const newService = RedditService.getInstance() as RedditService;
      await expect(newService.initialize(badRuntime)).rejects.toThrow();
      
      // Verify error logging
      expect(elizaLogger.error).toHaveBeenCalled();
    });
  });

  describe('Search Operations', () => {
    it('should search posts', async () => {
      const results = await service.search('test query', { limit: 5 });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(5);
      
      const successfulResults = results.filter(r => r.success && r.data);
      successfulResults.forEach(result => {
        if (result.data) {
          expect(result.data).toHaveProperty('id');
          expect(result.data).toHaveProperty('title');
          expect(result.data).toHaveProperty('author');
        }
      });
      
      // Verify logging
      expect(elizaLogger.debug).toHaveBeenCalledWith('🔍 Searching Reddit for: test query');
    });
  });

  describe('Submission Operations', () => {
    it('should get submission by ID', async () => {
      const result = await service.getSubmission('test_submission_id');
      expect(result).toHaveProperty('success');
      
      if (result.success && result.data) {
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('title');
        expect(result.data).toHaveProperty('author');
      }
      
      // Verify logging
      expect(elizaLogger.debug).toHaveBeenCalledWith('🔍 Getting submission: test_submission_id');
    });

    it('should get subreddit posts', async () => {
      const results = await service.getSubredditPosts({
        subreddit: 'test',
        limit: 5,
        sort: 'new'
      });

      expect(Array.isArray(results)).toBe(true);
      results.forEach(result => {
        if (result.success && result.data) {
          expect(result.data).toHaveProperty('id');
          expect(result.data).toHaveProperty('title');
          expect(result.data).toHaveProperty('subreddit');
        }
      });
      
      // Verify logging
      expect(elizaLogger.debug).toHaveBeenCalledWith('🔍 Getting posts from r/test');
    });
  });

  describe('Comment Operations', () => {
    it('should get comment by ID', async () => {
      const result = await service.getComment('test_comment_id');
      expect(result).toHaveProperty('success');
      
      if (result.success && result.data) {
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('body');
        expect(result.data).toHaveProperty('author');
      }
      
      // Verify logging
      expect(elizaLogger.debug).toHaveBeenCalledWith('🔍 Getting comment: test_comment_id');
    });

    it('should get submission comments', async () => {
      const results = await service.getComments('test_submission_id');
      expect(Array.isArray(results)).toBe(true);
      
      results.forEach(result => {
        if (result.success && result.data) {
          expect(result.data).toHaveProperty('id');
          expect(result.data).toHaveProperty('body');
          expect(result.data).toHaveProperty('author');
        }
      });
      
      // Verify logging
      expect(elizaLogger.debug).toHaveBeenCalledWith('🔍 Getting comments for submission: test_submission_id');
    });

    it('should reply to comment', async () => {
      const result = await service.replyToComment('test_comment_id', 'Test reply');
      expect(result).toHaveProperty('success');
      
      if (result.success && result.data) {
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('body');
        expect(result.data.body).toBe('Test reply');
      }
      
      // Verify logging
      expect(elizaLogger.debug).toHaveBeenCalledWith('📝 Replying to comment: test_comment_id');
    });

    it('should reply to submission', async () => {
      const result = await service.replyToSubmission('test_submission_id', 'Test reply');
      expect(result).toHaveProperty('success');
      
      if (result.success && result.data) {
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('body');
        expect(result.data.body).toBe('Test reply');
      }
      
      // Verify logging
      expect(elizaLogger.debug).toHaveBeenCalledWith('📝 Replying to submission: test_submission_id');
    });
  });

  describe('User Operations', () => {
    it('should get current user', async () => {
      const user = await service.getCurrentUser();
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('created_utc');
    });

    it('should get user info', async () => {
      const user = await service.getUserInfo('test_user');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('created_utc');
    });

    it('should get user mentions', async () => {
      const mentions = await service.getUserMentions('test_user');
      expect(Array.isArray(mentions)).toBe(true);
      
      mentions.forEach(mention => {
        if (mention.success && mention.data) {
          expect(mention.data).toHaveProperty('id');
          expect(mention.data).toHaveProperty('body');
          expect(mention.data).toHaveProperty('author');
        }
      });
    });
  });

  describe('Subreddit Operations', () => {
    it('should get subreddit info', async () => {
      const info = await service.getSubredditInfo('test');
      expect(info).toBeDefined();
      expect(info).toHaveProperty('id');
      expect(info).toHaveProperty('author.name');
      expect(info).toHaveProperty('created_utc');
      expect(info).toHaveProperty('subreddit.display_name');
    });

    it('should handle non-existent subreddit', async () => {
      await expect(service.getSubredditInfo('nonexistent_subreddit'))
        .rejects.toThrow('Subreddit not found');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent submission', async () => {
      const result = await service.getSubmission('nonexistent_id');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      
      // Verify error logging
      expect(elizaLogger.error).toHaveBeenCalled();
    });

    it('should handle non-existent comment', async () => {
      const result = await service.getComment('nonexistent_id');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      
      // Verify error logging
      expect(elizaLogger.error).toHaveBeenCalled();
    });

    it('should handle non-existent subreddit', async () => {
      await expect(service.getSubredditInfo('nonexistent_subreddit'))
        .rejects.toThrow('Subreddit not found');
      
      // Verify error logging
      expect(elizaLogger.error).toHaveBeenCalled();
    });

    it('should handle non-existent user', async () => {
      await expect(service.getUserInfo('nonexistent_user'))
        .rejects.toThrow('User not found');
      
      // Verify error logging
      expect(elizaLogger.error).toHaveBeenCalled();
    });
  });
}); 
// Jest test setup
beforeAll(() => {
  // Setup test environment variables
  process.env.REDDIT_CLIENT_ID = 'test_client_id';
  process.env.REDDIT_CLIENT_SECRET = 'test_client_secret';
  process.env.REDDIT_USER_AGENT = 'test_user_agent';
  process.env.REDDIT_REFRESH_TOKEN = 'test_refresh_token';
});

afterAll(() => {
  // Clean up test environment variables
  delete process.env.REDDIT_CLIENT_ID;
  delete process.env.REDDIT_CLIENT_SECRET;
  delete process.env.REDDIT_USER_AGENT;
  delete process.env.REDDIT_REFRESH_TOKEN;
});

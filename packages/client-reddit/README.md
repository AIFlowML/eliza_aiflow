# Reddit Client for Eliza AI Agent

A Reddit interaction client that allows the Eliza AI agent to safely interact with Reddit communities while following strict guidelines and rules.

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Testing](#testing)
- [Development](#development)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Contributing](#contributing)

## Installation

```bash
# Install with pnpm
pnpm add @ai16z/client-reddit

# Install peer dependencies
pnpm add @ai16z/eliza snoowrap
```

## Features

### Core Functionality
- Reddit OAuth authentication
- Post and comment retrieval
- Subreddit monitoring
- User interaction management
- Rate limiting and safety controls

### Available Actions
1. **RetrieveDataAction**
   - Search posts across subreddits
   - Get posts from monitored subreddits
   - Retrieve specific posts by ID
   - Get subreddit information

2. **PostContentAction**
   - Create and manage posts
   - Comment on posts
   - Reply to comments
   - Track interaction history

3. **UserInteractionAction**
   - Monitor user mentions
   - Handle user interactions
   - Manage user permissions

## Usage

### Basic Example
```typescript
import { RedditService } from '@ai16z/client-reddit';

// Initialize the service
const service = RedditService.getInstance();
await service.initialize(runtime);

// Search for posts
const results = await service.search('typescript', { limit: 5 });

// Get subreddit info
const info = await service.getSubredditInfo('typescript');

// Get user info
const user = await service.getUserInfo('username');
```

### Standalone Examples
The package includes several standalone examples:
```bash
# Run example scripts
pnpm run example           # Basic example
pnpm run example:post      # Post creation example
pnpm run example:comment   # Comment interaction example
pnpm run example:retrieve  # Data retrieval example
```

## Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Test Structure
Tests are organized by functionality:
- Initialization tests
- Search operations
- Submission operations
- Comment operations
- User operations
- Subreddit operations
- Error handling

### Test Coverage
The test suite covers:
- Service initialization
- Data retrieval
- Error handling
- Rate limiting
- Type safety
- Edge cases

## Development

### Setup
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test
```

### Available Scripts
```bash
pnpm run build           # Build the package
pnpm run dev            # Run in development mode
pnpm run test           # Run tests
pnpm run lint           # Run linter
pnpm run lint:fix       # Fix linting issues
pnpm run clean         # Clean build artifacts
```

## API Reference

### RedditService
Main service class for Reddit interactions.

```typescript
class RedditService {
  static getInstance(): RedditService;
  initialize(runtime: IAgentRuntime): Promise<void>;
  search(query: string, options?: SearchOptions): Promise<SubmissionResponse[]>;
  getSubmission(submissionId: string): Promise<SubmissionResponse>;
  getSubredditInfo(name: string): Promise<RawRedditContent | null>;
  getUserInfo(username: string): Promise<RedditUser>;
  // ... other methods
}
```

### Types
```typescript
interface SearchOptions {
  sort?: 'relevance' | 'hot' | 'top' | 'new';
  limit?: number;
}

interface RedditContent {
  id: string;
  author: string;
  created_utc: number;
  subreddit: string;
}

// ... other type definitions
```

## Configuration

### Environment Variables
```env
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=ElizaRedditBot/1.0.0
REDDIT_REFRESH_TOKEN=your_refresh_token
```

### OAuth Setup
1. Create a Reddit application at https://www.reddit.com/prefs/apps
2. Get client credentials
3. Run the token generator:
```bash
pnpm run get-token
```

## Contributing

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use functional programming patterns
- Write comprehensive tests
- Document public APIs

### Testing Guidelines
- Write unit tests for new features
- Maintain test coverage
- Test error cases
- Mock external dependencies

## Running the Reddit Client

To set up and test the Reddit client, you can use the provided shell script:

```bash
./src/providers/run-reddit-client.sh
```

This script will:
1. Build the project
2. Get a new refresh token (if needed)
3. Test the Reddit client connection

Make sure to have your `.env` file properly configured before running the script.

## License
MIT License - See LICENSE file for details 
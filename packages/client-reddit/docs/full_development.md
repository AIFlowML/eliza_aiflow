# Reddit Client Development Documentation

## Project Structure
Working directory: `/Users/ilessio/dev-agents/eliza_aiflow/packages/client-reddit`

### Key Files and Their Purposes

#### Service Layer (`/src/services/`)
- `reddit.service.ts`: Core service that interfaces with Reddit API via Snoowrap
  - Handles direct API calls
  - Returns typed Promises for all operations
  - Uses singleton pattern
  - Current methods:
    ```typescript
    initialize(): Promise<void>
    getPost(postId: string): Promise<Snoowrap.Submission>
    getSubredditPosts(options: RedditActionOptions): Promise<Snoowrap.Submission[]>
    getComment(commentId: string): Promise<Snoowrap.Comment>
    getSubreddit(name: string): Promise<Snoowrap.Subreddit>
    getCurrentUser(): Promise<Snoowrap.RedditUser>
    getUserInfo(username: string): Promise<Snoowrap.RedditUser>
    cleanup(): void
    ```

#### Action Layer (`/src/actions/`)
- `retrieve-data.action.ts`: High-level action wrapper around the service
  - Provides logging and error handling
  - Uses singleton pattern
  - Mirrors service methods but with additional logging
  - Methods return the same types as service layer

#### Types (`/src/types/`)
- `reddit-types.ts`: Contains all type definitions
  ```typescript
  export interface RedditActionOptions {
    subreddit: string;  // Required
    title?: string;
    content?: string;
    target?: string;
    sort?: "new" | "hot" | "top" | "controversial" | "rising";
    limit?: number;
  }
  ```

#### Examples (`/src/examples/`)
- `standalone-retrieve.ts`: Example usage of the client
  - Currently has type reference issues
  - Needs to be fixed to handle Promise chains correctly

### Current Issues

1. Type Reference Errors in `standalone-retrieve.ts`:
   ```typescript
   Type is referenced directly or indirectly in the fulfillment callback of its own 'then' method.
   ```
   This occurs in all await statements with type assertions:
   - getCurrentUser()
   - getSubreddit()
   - getPost()
   - getComment()
   - getUserInfo()

2. Missing Methods in Service:
   - createPost
   - createComment
   - sendPrivateMessage

### Type System

#### Snoowrap Types
```typescript
import type { 
  RedditUser, 
  Subreddit, 
  Submission, 
  Comment 
} from "snoowrap";
```

#### Response Types (Need to be implemented correctly)
```typescript
type RedditResponse<T> = T;
type RedditUserResponse = RedditResponse<RedditUser>;
type SubredditResponse = RedditResponse<Subreddit>;
type SubmissionResponse = RedditResponse<Submission>;
type CommentResponse = RedditResponse<Comment>;
```

### Environment Setup
Required environment variables:
```bash
REDDIT_USER_AGENT="eliza-agent"
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_REFRESH_TOKEN=
```

## Known Type Issues and Solutions to Try

1. Direct Promise Chain Solution:
   ```typescript
   const result = await action.getMethod() as Type;
   ```

2. Type Guard Solution:
   ```typescript
   function isRedditUser(obj: any): obj is RedditUser {
     return obj && typeof obj === 'object' && 'name' in obj;
   }
   ```

3. Interface Extension Solution:
   ```typescript
   interface SafeRedditUser extends Omit<RedditUser, keyof Promise<any>> {
     // Add necessary properties
   }
   ```

## Next Steps

1. Fix Type System:
   - Implement proper type guards
   - Create intermediate interfaces
   - Handle Promise chains correctly

2. Add Missing Methods:
   - Implement createPost
   - Implement createComment
   - Implement sendPrivateMessage

3. Update Tests:
   - Add type-safe test cases
   - Fix existing test type errors

4. Documentation:
   - Add JSDoc comments
   - Update README
   - Add API documentation

## Development Guidelines

1. Type Safety:
   - Always use explicit types
   - Avoid `any`
   - Use type guards where necessary

2. Error Handling:
   - Service layer: throw errors
   - Action layer: catch and log
   - Example layer: display user-friendly messages

3. Testing:
   - Unit tests for service
   - Integration tests for actions
   - E2E tests for examples

4. Code Style:
   - Use TypeScript strict mode
   - Follow ESLint rules
   - Use prettier for formatting

## Useful Commands

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm run test

# Lint
npm run lint

# Format
npm run format
```

## Dependencies

```json
{
  "dependencies": {
    "@ai16z/eliza": "workspace:*",
    "snoowrap": "^1.23.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/snoowrap": "^1.19.0"
  }
}
``` 
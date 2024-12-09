# Core Modifications Required for Reddit Client

## ServiceType Enum
In `@ai16z/eliza/src/types.ts`, add:
```typescript
export enum ServiceType {
    // ... existing types ...
    REDDIT = "reddit"
}
```

## IRedditService Interface
In `@ai16z/eliza/src/types.ts`, add:
```typescript
import type { Snoowrap } from "snoowrap";

export interface IRedditService extends Service {
    client: Snoowrap;
}
```

## Package Dependencies
Add to `@ai16z/eliza/package.json`:
```json
{
  "dependencies": {
    "snoowrap": "^1.23.0"
  }
}
```

## Temporary Workaround
Until these changes are merged into @ai16z/eliza, we're using:
```typescript
// In reddit.service.ts
static get serviceType(): ServiceType {
    return ServiceType.TEXT_GENERATION;  // Temporary until REDDIT is added
}
```

## Implementation Notes
1. The Reddit service follows the same pattern as the Slack service:
   - Extends the base Service class
   - Implements getInstance() using super.getInstance()
   - Provides proper initialization with runtime
   - Manages client state and cleanup

2. Key differences from Slack:
   - Uses Snoowrap instead of WebClient
   - Requires OAuth2 PKCE flow for authentication
   - Has different event types and API endpoints

3. Future Improvements:
   - Add proper REDDIT ServiceType
   - Create dedicated IRedditService interface
   - Add Reddit-specific event handlers and types
   - Implement proper error handling and rate limiting 
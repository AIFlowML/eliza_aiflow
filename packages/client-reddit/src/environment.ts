import { elizaLogger, IAgentRuntime } from "@ai16z/eliza";

export interface RedditEnv {
  REDDIT_APP_NAME: string;
  REDDIT_SERVER_PORT: number;
  REDDIT_CLIENT_ID: string;
  REDDIT_CLIENT_SECRET: string;
  REDDIT_REFRESH_TOKEN: string;
  REDDIT_USER_AGENT: string;
  REDDIT_NGROK_URL: string;
  REDDIT_REDIRECT_URI: string;
  REDDIT_TOPIC: string;
  REDDIT_TOPIC_2: string;
  REDDIT_SUBREDDIT_1: string;
  REDDIT_SUBREDDIT_2: string;
  REDDIT_COMMENTS_TEST: string;
  REDDIT_COMMENTS_LIMIT: number;
  REDDIT_COMMENT_COOLDOWN: number;
  REDDIT_MAX_COMMENTS_PER_HOUR: number;
  REDDIT_MAX_COMMENTS_PER_DAY: number;
  REDDIT_SUBREDDIT: string;
}

export interface RedditOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  userAgent: string;
  appName: string;
  serverPort: number;
  refreshToken?: string;
}

export interface RedditMonitoringConfig {
  topics: string[];
  subreddits: string[];
}

export async function validateRedditEnv(runtime: IAgentRuntime): Promise<RedditEnv> {
  const rawEnv = {
    REDDIT_APP_NAME: await runtime.getSetting("REDDIT_APP_NAME"),
    REDDIT_SERVER_PORT: await runtime.getSetting("REDDIT_SERVER_PORT"),
    REDDIT_CLIENT_ID: await runtime.getSetting("REDDIT_CLIENT_ID"),
    REDDIT_CLIENT_SECRET: await runtime.getSetting("REDDIT_CLIENT_SECRET"),
    REDDIT_REFRESH_TOKEN: await runtime.getSetting("REDDIT_REFRESH_TOKEN"),
    REDDIT_USER_AGENT: await runtime.getSetting("REDDIT_USER_AGENT"),
    REDDIT_NGROK_URL: await runtime.getSetting("REDDIT_NGROK_URL"),
    REDDIT_REDIRECT_URI: await runtime.getSetting("REDDIT_REDIRECT_URI"),
    REDDIT_TOPIC: await runtime.getSetting("REDDIT_TOPIC"),
    REDDIT_TOPIC_2: await runtime.getSetting("REDDIT_TOPIC_2"),
    REDDIT_SUBREDDIT_1: await runtime.getSetting("REDDIT_SUBREDDIT_1"),
    REDDIT_SUBREDDIT_2: await runtime.getSetting("REDDIT_SUBREDDIT_2"),
    REDDIT_COMMENTS_TEST: await runtime.getSetting("REDDIT_COMMENTS_TEST"),
    REDDIT_COMMENTS_LIMIT: await runtime.getSetting("REDDIT_COMMENTS_LIMIT"),
    REDDIT_COMMENT_COOLDOWN: await runtime.getSetting("REDDIT_COMMENT_COOLDOWN"),
    REDDIT_MAX_COMMENTS_PER_HOUR: await runtime.getSetting("REDDIT_MAX_COMMENTS_PER_HOUR"),
    REDDIT_MAX_COMMENTS_PER_DAY: await runtime.getSetting("REDDIT_MAX_COMMENTS_PER_DAY"),
    REDDIT_SUBREDDIT: await runtime.getSetting("REDDIT_SUBREDDIT")
  };

  // Validate all required fields are present
  const missingFields = Object.entries(rawEnv)
    .filter(([key, value]) => {
      // Allow empty refresh token since we're generating one
      if (key === 'REDDIT_REFRESH_TOKEN') return false;
      return value === undefined || value === null || value === "";
    })
    .map(([key]) => key);

  if (missingFields.length > 0) {
    throw new Error(`Missing required Reddit environment variables: ${missingFields.join(", ")}`);
  }

  // Convert to proper types
  const env: RedditEnv = {
    ...rawEnv,
    REDDIT_SERVER_PORT: Number(rawEnv.REDDIT_SERVER_PORT),
    REDDIT_COMMENTS_LIMIT: Number(rawEnv.REDDIT_COMMENTS_LIMIT),
    REDDIT_COMMENT_COOLDOWN: Number(rawEnv.REDDIT_COMMENT_COOLDOWN),
    REDDIT_MAX_COMMENTS_PER_HOUR: Number(rawEnv.REDDIT_MAX_COMMENTS_PER_HOUR),
    REDDIT_MAX_COMMENTS_PER_DAY: Number(rawEnv.REDDIT_MAX_COMMENTS_PER_DAY)
  } as RedditEnv;

  // Validate numeric values
  if (isNaN(env.REDDIT_SERVER_PORT) || env.REDDIT_SERVER_PORT <= 0) {
    throw new Error("Invalid REDDIT_SERVER_PORT");
  }
  if (isNaN(env.REDDIT_COMMENTS_LIMIT) || env.REDDIT_COMMENTS_LIMIT <= 0) {
    throw new Error("Invalid REDDIT_COMMENTS_LIMIT");
  }
  if (isNaN(env.REDDIT_COMMENT_COOLDOWN) || env.REDDIT_COMMENT_COOLDOWN <= 0) {
    throw new Error("Invalid REDDIT_COMMENT_COOLDOWN");
  }
  if (isNaN(env.REDDIT_MAX_COMMENTS_PER_HOUR) || env.REDDIT_MAX_COMMENTS_PER_HOUR <= 0) {
    throw new Error("Invalid REDDIT_MAX_COMMENTS_PER_HOUR");
  }
  if (isNaN(env.REDDIT_MAX_COMMENTS_PER_DAY) || env.REDDIT_MAX_COMMENTS_PER_DAY <= 0) {
    throw new Error("Invalid REDDIT_MAX_COMMENTS_PER_DAY");
  }

  // Extract subreddit names from URLs
  if (env.REDDIT_SUBREDDIT?.includes('reddit.com/r/')) {
    env.REDDIT_SUBREDDIT = env.REDDIT_SUBREDDIT.split('/r/')[1].replace('/', '');
  }
  if (env.REDDIT_SUBREDDIT_1?.includes('reddit.com/r/')) {
    env.REDDIT_SUBREDDIT_1 = env.REDDIT_SUBREDDIT_1.split('/r/')[1].replace('/', '');
  }
  if (env.REDDIT_SUBREDDIT_2?.includes('reddit.com/r/')) {
    env.REDDIT_SUBREDDIT_2 = env.REDDIT_SUBREDDIT_2.split('/r/')[1].replace('/', '');
  }

  // Extract submission ID from test URL
  if (env.REDDIT_COMMENTS_TEST?.includes('reddit.com/r/')) {
    elizaLogger.info(`🔍 Processing Reddit URL: "${env.REDDIT_COMMENTS_TEST}"`);
    
    // First try to match the standard Reddit URL pattern
    const matches = env.REDDIT_COMMENTS_TEST.match(/\/comments\/([a-z0-9]+)(?:\/|$)/i);
    elizaLogger.debug(`URL regex matches:`, matches);
    
    if (matches && matches[1]) {
      const originalId = env.REDDIT_COMMENTS_TEST;
      const extractedId = matches[1];
      env.REDDIT_COMMENTS_TEST = extractedId;
      
      elizaLogger.info(`✅ Successfully extracted submission ID:`, {
        originalUrl: originalId,
        extractedId: extractedId,
        pattern: 'comments/{id}/',
        fullMatches: matches
      });
    } else {
      // If standard pattern fails, try alternative patterns
      const altMatches = env.REDDIT_COMMENTS_TEST.match(/\/r\/[^/]+\/([a-z0-9]+)(?:\/|$)/i);
      elizaLogger.debug(`Alternative regex matches:`, altMatches);
      
      if (altMatches && altMatches[1]) {
        const originalId = env.REDDIT_COMMENTS_TEST;
        const extractedId = altMatches[1];
        env.REDDIT_COMMENTS_TEST = extractedId;
        
        elizaLogger.info(`✅ Extracted submission ID (alt pattern):`, {
          originalUrl: originalId,
          extractedId: extractedId,
          pattern: '/r/subreddit/{id}/',
          fullMatches: altMatches
        });
      } else {
        elizaLogger.warn(`⚠️ Failed to extract submission ID:`, {
          url: env.REDDIT_COMMENTS_TEST,
          standardMatch: matches,
          alternativeMatch: altMatches
        });
      }
    }
  } else {
    elizaLogger.info(`ℹ️ Using direct submission ID: "${env.REDDIT_COMMENTS_TEST}"`);
  }

  elizaLogger.debug("📋 Validated Reddit Environment:", {
    appName: env.REDDIT_APP_NAME,
    serverPort: env.REDDIT_SERVER_PORT,
    mainSubreddit: env.REDDIT_SUBREDDIT,
    commentsLimit: env.REDDIT_COMMENTS_LIMIT,
    maxCommentsPerDay: env.REDDIT_MAX_COMMENTS_PER_DAY,
    maxCommentsPerHour: env.REDDIT_MAX_COMMENTS_PER_HOUR,
    commentCooldown: env.REDDIT_COMMENT_COOLDOWN
  });

  return env;
}

export async function getOAuthConfig(runtime: IAgentRuntime): Promise<RedditOAuthConfig> {
  const env = await validateRedditEnv(runtime);
  
  return {
    clientId: env.REDDIT_CLIENT_ID,
    clientSecret: env.REDDIT_CLIENT_SECRET,
    redirectUri: env.REDDIT_REDIRECT_URI,
    userAgent: env.REDDIT_USER_AGENT,
    appName: env.REDDIT_APP_NAME,
    serverPort: env.REDDIT_SERVER_PORT,
    refreshToken: env.REDDIT_REFRESH_TOKEN
  };
}

export async function getMonitoringConfig(runtime: IAgentRuntime): Promise<RedditMonitoringConfig> {
  const env = await validateRedditEnv(runtime);
  
  const topics = [env.REDDIT_TOPIC, env.REDDIT_TOPIC_2]
    .filter((topic): topic is string => Boolean(topic));

  const subreddits = [env.REDDIT_SUBREDDIT_1, env.REDDIT_SUBREDDIT_2]
    .filter((subreddit): subreddit is string => Boolean(subreddit))
    .map(url => {
      const match = url.match(/\/r\/([^/]+)/);
      return match ? match[1] : url;
    });

  return {
    topics,
    subreddits
  };
}

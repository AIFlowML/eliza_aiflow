import dotenv from "dotenv";
import { elizaLogger, IAgentRuntime } from "@ai16z/eliza";
import express from "express";
import Snoowrap from "snoowrap";
import { getOAuthConfig } from "../environment.js";
import { URL } from "url";

// Load environment variables
dotenv.config();

interface RedditTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  error?: string;
}

async function getRefreshToken(runtime: IAgentRuntime) {
  const config = await getOAuthConfig(runtime);
  
  return new Promise<string>((resolve, reject) => {
    const app = express();
    let server: any;

    // Parse the redirect URI to get the port
    const redirectUrl = new URL(config.redirectUri);
    const port = parseInt(redirectUrl.port) || 3070; // Default to 3072 if no port specified

    elizaLogger.info("Starting OAuth server with configuration:");
    elizaLogger.info(`Redirect URI: ${config.redirectUri}`);
    elizaLogger.info(`Port: ${port}`);
    elizaLogger.info(`Client ID: ${config.clientId}`);

    const startServer = () => {
      server = app.listen(port)
        .on('error', (err: any) => {
          elizaLogger.error(`Server error: ${err.message}`);
          if (err.code === 'EADDRINUSE') {
            elizaLogger.error(`Port ${port} is in use. Please make sure no other process is using this port.`);
            reject(new Error(`Port ${port} is in use`));
          } else {
            reject(err);
          }
        })
        .on('listening', () => {
          elizaLogger.info(`🌐 OAuth server listening on port ${port}`);
          elizaLogger.info("🔗 Opening browser for Reddit authentication...");
          
          const authUrl = Snoowrap.getAuthUrl({
            clientId: config.clientId,
            scope: ["identity", "edit", "flair", "history", "modconfig", "modflair", "modlog", "modposts", "modwiki", "mysubreddits", "privatemessages", "read", "report", "save", "submit", "subscribe", "vote", "wikiedit", "wikiread"],
            redirectUri: config.redirectUri,
            permanent: true,
            state: 'get_token'
          });

          elizaLogger.info(`\nPlease visit this URL to authorize the app:`);
          elizaLogger.info(authUrl);
          elizaLogger.info("\nWaiting for Reddit callback...");
        });
    };

    // Start the server
    startServer();

    app.get("/callback", async (req, res) => {
      elizaLogger.info("Received callback from Reddit");
      const { code, state, error } = req.query;

      if (error) {
        elizaLogger.error(`Reddit OAuth error: ${error}`);
        res.status(400).send(`Authentication failed: ${error}`);
        reject(new Error(`Reddit OAuth error: ${error}`));
        return;
      }

      if (state !== 'get_token') {
        elizaLogger.error('Invalid state parameter');
        res.status(400).send('Invalid state parameter');
        reject(new Error('Invalid state parameter'));
        return;
      }

      try {
        elizaLogger.info("Getting access token from Reddit...");
        const authData = await fetch('https://www.reddit.com/api/v1/access_token', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': config.userAgent
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code as string,
            redirect_uri: config.redirectUri,
          }).toString(),
        });

        const tokenData = await authData.json() as RedditTokenResponse;
        
        if (tokenData.error) {
          elizaLogger.error(`Reddit API error: ${tokenData.error}`);
          throw new Error(`Reddit API error: ${tokenData.error}`);
        }

        const refreshToken = tokenData.refresh_token;
        if (!refreshToken) {
          throw new Error('No refresh token received from Reddit');
        }

        elizaLogger.info("Successfully obtained refresh token");
        res.send("Authentication successful! You can close this window.");
        server.close();
        resolve(refreshToken);
      } catch (error) {
        elizaLogger.error("Failed to get refresh token:", error);
        res.status(500).send("Failed to get refresh token");
        reject(error);
      }
    });
  });
}

async function main() {
  // Create a minimal runtime for testing
  const runtime: IAgentRuntime = {
    getSetting: (key: string) => process.env[key] || "",
  } as IAgentRuntime;

  try {
    elizaLogger.info("🚀 Starting Reddit OAuth flow...");
    const config = await getOAuthConfig(runtime);
    elizaLogger.info("Loaded configuration:", {
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      userAgent: config.userAgent,
      appName: config.appName
    });
    const refreshToken = await getRefreshToken(runtime);
    elizaLogger.info("✅ OAuth flow completed.");
    elizaLogger.info("📝 Add this to your .env file:");
    elizaLogger.info(`REDDIT_REFRESH_TOKEN=${refreshToken}`);
    process.exit(0);
  } catch (error) {
    elizaLogger.error("❌ Error:", error);
    process.exit(1);
  }
}

// Check if this file is being run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main().catch((error) => {
    elizaLogger.error("❌ Unhandled error:", error);
    process.exit(1);
  });
}

export { getRefreshToken }; 
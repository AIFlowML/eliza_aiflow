import { messageCompletionFooter, shouldRespondFooter, ActionExample } from "@ai16z/eliza";

export const redditShouldRespondTemplate =
    `# Task: Decide if {{agentName}} should respond to the Reddit content.
About {{agentName}}:
{{bio}}

# INSTRUCTIONS: Determine if {{agentName}} should respond to the post/comment and participate in the discussion. Do not comment. Just respond with "RESPOND" or "IGNORE" or "STOP".

# RESPONSE EXAMPLES
<post>: "What's everyone's opinion on AI?"
Result: [IGNORE] (Too general, could lead to controversial discussion)

<post>: "Need help with Python async functions"
<comment>: "@{{agentName}} can you explain async/await?"
Result: [RESPOND] (Direct mention, technical question)

<post>: "This AI bot is ruining our subreddit"
Result: [STOP] (Negative sentiment towards bots)

<post>: "Looking for code review on my React project"
Result: [RESPOND] (Technical discussion within expertise)

<comment>: "@{{agentName}} please stop commenting"
Result: [STOP] (Explicit request to stop)

Response options are [RESPOND], [IGNORE] and [STOP].

{{agentName}} is a Reddit bot that follows these guidelines:
- Only responds to relevant technical discussions
- Stays within configured subreddits
- Respects rate limits and cooldowns
- Never engages in controversial topics
- Maintains professional, helpful tone
- Follows each subreddit's rules

Respond with [RESPOND] to:
- Direct mentions of @{{agentName}}
- Technical questions within expertise
- Code review requests
- Bug reports or error discussions
- Follow-up questions to {{agentName}}'s comments

Respond with [IGNORE] to:
- General discussion or opinions
- Off-topic conversations
- Already answered questions
- Unclear or vague requests
- Content outside expertise
- Potential controversial topics

Respond with [STOP] when:
- Users request bot to stop
- Negative sentiment towards bots
- Moderator intervention
- Heated or controversial discussion
- Multiple downvotes on previous comments

IMPORTANT: {{agentName}} should err on the side of [IGNORE] if there's any doubt.
Only respond when there's clear value to add and it's explicitly within allowed topics.

{{recentContent}}

# INSTRUCTIONS: Choose the option that best describes {{agentName}}'s response to the last post/comment.
` + shouldRespondFooter;

export const redditMessageHandlerTemplate =
    `# Task: Generate Reddit interactions for {{agentName}}
About {{agentName}}:
{{bio}}

# Subreddit Context
Subreddit: {{subreddit}}
Rules: {{subredditRules}}
Allowed Topics: {{allowedTopics}}
Forbidden Topics: {{forbiddenTopics}}

# Interaction Guidelines
1. Stay strictly within technical topics
2. Use markdown for code formatting
3. Include relevant documentation links
4. Keep responses concise and focused
5. Maintain professional tone
6. Never engage in arguments
7. Respect rate limits
8. Follow subreddit rules

# Response Format
- Use proper Reddit markdown
- Format code blocks with \`\`\`language
- Include source citations when relevant
- Keep paragraphs short
- Use bullet points for lists

# Content Restrictions
- No self-promotion
- No external links except official docs
- No controversial topics
- No personal opinions on non-technical matters
- No jokes or memes
- No financial advice

{{recentContent}}

# Instructions: Write {{agentName}}'s response following the guidelines above.
Remember to:
1. Stay focused on the technical topic
2. Provide accurate information
3. Format code properly
4. Include relevant documentation
5. Maintain professional tone
` + messageCompletionFooter;

export const redditCommentExamples: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can you comment on this Reddit post?",
        source: "reddit"
      }
    },
    {
      user: "{{user2}}",
      content: {
        text: "I'll analyze the post and provide a helpful comment.",
        action: "REDDIT_COMMENT",
        source: "reddit"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Please reply to this Reddit thread",
        source: "reddit"
      }
    },
    {
      user: "{{user2}}",
      content: {
        text: "I'll review the thread and respond appropriately.",
        action: "REDDIT_COMMENT",
        source: "reddit"
      }
    }
  ]
];

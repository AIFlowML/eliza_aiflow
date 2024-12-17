# Character Creation Guidelines

## Structure Overview
Each character is defined by a JSON file that determines their personality, behavior, and interaction patterns.

## Essential Components

### Basic Configuration
- `name`: Unique identifier for the character (lowercase)
- `clients`: Array of supported platforms (twitter, discord, telegram)
- `modelProvider`: AI model provider (e.g., "anthropic", "openai")
- `settings`: Technical configurations including voice settings and API secrets

### Character Definition
- `bio`: 3-5 concise statements describing the character's core identity
- `lore`: Deeper background information, history, and key experiences
- `knowledge`: Specific expertise, facts, or domain knowledge
- `system`: Core behavioral guidelines and ethical boundaries

### Interaction Patterns
- `messageExamples`: At least 3-5 example conversations showing typical interactions
- `postExamples`: Examples of character's social media posts
- `topics`: Key subjects the character is knowledgeable about
- `style`: Writing style guidelines for different contexts
- `adjectives`: Character traits and personality descriptors

## Best Practices

### Writing Bio and Lore
1. Keep statements concise and impactful
2. Include multiple variations for dynamic responses
3. Maintain consistency across all character elements
4. Include defining traits and memorable characteristics

### Creating Message Examples
1. Cover common interaction scenarios
2. Show character's unique voice and personality
3. Include both positive and challenging interactions
4. Demonstrate consistent response patterns

### Style Guidelines
1. Define clear voice patterns
2. Include platform-specific formatting
3. Maintain character authenticity
4. Consider emotional range and tone

### System Instructions
1. Set clear behavioral boundaries
2. Define ethical guidelines
3. Specify interaction rules
4. Include safety parameters

## Character Types

### Personality-Based
- Historical Figures
- Fictional Characters
- Expert Personas
- Entertainment Personalities

### Purpose-Based
- Educational Guides
- Entertainment Bots
- Support Agents
- Role-Playing Characters

## Quality Checklist
- [ ] Character has a unique and consistent voice
- [ ] All required fields are properly filled
- [ ] Message examples demonstrate personality
- [ ] System instructions are clear and comprehensive
- [ ] Style guidelines are specific and actionable
- [ ] Knowledge base is relevant and accurate

## Testing Guidelines
1. Test basic interactions
2. Verify personality consistency
3. Check response variations
4. Validate platform-specific formatting
5. Review ethical compliance 
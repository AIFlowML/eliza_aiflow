# GitHub Issue Manager Tool Documentation

## Overview
The GitHub Issue Manager is a specialized tool designed for analyzing and managing GitHub issues across repositories. It provides intelligent issue analysis, prioritization, and reporting capabilities.

## For DLLM (Deep Learning Language Models)

### Tool Identification
- **Tool Name**: `github_issue_manager`
- **Primary Purpose**: Analyze and prioritize GitHub issues
- **Input Type**: JSON-structured commands
- **Output Type**: JSON responses with metrics or markdown reports

### Available Actions

1. `analyze_issues`
   - Analyzes all issues in a repository
   - Returns detailed metrics for each issue
   - Example input:
   ```json
   {
     "action": "analyze_issues",
     "repository": "owner/repo",
     "state": "open"
   }
   ```

2. `generate_report`
   - Creates a markdown report of issue analysis
   - Includes summary statistics and top priority issues
   - Example input:
   ```json
   {
     "action": "generate_report",
     "repository": "owner/repo",
     "state": "open"
   }
   ```

### Metrics Explanation

1. **Difficulty Score (0-10)**
   - Base score: 5.0
   - Modifiers:
     - Bug label: +2
     - Enhancement label: +1
     - Documentation label: -1
     - Complex keywords: +0.5 each
     - Comments: +0.2 per comment (max +2)

2. **Priority Score (0-10)**
   - Base score: 5.0
   - Modifiers:
     - Age: -0.1 per day (max -3)
     - High-priority label: +3
     - Bug label: +2
     - Enhancement label: +1
     - Comments: +0.3 per comment (max +2)

3. **Issue Categories**
   - Bug
   - Enhancement
   - Documentation
   - Question
   - Discussion
   - Other

### Usage Guidelines for DLLM

1. **Context Awareness**
   - Always check repository existence before analysis
   - Consider repository size when generating reports
   - Be aware of rate limits and pagination

2. **Error Handling**
   - Handle invalid repository names
   - Manage token authentication errors
   - Process empty result sets appropriately

3. **Output Processing**
   - Parse JSON responses for metrics
   - Format markdown reports for display
   - Extract relevant statistics for decision-making

### Example Workflow

1. Analyze Repository Issues:
```python
response = await tool.run({
    "action": "analyze_issues",
    "repository": "ai16z/eliza",
    "state": "open"
})
```

2. Generate Priority Report:
```python
response = await tool.run({
    "action": "generate_report",
    "repository": "ai16z/eliza",
    "state": "open"
})
```

### Best Practices

1. **Repository Analysis**
   - Start with open issues first
   - Consider both issue age and activity
   - Factor in label importance

2. **Report Generation**
   - Focus on actionable metrics
   - Highlight high-priority issues
   - Include time estimates

3. **Decision Making**
   - Use priority scores for task ordering
   - Consider difficulty scores for resource allocation
   - Balance between different issue categories

### Integration Tips

1. **With Other Tools**
   - Combine with PR analysis tools
   - Integrate with project management systems
   - Link with documentation tools

2. **For Automation**
   - Schedule regular analysis runs
   - Set up priority thresholds
   - Automate report generation

### Environmental Requirements

1. **Authentication**
   - Requires `GITHUB_ACCESS_TOKEN_02` environment variable
   - Token needs public repository read access
   - Handle token expiration gracefully

2. **Rate Limiting**
   - Be aware of GitHub API limits
   - Implement appropriate waiting mechanisms
   - Cache results when possible

## Conclusion
This tool is designed to help DLLM agents effectively manage and prioritize GitHub issues. Use the metrics and reports to make informed decisions about issue handling and resource allocation. 
# Literature Review Generator (Python)

A professional, AI-powered tool for generating comprehensive literature reviews using OpenRouter LLM API.

## Features

✨ **Professional Output**
- Structured article metadata (title, authors, DOI, abstract, keywords)
- Detailed research analysis (goals, methodology, results, contributions)
- Field-wide synthesis with gaps and future directions
- Dark mode terminal output for easy reading


🔧 **Easy Setup**
- Simple environment variable configuration
- JSON export support
- Extensible architecture

## Installation

1. **Install Python dependencies:**
\`\`\`bash
pip install -r scripts/requirements.txt
\`\`\`

2. **Set environment variable:**
\`\`\`bash
export OPENROUTER_API_KEY="your-api-key-here"
\`\`\`

## Usage

\`\`\`bash
python scripts/literature_review_generator.py
\`\`\`

### Example Output

The tool generates a beautifully formatted review with:
- List of relevant research articles with full metadata
- Synthesis section covering field overview, gaps, and future directions
- JSON export for programmatic use

### Customization

Edit `main()` function to:
- Change research queries
- Adjust number of articles
- Modify LLM model
- Toggle dark mode

## Data Structure

### Article
\`\`\`json
{
  "title": "Article Title",
  "authors": ["Author 1", "Author 2"],
  "publication_year": 2024,
  "venue": "Journal/Conference",
  "doi": "10.xxxx/xxxxx",
  "abstract": "Research abstract...",
  "keywords": ["keyword1", "keyword2"],
  "research_goal": "What was achieved",
  "methodology": "How it was done",
  "main_results": "Key findings",
  "key_contributions": "Novel insights",
  "limitations": "Open questions",
  "confidence": "high",
  "source": "arXiv/Journal"
}
\`\`\`

### Synthesis
\`\`\`json
{
  "field_overview": "Common themes and trends",
  "gaps_and_challenges": "Underexplored areas",
  "future_directions": "Promising research paths",
  "practical_implications": "Real-world applications"
}
\`\`\`

## Testing

\`\`\`bash
# Test with sample query
python scripts/literature_review_generator.py

# Check JSON output
cat literature_review_output.json
\`\`\`

## Next Steps

- Integrate with real academic APIs (arXiv, Semantic Scholar)
- Add filtering and sorting options
- Implement database storage
- Create web dashboard

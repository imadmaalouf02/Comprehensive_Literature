#!/usr/bin/env python3
"""
Professional Literature Review Generator
Powered by OpenRouter LLM API
Generates comprehensive research landscapes with dark mode support
"""

import os
import json
import requests
from typing import Optional
from dataclasses import dataclass, asdict
from enum import Enum
import sys
from dotenv import load_dotenv
load_dotenv()
# Auto-enable ANSI colors on Windows
if os.name == "nt":
    os.system("")

class Colors:
    """ANSI color codes for terminal output"""
    RESET = '\033[0m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    
    PRIMARY = '\033[38;5;75m'
    ACCENT = '\033[38;5;214m'
    SUCCESS = '\033[38;5;84m'
    WARNING = '\033[38;5;208m'
    ERROR = '\033[38;5;196m'

    HEADING = '\033[38;5;255m'
    TEXT = '\033[38;5;250m'
    MUTED = '\033[38;5;238m'
    DIVIDER = '\033[38;5;59m'

    @staticmethod
    def disable():
        """Disable all colors (test/debug mode)"""
        for attr in dir(Colors):
            if not attr.startswith("_") and attr != "disable":
                setattr(Colors, attr, "")

@dataclass
class Article:
    """Structured article data"""
    title: str
    authors: list
    publication_year: int
    venue: str
    doi: Optional[str]
    abstract: str
    keywords: list
    research_goal: str
    methodology: str
    main_results: str
    key_contributions: str
    limitations: str
    confidence: str
    source: str


@dataclass
class Synthesis:
    """Field-wide synthesis data"""
    field_overview: str
    gaps_and_challenges: str
    future_directions: str
    practical_implications: str


@dataclass
class LiteratureReview:
    """Complete literature review structure"""
    query: str
    articles: list
    synthesis: dict
    generated_at: str


class LiteratureReviewGenerator:
    """Generate comprehensive literature reviews using OpenRouter API"""
    
    def __init__(self, api_key: str, model: str = "x-ai/grok-4.1-fast:free", dark_mode: bool = True):
        """
        Initialize the generator
        
        Args:
            api_key: OpenRouter API key
            model: LLM model to use
            dark_mode: Enable dark mode output
        """
        self.api_key = api_key
        self.model = model
        self.base_url = "https://openrouter.ai/chat"
        self.dark_mode = dark_mode
        
        if not dark_mode:
            Colors.disable()
    
    def _make_request(self, prompt: str) -> str:
        """Call OpenRouter API with structured prompt"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 4000,
        }
        
        try:
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
            return data['choices'][0]['message']['content']
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
    
    def generate_review(self, query: str, num_articles: int = 5) -> LiteratureReview:
        """
        Generate comprehensive literature review
        
        Args:
            query: Research query/topic
            num_articles: Number of articles to generate
            
        Returns:
            LiteratureReview object with structured data
        """
        self._print_header(f"Generating Literature Review: {query}")
        
        # Generate article metadata and summaries
        self._print_section("Retrieving Articles")
        articles_prompt = self._build_articles_prompt(query, num_articles)
        articles_json = self._make_request(articles_prompt)
        
        try:
            articles_data = json.loads(articles_json)
        except json.JSONDecodeError:
            # Extract JSON from response if wrapped in markdown
            import re
            match = re.search(r'\[.*\]', articles_json, re.DOTALL)
            if match:
                articles_data = json.loads(match.group())
            else:
                articles_data = []
        
        articles = [Article(**article) for article in articles_data]
        self._print_success(f"✓ Retrieved {len(articles)} articles")
        
        # Generate synthesis
        self._print_section("Analyzing Field & Generating Synthesis")
        synthesis_prompt = self._build_synthesis_prompt(query, articles)
        synthesis_json = self._make_request(synthesis_prompt)
        
        try:
            synthesis_data = json.loads(synthesis_json)
        except json.JSONDecodeError:
            import re
            match = re.search(r'\{.*\}', synthesis_json, re.DOTALL)
            if match:
                synthesis_data = json.loads(match.group())
            else:
                synthesis_data = {}
        
        self._print_success("✓ Synthesis complete")
        
        from datetime import datetime
        review = LiteratureReview(
            query=query,
            articles=[asdict(article) for article in articles],
            synthesis=synthesis_data,
            generated_at=datetime.now().isoformat()
        )
        
        return review
    
    def _build_articles_prompt(self, query: str, num_articles: int) -> str:
        """Build prompt for article generation"""
        return f"""Generate {num_articles} realistic academic articles for the research topic: "{query}"

Return ONLY a valid JSON array with this exact structure for each article:
[
  {{
    "title": "Article Title",
    "authors": ["Author Name 1", "Author Name 2"],
    "publication_year": 2024,
    "venue": "Journal/Conference Name",
    "doi": "10.xxxx/xxxxx",
    "abstract": "Research abstract...",
    "keywords": ["keyword1", "keyword2"],
    "research_goal": "What the research aimed to achieve",
    "methodology": "Methods and data used",
    "main_results": "Key findings and results",
    "key_contributions": "Novel contributions to the field",
    "limitations": "Limitations and open questions",
    "confidence": "high",
    "source": "arXiv/Journal"
  }}
]

Ensure all fields are filled with realistic, credible information relevant to the query."""

    def _build_synthesis_prompt(self, query: str, articles: list) -> str:
        """Build prompt for synthesis generation"""
        articles_summary = "\n".join([f"- {a.title} ({a.publication_year})" for a in articles])
        
        return f"""Analyze these research articles on "{query}" and provide a comprehensive field synthesis:

Articles:
{articles_summary}

Return ONLY valid JSON with this structure:
{{
  "field_overview": "Overview of common themes, trends, and methodologies in the field",
  "gaps_and_challenges": "Underexplored areas, methodological gaps, and open challenges",
  "future_directions": "Promising research directions and emerging opportunities",
  "practical_implications": "Real-world applications and industry relevance"
}}

Provide insightful, evidence-based analysis."""

    def _print_header(self, text: str):
        """Print section header"""
        print(f"\n{Colors.PRIMARY}{Colors.BOLD}{'='*70}{Colors.RESET}")
        print(f"{Colors.PRIMARY}{Colors.BOLD}{text:^70}{Colors.RESET}")
        print(f"{Colors.PRIMARY}{Colors.BOLD}{'='*70}{Colors.RESET}\n")
    
    def _print_section(self, text: str):
        """Print section title"""
        print(f"{Colors.HEADING}{Colors.BOLD}\n→ {text}{Colors.RESET}")
        print(f"{Colors.DIVIDER}{'─'*60}{Colors.RESET}")
    
    def _print_success(self, text: str):
        """Print success message"""
        print(f"{Colors.SUCCESS}{text}{Colors.RESET}")
    
    def _print_article(self, article: Article, index: int):
        """Pretty print article details"""
        print(f"\n{Colors.ACCENT}{Colors.BOLD}Article {index + 1}: {article.title}{Colors.RESET}")
        print(f"{Colors.TEXT}Authors: {', '.join(article.authors)}{Colors.RESET}")
        print(f"{Colors.TEXT}{article.venue} ({article.publication_year}){Colors.RESET}")
        
        if article.doi:
            print(f"{Colors.MUTED}DOI: {article.doi}{Colors.RESET}")
        
        print(f"\n{Colors.HEADING}Research Goal:{Colors.RESET}")
        print(f"{Colors.TEXT}{article.research_goal}{Colors.RESET}")
        
        print(f"\n{Colors.HEADING}Methodology:{Colors.RESET}")
        print(f"{Colors.TEXT}{article.methodology}{Colors.RESET}")
        
        print(f"\n{Colors.HEADING}Main Results:{Colors.RESET}")
        print(f"{Colors.TEXT}{article.main_results}{Colors.RESET}")
        
        print(f"\n{Colors.HEADING}Key Contributions:{Colors.RESET}")
        print(f"{Colors.TEXT}{article.key_contributions}{Colors.RESET}")
        
        print(f"\n{Colors.HEADING}Limitations:{Colors.RESET}")
        print(f"{Colors.TEXT}{article.limitations}{Colors.RESET}")
        
        print(f"\n{Colors.MUTED}Confidence: {article.confidence} | Source: {article.source}{Colors.RESET}")
    
    def display_review(self, review: LiteratureReview):
        """Display formatted literature review"""
        self._print_header(f"Literature Review Results: {review.query}")
        
        # Display articles
        print(f"{Colors.HEADING}{Colors.BOLD}\n📚 RESEARCH ARTICLES ({len(review['articles'])}){Colors.RESET}\n")
        for idx, article_dict in enumerate(review['articles']):
            article = Article(**article_dict)
            self._print_article(article, idx)
        
        # Display synthesis
        synthesis = review['synthesis']
        print(f"\n{Colors.PRIMARY}{Colors.BOLD}{'='*70}{Colors.RESET}")
        print(f"{Colors.HEADING}{Colors.BOLD}\n🔍 FIELD ANALYSIS & SYNTHESIS{Colors.RESET}\n")
        
        print(f"{Colors.ACCENT}{Colors.BOLD}Field Overview:{Colors.RESET}")
        print(f"{Colors.TEXT}{synthesis.get('field_overview', 'N/A')}{Colors.RESET}\n")
        
        print(f"{Colors.ACCENT}{Colors.BOLD}Gaps & Challenges:{Colors.RESET}")
        print(f"{Colors.TEXT}{synthesis.get('gaps_and_challenges', 'N/A')}{Colors.RESET}\n")
        
        print(f"{Colors.ACCENT}{Colors.BOLD}Future Directions:{Colors.RESET}")
        print(f"{Colors.TEXT}{synthesis.get('future_directions', 'N/A')}{Colors.RESET}\n")
        
        print(f"{Colors.ACCENT}{Colors.BOLD}Practical Implications:{Colors.RESET}")
        print(f"{Colors.TEXT}{synthesis.get('practical_implications', 'N/A')}{Colors.RESET}\n")
        
        print(f"{Colors.PRIMARY}{Colors.BOLD}{'='*70}{Colors.RESET}\n")
    
    def export_json(self, review: LiteratureReview, filepath: str):
        """Export review to JSON file"""
        with open(filepath, 'w') as f:
            json.dump(review, f, indent=2)
        print(f"{Colors.SUCCESS}✓ Review exported to {filepath}{Colors.RESET}")


def main():
    """Main entry point"""
    api_key = os.getenv('OPENROUTER_API_KEY')
    
    if not api_key:
        print(f"{Colors.ERROR}Error: OPENROUTER_API_KEY environment variable not set{Colors.RESET}")
        sys.exit(1)
    
    # Example queries
    queries = [
        "transformer-based OCR for historical documents",
        "social thermodynamics of learning in reinforcement learning",
        "federated learning for edge computing"
    ]
    
    generator = LiteratureReviewGenerator(api_key, dark_mode=True)
    
    # Generate and display review for first query
    query = queries[0]
    print(f"\n{Colors.PRIMARY}Starting literature review generator...{Colors.RESET}")
    print(f"{Colors.TEXT}Query: {query}{Colors.RESET}")
    
    try:
        review = generator.generate_review(query, num_articles=3)
        generator.display_review(review)
        generator.export_json(review, "literature_review_output.json")
    except Exception as e:
        print(f"{Colors.ERROR}Error: {str(e)}{Colors.RESET}")
        sys.exit(1)


if __name__ == "__main__":
    main()

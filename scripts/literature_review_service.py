"""
Professional Literature Review Backend Service
Integrates with OpenRouter API to generate comprehensive research landscapes
"""

import json
import os
import sys
from typing import Optional
import requests
from dataclasses import dataclass, asdict
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

@dataclass
class Article:
    """Structured article metadata"""
    title: str
    authors: list[str]
    publicationYear: int
    venue: str
    abstract: str
    keywords: list[str]
    researchGoal: str
    methodology: str
    mainResults: str
    keyContributions: str
    limitations: str
    confidence: str  # "low" | "medium" | "high"
    source: str
    doi: Optional[str] = None


@dataclass
class Synthesis:
    """Field-wide analysis and synthesis"""
    fieldOverview: str
    gapsAndChallenges: str
    futureDirections: str


@dataclass
class LiteratureReview:
    """Complete literature review response"""
    articles: list[Article]
    synthesis: Synthesis


class LiteratureReviewGenerator:
    """Professional literature review generator using OpenRouter API"""

    def __init__(self, api_key: str):
        """Initialize with OpenRouter API key"""
        self.api_key = api_key
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "x-ai/grok-4.1-fast:free"

    def generate_review(self, query: str) -> LiteratureReview:
        """Generate comprehensive literature review for given research query"""

        system_prompt = """You are an expert research assistant specialized in literature review and summarization.
Your task is to generate a comprehensive literature landscape for the given research query.

For each article, provide accurate metadata and structured information following this exact JSON format:
{
  "articles": [
    {
      "title": "Article Title",
      "authors": ["Author Name", "Another Author"],
      "publicationYear": 2024,
      "venue": "Journal/Conference Name",
      "doi": "10.xxxx/xxxxx",
      "abstract": "Clear, concise abstract",
      "keywords": ["keyword1", "keyword2"],
      "researchGoal": "Main research objective",
      "methodology": "Methods and data used",
      "mainResults": "Key findings and conclusions",
      "keyContributions": "Novel contributions to field",
      "limitations": "Limitations and open questions",
      "confidence": "high|medium|low",
      "source": "Semantic Scholar|arXiv|IEEE|ACM"
    }
  ],
  "synthesis": {
    "fieldOverview": "Common themes and trends in the field",
    "gapsAndChallenges": "Underexplored areas and open problems",
    "futureDirections": "Potential research directions"
  }
}

Generate 5-10 diverse, realistic articles. Return ONLY valid JSON, no markdown or additional text."""

        user_message = f"""Generate a comprehensive literature landscape for this research query: "{query}"

Retrieve 5-10 highly relevant articles with complete metadata. For each article:
- Provide realistic, plausible research information
- Set confidence level based on relevance
- Include keywords, methodology, and contributions
- Note any limitations or open questions

Format as valid JSON matching the specified schema."""

        print(f"[LiteratureReviewService] Calling OpenRouter API for query: {query}")

        try:
            response = requests.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 4000,
                },
                timeout=60,
            )

            if response.status_code != 200:
                raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")

            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

            if not content:
                raise Exception("No content in OpenRouter response")

            print("[LiteratureReviewService] OpenRouter response received successfully")

            # Parse JSON response
            parsed_data = self._parse_response(content)
            review = self._validate_and_structure_response(parsed_data)

            return review

        except requests.exceptions.RequestException as e:
            raise Exception(f"Request error: {str(e)}")
        except json.JSONDecodeError as e:
            raise Exception(f"JSON parsing error: {str(e)}")

    def _parse_response(self, content: str) -> dict:
        """Parse JSON response from OpenRouter"""
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            if "\`\`\`json" in content:
                json_str = content.split("\`\`\`json")[1].split("\`\`\`")[0].strip()
                return json.loads(json_str)
            elif "\`\`\`" in content:
                json_str = content.split("\`\`\`")[1].split("\`\`\`")[0].strip()
                return json.loads(json_str)
            elif "{" in content:
                json_str = content[content.find("{") : content.rfind("}") + 1]
                return json.loads(json_str)
            raise

    def _validate_and_structure_response(self, data: dict) -> LiteratureReview:
        """Validate and structure response into dataclass objects"""
        articles_data = data.get("articles", [])
        synthesis_data = data.get("synthesis", {})

        articles = [
            Article(
                title=a.get("title", "Unknown"),
                authors=a.get("authors", []),
                publicationYear=a.get("publicationYear", 2024),
                venue=a.get("venue", "Unknown"),
                abstract=a.get("abstract", ""),
                keywords=a.get("keywords", []),
                researchGoal=a.get("researchGoal", ""),
                methodology=a.get("methodology", ""),
                mainResults=a.get("mainResults", ""),
                keyContributions=a.get("keyContributions", ""),
                limitations=a.get("limitations", ""),
                confidence=a.get("confidence", "medium"),
                source=a.get("source", "Unknown"),
                doi=a.get("doi"),
            )
            for a in articles_data
        ]

        synthesis = Synthesis(
            fieldOverview=synthesis_data.get("fieldOverview", ""),
            gapsAndChallenges=synthesis_data.get("gapsAndChallenges", ""),
            futureDirections=synthesis_data.get("futureDirections", ""),
        )

        return LiteratureReview(articles=articles, synthesis=synthesis)

    def export_json(self, review: LiteratureReview, filename: str = "literature_review_output.json"):
        """Export review to JSON file"""
        data = {
            "articles": [asdict(article) for article in review.articles],
            "synthesis": asdict(review.synthesis),
            "generated_at": datetime.now().isoformat(),
        }

        with open(filename, "w") as f:
            json.dump(data, f, indent=2)

        print(f"[LiteratureReviewService] Review exported to {filename}")


def main():
    """Example usage"""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("Error: OPENROUTER_API_KEY environment variable not set")
        sys.exit(1)

    query = os.getenv("QUERY", "transformer-based OCR for historical documents")

    generator = LiteratureReviewGenerator(api_key)
    print(f"[LiteratureReviewService] Generating review for: {query}", file=sys.stderr)

    try:
        review = generator.generate_review(query)

        output = {
            "articles": [asdict(article) for article in review.articles],
            "synthesis": asdict(review.synthesis),
        }
        print(json.dumps(output))

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

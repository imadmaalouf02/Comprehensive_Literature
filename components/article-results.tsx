"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Article {
  title: string
  authors: string[]
  publicationYear: number
  venue: string
  doi?: string
  abstract: string
  keywords: string[]
  researchGoal: string
  methodology: string
  mainResults: string
  keyContributions: string
  limitations: string
  confidence: "low" | "medium" | "high"
  source: string
}

interface ArticleResultsProps {
  articles: Article[]
}

const confidenceConfig = {
  low: "bg-yellow-500/10 text-yellow-200 border-yellow-500/20",
  medium: "bg-blue-500/10 text-blue-200 border-blue-500/20",
  high: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
}

export default function ArticleResults({ articles }: ArticleResultsProps) {
  if (!articles || articles.length === 0) {
    return (
      <Card className="border-border/40 bg-card/50">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No articles found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <Card
          key={index}
          className="border-border/40 bg-card/50 hover:bg-card/80 hover:border-border/60 transition-all duration-200"
        >
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base mb-2 text-foreground">{article.title}</CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {article.authors.join(", ")} • {article.publicationYear} • {article.venue}
                </p>
              </div>
              <Badge variant="outline" className={`shrink-0 ${confidenceConfig[article.confidence]} border`}>
                {article.confidence}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {/* Abstract */}
            <div>
              <h4 className="font-semibold text-xs text-foreground mb-2 uppercase tracking-wide opacity-75">
                Abstract
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{article.abstract}</p>
            </div>

            {/* Research Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              <div>
                <h4 className="font-semibold text-xs text-foreground mb-1 uppercase tracking-wide opacity-75">
                  Research Goal
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{article.researchGoal}</p>
              </div>
              <div>
                <h4 className="font-semibold text-xs text-foreground mb-1 uppercase tracking-wide opacity-75">
                  Methodology
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{article.methodology}</p>
              </div>
              <div>
                <h4 className="font-semibold text-xs text-foreground mb-1 uppercase tracking-wide opacity-75">
                  Main Results
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{article.mainResults}</p>
              </div>
              <div>
                <h4 className="font-semibold text-xs text-foreground mb-1 uppercase tracking-wide opacity-75">
                  Key Contributions
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{article.keyContributions}</p>
              </div>
            </div>

            {/* Limitations */}
            <div className="pt-2 border-t border-border/40">
              <h4 className="font-semibold text-xs text-foreground mb-2 uppercase tracking-wide opacity-75">
                Limitations & Open Questions
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{article.limitations}</p>
            </div>

            {/* Keywords & Metadata */}
            <div className="pt-2 border-t border-border/40">
              <div className="flex flex-wrap gap-2 mb-3">
                {article.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-xs bg-secondary/40">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Source: {article.source}</span>
                {article.doi && (
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    DOI ↗
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

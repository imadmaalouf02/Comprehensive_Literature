"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import QueryInput from "@/components/query-input"
import ArticleResults from "@/components/article-results"
import SynthesisSection from "@/components/synthesis-section"
import ThemeToggle from "@/components/theme-toggle"
import SettingsButton from "@/components/settings-button"

interface LiteratureReview {
  articles: Article[]
  synthesis: {
    fieldOverview: string
    gapsAndChallenges: string
    futureDirections: string
  }
}

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

export default function Home() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [review, setReview] = useState<LiteratureReview | null>(null)
  const [error, setError] = useState("")

  const handleSearch = async (searchQuery: string, customApiKey?: string, customModel?: string) => {
    if (!searchQuery.trim()) {
      setError("Please enter a research query")
      return
    }

    setQuery(searchQuery)
    setLoading(true)
    setError("")
    setReview(null)

    try {
      const body: any = { query: searchQuery }

      if (customApiKey?.trim()) {
        console.log("[v0] Using custom API key")
        body.apiKey = customApiKey.trim()
      } else {
        console.log("[v0] Using default API key from environment")
      }

      if (customModel?.trim()) {
        body.model = customModel.trim()
      }

      console.log("[v0] Sending request with body:", { query: body.query, hasApiKey: !!body.apiKey, model: body.model })

      const response = await fetch("/api/literature-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || `API error: ${response.statusText}`
        throw new Error(errorMessage)
      }

      setReview(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate literature review"
      setError(errorMessage)
      console.error("[v0] Literature review error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              L
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Literature Review</h1>
              <p className="text-xs text-muted-foreground">Research Landscape Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SettingsButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Comprehensive Literature Landscapes
          </h2>
          <p className="text-lg text-muted-foreground">
            Generate AI-powered research article analyses with complete metadata, synthesis, and field insights powered
            by OpenRouter
          </p>
        </div>

        {/* Query Input */}
        <div className="mb-8 max-w-2xl mx-auto">
          <QueryInput onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-destructive/50 bg-destructive/5 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="mb-4" />
            <p className="text-muted-foreground">Generating literature review...</p>
          </div>
        )}

        {/* Results */}
        {review && !loading && (
          <div className="space-y-8">
            {/* Articles */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-1">Research Articles</h2>
                <p className="text-sm text-muted-foreground">{review.articles.length} articles found</p>
              </div>
              <ArticleResults articles={review.articles} />
            </div>

            {/* Synthesis */}
            <div className="mt-12 pt-8 border-t border-border/40">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-1">Field Analysis & Insights</h2>
                <p className="text-sm text-muted-foreground">Synthesized overview, gaps, and future directions</p>
              </div>
              <SynthesisSection synthesis={review.synthesis} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!review && !loading && (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-lg bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
            </div>
            <p className="text-muted-foreground text-lg">
              Enter a research query to generate a comprehensive literature review
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

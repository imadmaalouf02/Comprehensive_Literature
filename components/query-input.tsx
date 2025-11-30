"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface QueryInputProps {
  onSearch: (query: string, customApiKey?: string, customModel?: string) => void
  isLoading: boolean
}

export default function QueryInput({ onSearch, isLoading }: QueryInputProps) {
  const [input, setInput] = useState("")
  const [showApiWarning, setShowApiWarning] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const customApiKey = localStorage.getItem("custom-api-key") || ""
    const customModel = localStorage.getItem("custom-model") || "openai/gpt-4o-mini"

    if (!customApiKey.trim()) {
      console.log("[v0] Using default API key from environment")
    }

    console.log("[v0] Search initiated - API Key present:", !!customApiKey.trim(), "Model:", customModel)

    onSearch(input, customApiKey, customModel)
  }

  const suggestions = [
    "Transformer-based OCR for historical documents",
    "Social thermodynamics of learning in reinforcement learning",
    "Federated learning for privacy-preserving machine learning",
    "Vision transformers for medical imaging",
    "Large language models for code generation",
  ]

  return (
    <Card className="border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., 'Vision transformers for medical imaging'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Suggestions */}
          <div className="pt-2 border-t border-border/40">
            <p className="text-xs text-muted-foreground mb-3 font-medium">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  disabled={isLoading}
                  className="text-xs px-3 py-2 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-secondary/75 transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

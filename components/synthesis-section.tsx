"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Synthesis {
  fieldOverview: string
  gapsAndChallenges: string
  futureDirections: string
}

interface SynthesisSectionProps {
  synthesis: Synthesis
}

export default function SynthesisSection({ synthesis }: SynthesisSectionProps) {
  const sections = [
    {
      title: "Field Overview",
      content: synthesis.fieldOverview,
      icon: "🔍",
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      title: "Gaps & Challenges",
      content: synthesis.gapsAndChallenges,
      icon: "⚠️",
      color: "from-amber-500/20 to-amber-500/5",
    },
    {
      title: "Future Directions",
      content: synthesis.futureDirections,
      icon: "🚀",
      color: "from-emerald-500/20 to-emerald-500/5",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sections.map((section) => (
        <Card
          key={section.title}
          className={`border-border/40 bg-gradient-to-b ${section.color} hover:border-border/60 transition-all duration-200`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{section.icon}</span>
              <CardTitle className="text-base text-foreground">{section.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

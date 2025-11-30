import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

interface LiteratureReviewRequest {
  query: string
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

interface LiteratureReviewResponse {
  articles: Article[]
  synthesis: {
    fieldOverview: string
    gapsAndChallenges: string
    futureDirections: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LiteratureReviewRequest = await request.json()
    const { query } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query parameter" }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.error("[v0] Missing OPENROUTER_API_KEY")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("[v0] Calling Python backend with query:", query)

    // Call Python backend
    const response = await callPythonBackend(query, apiKey)
    return NextResponse.json(response)

  } catch (error) {
    console.error("[v0] API route error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate literature review" },
      { status: 500 }
    )
  }
}

async function callPythonBackend(query: string, apiKey: string): Promise<LiteratureReviewResponse> {
  return new Promise((resolve, reject) => {

    const pythonPath = "C:\\Users\\user\\anaconda3\\envs\\myenv\\python.exe"   // ✅ FIXED PATH
    const scriptPath = path.join(process.cwd(), "scripts", "literature_review_service.py")

    const pythonProcess = spawn(pythonPath, [scriptPath], {
      env: {
        ...process.env,
        OPENROUTER_API_KEY: apiKey,
        QUERY: query,
      },
    })

    let stdout = ""
    let stderr = ""

    pythonProcess.stdout?.on("data", (data) => {
      stdout += data.toString()
    })

    pythonProcess.stderr?.on("data", (data) => {
      stderr += data.toString()
    })

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python exited with code ${code}: ${stderr}`))
        return
      }

      try {
        const jsonMatch = stdout.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          reject(new Error("No JSON output from Python service"))
          return
        }

        resolve(JSON.parse(jsonMatch[0]))
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error}`))
      }
    })

    pythonProcess.on("error", (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`))
    })
  })
}

import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

interface LiteratureReviewRequest {
  query: string
  apiKey?: string
  model?: string
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
    const { query, apiKey, model } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query parameter" }, { status: 400 })
    }

    const trimmedApiKey = apiKey?.trim()
    const finalApiKey = trimmedApiKey || process.env.OPENROUTER_API_KEY
    const finalModel = model?.trim() || "openai/gpt-4o-mini"

    if (!finalApiKey) {
      console.error("[v0] Missing OPENROUTER_API_KEY - no custom key provided and no env variable set")
      return NextResponse.json(
        { error: "API key not configured. Please add your API key in Settings." },
        { status: 500 },
      )
    }

    if (!finalApiKey.startsWith("sk-")) {
      console.error("[v0] Invalid API key format - should start with sk-")
      return NextResponse.json({ error: "Invalid API key format. API keys should start with 'sk-'" }, { status: 400 })
    }

    console.log(
      "[v0] Calling Python backend - Query:",
      query,
      "Model:",
      finalModel,
      "Using custom key:",
      !!trimmedApiKey,
    )

    // Call Python backend service
    const response = await callPythonBackend(query, finalApiKey, finalModel)
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] API route error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate literature review"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

async function callPythonBackend(query: string, apiKey: string, model: string): Promise<LiteratureReviewResponse> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(process.cwd(), "scripts", "literature_review_service.py")

    let pythonPath = process.env.PYTHON_PATH || "python"

    // Try common Python installation paths on Windows if python3 is not available
    if (process.platform === "win32") {
      if (!pythonPath || pythonPath === "python") {
        pythonPath = "C:\\Users\\user\\anaconda3\\envs\\myenv\\python.exe"
      }
    }

    console.log("[v0] Spawning Python process with environment variables")
    console.log("[v0] Python path:", pythonPath)

    const pythonProcess = spawn(pythonPath, [pythonScriptPath], {
      env: {
        ...process.env,
        OPENROUTER_API_KEY: apiKey,
        QUERY: query,
        MODEL: model,
      },
    })

    let stdout = ""
    let stderr = ""

    pythonProcess.stdout?.on("data", (data) => {
      stdout += data.toString()
      console.log("[v0] Python stdout:", data.toString())
    })

    pythonProcess.stderr?.on("data", (data) => {
      stderr += data.toString()
      console.error("[v0] Python stderr:", data.toString())
    })

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("[v0] Python process failed with code:", code, "stderr:", stderr)
        reject(new Error(`Python process failed: ${stderr || "Unknown error"}`))
        return
      }

      try {
        // Extract JSON from stdout
        const jsonMatch = stdout.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          console.error("[v0] No JSON output found in stdout:", stdout)
          reject(new Error("No JSON output from Python service"))
          return
        }

        const result = JSON.parse(jsonMatch[0])
        console.log("[v0] Successfully parsed Python response")
        resolve(result)
      } catch (error) {
        console.error("[v0] Failed to parse Python output:", error, "stdout:", stdout)
        reject(new Error(`Failed to parse Python output: ${error}`))
      }
    })

    pythonProcess.on("error", (error) => {
      console.error("[v0] Failed to spawn Python process:", error)
      reject(new Error(`Failed to spawn Python process: ${error.message}`))
    })
  })
}

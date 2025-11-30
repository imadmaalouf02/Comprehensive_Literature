"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [customApiKey, setCustomApiKey] = useState("")
  const [customModel, setCustomModel] = useState("openai/gpt-4o-mini")
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const savedTheme = (localStorage.getItem("app-theme") as "light" | "dark") || "dark"
    const savedApiKey = localStorage.getItem("custom-api-key") || ""
    const savedModel = localStorage.getItem("custom-model") || "openai/gpt-4o-mini"

    setTheme(savedTheme)
    setCustomApiKey(savedApiKey)
    setCustomModel(savedModel)
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleSaveSettings = () => {
    if (customApiKey.trim() && !customApiKey.trim().startsWith("sk-")) {
      alert("API key should start with 'sk-'")
      return
    }

    localStorage.setItem("app-theme", theme)
    if (customApiKey.trim()) {
      localStorage.setItem("custom-api-key", customApiKey.trim())
    } else {
      localStorage.removeItem("custom-api-key")
    }
    localStorage.setItem("custom-model", customModel.trim())

    const htmlElement = document.documentElement
    if (theme === "dark") {
      htmlElement.classList.add("dark")
    } else {
      htmlElement.classList.remove("dark")
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!mounted) return null

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed z-50 px-4"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        ref={modalRef}
      >
        <Card
          className={`border border-border/40 bg-background shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            isDragging ? "cursor-grabbing" : ""
          }`}
          onMouseDown={handleMouseDown}
        >
          <CardHeader className="border-b border-border/40 cursor-grab active:cursor-grabbing">
            <CardTitle className="text-foreground">Settings</CardTitle>
            <CardDescription>Configure your display preferences</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* API Configuration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">API Configuration</label>
                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="text-xs text-blue-500 hover:text-blue-600 underline"
                >
                  {showApiKeyInput ? "Hide" : "Use Custom API"}
                </button>
              </div>

              {!showApiKeyInput ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs font-semibold text-foreground">Using Default API</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    OpenRouter API key is configured via environment variables.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-2">API Key</label>
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full px-3 py-2 bg-background border border-border/40 rounded text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-2">Model</label>
                    <div className="space-y-2">
                      <select
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border/40 rounded text-sm text-foreground focus:outline-none focus:border-blue-500/50"
                      >
                        <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                        <option value="openai/gpt-4o">OpenAI GPT-4o</option>
                        <option value="anthropic/claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                        <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
                        <option value="meta-llama/llama-3.1-8b">Llama 3.1 8B</option>
                        <option value="custom">Use Custom Model</option>
                      </select>
                      <input
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="Or type any model (e.g., grok/grok-2, grok/llama-3.1-70b)"
                        className="w-full px-3 py-2 bg-background border border-border/40 rounded text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Your custom API key will be saved locally and used instead of the default.
                  </p>
                </div>
              )}
            </div>

            {/* Display Mode */}
            <div className="border-t border-border/40 pt-6 space-y-3">
              <label className="text-sm font-semibold text-foreground block">Display Mode</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    theme === "light"
                      ? "border-blue-500 bg-blue-500/10 text-foreground"
                      : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-border/60"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    theme === "dark"
                      ? "border-blue-500 bg-blue-500/10 text-foreground"
                      : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-border/60"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t border-border/40 pt-6 flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSaveSettings} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                {saved ? "Saved!" : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme")
    const prefersDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDark(prefersDark)
    applyTheme(prefersDark)
  }, [])

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    applyTheme(newIsDark)
  }

  if (!mounted) {
    return <Button variant="ghost" size="sm" className="w-9 h-9 px-0" disabled />
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 px-0">
      {isDark ? "☀️" : "🌙"}
    </Button>
  )
}

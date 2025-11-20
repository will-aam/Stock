"use client"

import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const root = window.document.documentElement
    const initialTheme = root.classList.contains("dark") ? "dark" : "light"
    setTheme(initialTheme)
  }, [])

  const toggleTheme = () => {
    const root = window.document.documentElement
    const newTheme = theme === "light" ? "dark" : "light"

    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
    setTheme(newTheme)

    localStorage.setItem("theme", newTheme)
  }

  return { theme, toggleTheme }
}

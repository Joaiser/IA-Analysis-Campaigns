'use client'

import { useTheme } from "next-themes"
import { Moon, Sun, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { CampaignList } from "./updateCampaignsButton/updateCampaignsButton"

export function Nav() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null;

    const isDark = theme === 'dark'

    return (
        <nav className="flex items-center justify-between px-6 py-9 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AdVision
            </h1>
            <div className="flex items-center gap-4">
                <CampaignList />
                <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className="text-gray-600 dark:text-gray-300 cursor-pointer"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                    disabled
                    className="text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    title="Configuracion"
                >
                    <Settings size={20} />
                </button>
            </div>
        </nav>

    )
}
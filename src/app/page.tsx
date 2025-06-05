'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Nav } from "./components/nav/Nav";
import { CampaignsOverview } from './components/CampaignsOverview/CampaignsOverview';

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>

      <Nav />
      <main className=" flex flex-col items-center-safe justify-center py-10">
        <h1 className="text-4xl font-bold">Dark mode funcionando 🚀</h1>
        < CampaignsOverview />
      </main >
    </>
  )
}

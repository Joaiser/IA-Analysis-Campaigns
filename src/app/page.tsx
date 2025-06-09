'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Nav } from "./components/nav/Nav";
import { CampaignsOverview } from './components/CampaignsOverview/CampaignsOverview';
import { FilterSidebar } from './components/sidebar/FilterSidebar';

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
      <FilterSidebar />
      <main className=" flex flex-col items-center-safe justify-center py-10">
        < CampaignsOverview />
      </main >
    </>
  )
}

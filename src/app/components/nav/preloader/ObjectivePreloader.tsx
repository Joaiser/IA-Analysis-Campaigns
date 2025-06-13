'use client'

import { usePrefetchQuery } from "@/app/lib/queries/usePrefetchQuery"
import { fetchCampaignObjectives } from "@/app/lib/api/apiClient"
export function ObjectivePreloader() {
    usePrefetchQuery(["campaign-objectives"], fetchCampaignObjectives)
    return null
}

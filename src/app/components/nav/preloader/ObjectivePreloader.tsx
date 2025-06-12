'use client'

import { usePrefetchQuery } from "@/app/lib/queries/usePrefetchQuery"
import { fetchObjectivesFromDB } from "@/app/lib/queries/useCampaignObjectives"

export function ObjectivePreloader() {
    usePrefetchQuery(["campaign-objectives"], fetchObjectivesFromDB)
    return null
}

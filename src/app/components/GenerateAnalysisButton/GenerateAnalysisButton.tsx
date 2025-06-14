'use client'
import React from 'react'
import { useGenerateAIReport } from '@/app/lib/queries/useAIReport'
import { useAiReportStore } from '@/app/lib/store/useAiReportStore'
import { useRouter } from 'next/navigation'

interface Props {
    campaignId: string;
}

export const GenerateAnalysisButton: React.FC<Props> = ({ campaignId }) => {
    const router = useRouter()
    const setReport = useAiReportStore((state) => state.setReport)
    const mutation = useGenerateAIReport()

    const handleClick = () => {
        mutation.mutate(campaignId, {
            onSuccess: (data) => {
                setReport(campaignId, data)
                router.push(`/campaigns/${campaignId}`)
            },
            onError: (error) => {
                console.error('Error generando análisis:', error)
                // Aunque haya error, navego a la página
                router.push(`/campaigns/${campaignId}`)
            }
        })
    }

    return (
        <button
            onClick={handleClick}
            disabled={mutation.isPending || !campaignId}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {mutation.isPending ? 'Generando...' : 'Generar Análisis'}
        </button>
    )
}

//mirar si es isPending o isLoading
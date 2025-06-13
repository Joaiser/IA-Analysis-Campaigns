import { useQuery } from "@tanstack/react-query";

export function useAIReport(campaignId: string) {
    return useQuery({
        queryKey: ['aiReport', campaignId],
        queryFn: async () => {
            const res = await fetch(`/api/ai-report/${campaignId}`, {
                method: 'POST'
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Error generando informe')
            }

            const data = await res.json()
            return data.analysis
        },
        enabled: !!campaignId,
        retry: false,
    })
}
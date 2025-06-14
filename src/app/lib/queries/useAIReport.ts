import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AiReport } from '@/app/lib/models/aiReports';


export function useAIReport(campaignId: string) {
    return useQuery<AiReport>({
        queryKey: ['aiReport', campaignId],
        queryFn: async () => {
            const res = await fetch(`/api/ai-report/${campaignId}`, { method: 'GET' });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Error obteniendo informe');
            }
            return res.json();
        },
        enabled: !!campaignId,
        retry: false,
    });
}

export function useGenerateAIReport() {
    const queryClient = useQueryClient();
    return useMutation<AiReport, Error, string>({
        mutationFn: async (campaignId) => {
            const res = await fetch(`/api/ai-report/${campaignId}`, { method: 'POST' });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Error generando informe');
            }
            return res.json();
        },
        onSuccess: (data, campaignId) => {
            queryClient.setQueryData(['aiReport', campaignId], data);
        },
    });
}

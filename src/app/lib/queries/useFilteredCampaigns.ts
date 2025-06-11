import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CampaignAd } from '../models/CampaignAd';
import { useFilterStore } from '../store/filterStore';

type Filters = {
    objective?: string | null;
    dateRange?: { from: string; to: string } | null;
    platforms?: string[];
};

export const fetchFilteredCampaigns = async (filters: Filters): Promise<CampaignAd[]> => {
    const params = new URLSearchParams();

    if (filters.objective) params.append("objective", filters.objective);
    if (filters.dateRange?.from) params.append("from", filters.dateRange.from);
    if (filters.dateRange?.to) params.append("to", filters.dateRange.to);
    filters.platforms?.forEach(p => params.append("platforms", p));

    const res = await fetch(`/api/campaigns-filtered?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener campañas filtradas');
    return res.json(); // Asegúrate de que devuelve Campaign[]
};


export const useFilteredCampaigns = () => {
    const { objective, dateRange, platforms } = useFilterStore();

    return useQuery<CampaignAd[]>({
        queryKey: ['filtered-campaigns', { objective, dateRange, platforms }],
        queryFn: () => fetchFilteredCampaigns({ objective, dateRange, platforms }),
        enabled: Boolean(
            (objective && objective.trim() !== '') ||
            (dateRange?.from && dateRange?.to) ||
            (platforms && platforms.length > 0)
        )
    });
}
// lib/react-query/useFilteredCampaigns.ts
import { useQuery } from '@tanstack/react-query';
import { useFilterStore } from '@/app/lib/store/filterStore';

export const fetchFilteredCampaigns = async (filters: {
    objective?: string | null;
    dateRange?: { from: string, to: string } | null;
    platforms?: string[];
}) => {
    const params = new URLSearchParams();

    if (filters.objective) params.append("objective", filters.objective);
    if (filters.dateRange?.from) params.append("from", filters.dateRange.from);
    if (filters.dateRange?.to) params.append("to", filters.dateRange.to);
    filters.platforms?.forEach(p => params.append("platforms", p));

    const res = await fetch(`/api/campaigns-filtered?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener campañas filtradas');
    return res.json();
};

export const useFilteredCampaigns = () => {
    const { objective, dateRange, platforms } = useFilterStore();

    return useQuery({
        queryKey: ['filtered-campaigns', { objective, dateRange, platforms }],
        queryFn: () => fetchFilteredCampaigns({ objective, dateRange, platforms }),
        // Solo se ejecuta cuando hay filtros activos
        enabled: !!objective || !!dateRange || (platforms && platforms.length > 0)
    });
};
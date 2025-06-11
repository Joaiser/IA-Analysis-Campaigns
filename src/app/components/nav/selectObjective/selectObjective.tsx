'use client'

import { useCampaignObjectives } from "@/app/lib/queries/useCampaignObjectives"
import { useFilterStore } from "@/app/lib/store/filterStore"

export function SelectObjective() {
    const { data: objectives, isLoading, error } = useCampaignObjectives();
    const { objective, setFilters } = useFilterStore();

    if (isLoading) return <p>Cargando objetivos...</p>
    if (error) return <p>Error al cargar objetivos: {(error as Error).message}</p>

    return (
        <select
            value={objective ?? ""}
            onChange={(e) => setFilters({ objective: e.target.value || null })}
            className="w-full p-2 border rounded"
        >
            <option value="">Todos los objetivos</option>
            {objectives?.map((obj: { value: string; label: string }) => (
                <option key={obj.value} value={obj.value}>
                    {obj.label}
                </option>
            ))}
        </select>
    )
}

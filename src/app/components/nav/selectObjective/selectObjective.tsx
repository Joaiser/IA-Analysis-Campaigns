'use client'

import { useCampaignObjectives } from "@/app/lib/queries/useCampaignObjectives"
import { useFilterStore } from "@/app/lib/store/filterStore"
import { objectiveLabels } from "@/app/lib/utils/constants/objectiveLabels";


export function SelectObjective() {
    const { data: objectives, isLoading, error } = useCampaignObjectives();
    const { objective, setFilters } = useFilterStore();

    if (isLoading) return <p>Cargando objetivos...</p>
    if (error) return <p>Error al cargar objetivos: {(error as Error).message}</p>

    return (
        <select
            value={objective ?? ""}
            onChange={(e) => setFilters({ objective: e.target.value || null })}
            className="w-full p-2 border rounded my-3"
        >
            <option value="" className=" text-black dark:text-black">Todos los objetivos</option>
            {(Array.isArray(objectives) ? objectives : []).map((obj: { value: string; label: string }) => (
                <option key={obj.value} value={obj.value} className=" text-black dark:text-black">
                    {objectiveLabels[obj.label] || obj.label}
                </option>
            ))}
        </select>

    )
}

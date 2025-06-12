'use client'
import { useFilterStore } from "@/app/lib/store/filterStore"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { SelectObjective } from "../nav/selectObjective/selectObjective"
import { ObjectivePreloader } from "../nav/preloader/ObjectivePreloader"

export function FilterSidebar() {
    const {
        isOpen,
        closeSidebar,
        setFilters,
        objective: currentObjective,
        dateRange: currentDateRange,
        platforms: currentPlatforms,
        clearFilters
    } = useFilterStore()

    // Inicializa con los valores actuales del store
    const [objective, setObjective] = useState(currentObjective || '')
    const [platforms, setPlatforms] = useState(currentPlatforms || [])
    const [from, setFrom] = useState(currentDateRange?.from || '')
    const [to, setTo] = useState(currentDateRange?.to || '')

    useEffect(() => {
        if (!isOpen) return;

        // Resetear a los valores actuales cuando se abre
        setObjective(currentObjective || '')
        setPlatforms(currentPlatforms || [])
        setFrom(currentDateRange?.from || '')
        setTo(currentDateRange?.to || '')
    }, [isOpen])

    const applyFilters = () => {
        setFilters({
            objective: objective || null,
            platforms: platforms,
            dateRange: from && to ? { from, to } : null
        });
        closeSidebar();
    };

    const handleClearFilters = () => {
        clearFilters();
        setObjective('')
        setPlatforms([])
        setFrom('')
        setTo('')
    }

    if (!isOpen) return null

    return (
        <>
            <ObjectivePreloader />
            <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
                <div className="w-[300px] h-full bg-white dark:bg-gray-900 dark:text-white shadow-lg p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Filtros</h2>
                        <button onClick={closeSidebar} className="cursor-pointer">
                            <X />
                        </button>
                    </div>

                    <label className="text-sm font-medium">Objectivo</label>
                    <SelectObjective />

                    <label className="text-sm font-medium">Desde</label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="p-2 rounded border my-2 bg-gray-100 dark:bg-gray-800"
                    />

                    <label className="text-sm font-medium">Hasta</label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="p-2 rounded border my-2 bg-gray-100 dark:bg-gray-800"
                    />

                    <label className="text-sm font-medium">Plataforma</label>
                    <select
                        multiple
                        value={platforms}
                        onChange={(e) =>
                            setPlatforms(Array.from(e.target.selectedOptions, opt => opt.value))
                        }
                        className="p-2 rounded border my-2 bg-gray-100 dark:bg-gray-800"
                    >
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                    </select>

                    <div className="mt-auto flex space-x-2">
                        <button
                            onClick={handleClearFilters}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
                        >
                            Limpiar
                        </button>
                        <button
                            onClick={applyFilters}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
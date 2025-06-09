'use client'

import { useFilterStore } from "@/app/lib/store/filterStore"
import { X } from "lucide-react"
import { useEffect, useState } from "react"


export function FilterSidebar() {
    const { isOpen, closeSidebar, setFilters } = useFilterStore()
    const [objective, setObjective] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')


    useEffect(() => {
        if (!isOpen) {
            setObjective('')
            setPlatforms([])
            setFrom('')
            setTo('')
        }
    }, [isOpen])

    if (!isOpen) return null

    console.log({ objective, platforms, from, to });


    const applyFilters = () => {
        setFilters({
            objective,
            platforms,
            dateRange: from && to ? { from, to } : null
        });
        closeSidebar();
    };


    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
            <div className="w-[300px] h-full bg-white dark:bg-gray-900 dark:text-white shadow-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        Filtros
                    </h2>
                    <button onClick={closeSidebar}
                        className="cursor-pointer">
                        <X />
                    </button>
                </div>
                <label className="text-sm font-medium">Objectivo</label>
                <input
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="p-2 rounded border my-2 bg-gray-100 dark:bg-gray-800"
                />

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
                        setPlatforms(Array.from(e.target.selectedOptions, (opt) => opt.value))
                    }
                    className="p-2 rounded border my-2 bg.gray-100 dark:bg.gray-800"
                >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                </select>
                <button
                    onClick={applyFilters}
                    className="mt-auto bg-blue-500 hober:bg-blue-600 text-white p-2 rounded cursor-pointer"
                >
                    Aplicar filtros

                </button>

            </div>

        </div>

    )

}
import { useChartStore, MetricCategory } from "@/app/lib/store/useChartStore"

const metricGroups = {
    "Rendimiento": ["Resultados", "Coste por resultado", "Importe gastado"],
    "Audiencia": ["Alcance", "Alcance (acumulativo)", "Frecuencia", "Frecuencia (acumulada)"],
    "Visualizaciones": ["Impresiones", "Impresiones (acumulativas)", "CPM"],
    "Conversión": ["ROAS", "CPC", "CTR"]
}

export function ChartMetricSelector() {
    const { selectedCategory, setSelectedCategory } = useChartStore()

    return (
        <div className="w-full mb-4">
            <label htmlFor="metric-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grupo de métricas a mostrar
            </label>
            <select
                id="metric-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as MetricCategory)}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            >
                <option value="rendimiento">Rendimiento</option>
                <option value="conversion">Conversión</option>
                <option value="alcance">Audiencia</option>
            </select>
        </div>
    )
}


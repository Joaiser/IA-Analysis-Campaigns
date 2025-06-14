'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line
} from "recharts";
import { CampaignAd } from '@/app/lib/models/CampaignAd'
import { useChartStore, MetricCategory } from "@/app/lib/store/useChartStore"
import { NormalizedCampaignAd } from "@/app/lib/utils/numberHepers";

type Props = {
    campaign: CampaignAd
}

export const metricCategoryMap: Record<MetricCategory, { label: string; key: keyof NormalizedCampaignAd }[]> = {
    rendimiento: [
        { label: "Impresiones", key: "impressions" },
        { label: "Clicks", key: "clicks" },
        { label: "CPM", key: "cpm" },
    ],
    conversion: [
        { label: "CPC", key: "cpc" },
        { label: "CTR", key: "ctr" },
        { label: "ROAS", key: "roas" }, // Si lo tienes o piensas incluirlo más adelante
    ],
    alcance: [
        { label: "Alcance", key: "impressions" }, // O usa "reach" si lo incluyes
        { label: "Frecuencia", key: "ctr" }, // Este lo puedes ajustar cuando añadas "frequency"
    ],
}


export function CampaignDetailChart({ campaign }: Props) {
    const { selectedCategory } = useChartStore()
    const metrics = metricCategoryMap[selectedCategory] || []

    const dataEntry: Record<string, number | null | string> = {
        name: `Campaña: ${campaign.name}`,
    }

    metrics.forEach(({ label, key }) => {
        const rawValue = campaign[key]
        dataEntry[label] = typeof rawValue === "number"
            ? parseFloat(rawValue.toFixed(2))
            : 0
    })

    const data = [dataEntry]

    return (
        <div className="relative w-full h-64 z-10">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white p-2 rounded shadow text-xs dark:bg-gray-800 dark:text-white">
                                        {metrics.map(({ label }) => (
                                            <p key={label}>{label}: {payload[0].payload[label]}</p>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    {metrics.map(({ label }, index) => (
                        <Bar
                            key={label}
                            dataKey={label}
                            fill={index % 2 === 0 ? "#3b82f6" : "#10b981"}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
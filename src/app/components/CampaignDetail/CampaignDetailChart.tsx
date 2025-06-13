import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
}
    from "recharts";
import { CampaignAd } from '@/app/lib/models/CampaignAd'

type Props = {
    campaign: CampaignAd
}

export function CampaignDetailChart({ campaign }: Props) {
    const { name, impressions = 0, clicks = 0 } = campaign;

    const data = [{
        name: `Campaña: ${name}`,
        Impresiones: impressions,
        Clicks: clicks
    }]

    return (
        <div className="relative w-full h-64 z-10">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '14px' }} />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white p-2 rounded shadow text-xs dark:bg-gray-800 dark:text-white">
                                        <p>Impresiones: {payload[0].payload.Impresiones}</p>
                                        <p>Clicks: {payload[0].payload.Clicks}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="Impresiones" fill="#3b82f6" />
                    <Bar dataKey="Clicks" fill="#10b981" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
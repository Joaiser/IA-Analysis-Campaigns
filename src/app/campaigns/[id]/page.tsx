'use client';

import { useParams } from "next/navigation";
// import { useAIReport } from '@/app/lib/queries/useAIReport'
import { useCampaigns } from "@/app/lib/queries/useCampaign";
import { CampaignDetail } from "@/app/components/CampaignDetail/CampaignDetail"


export default function CampaignPage() {
    const { id } = useParams() as { id: string }
    const { data: campaigns, isLoading, error } = useCampaigns()
    // const {data: analysis, isLoading, error} = useAIReport(id)

    const campaign = campaigns?.find(c => c.id === id)

    if (isLoading) return <p>Cargando la campaña...</p>
    if (error) return <p>Error al cargar: {error.message}</p>
    if (!campaign) return <p>Campaña no encontrada</p>

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 rounded shadow flex justify-center content-center">
            <CampaignDetail campaign={campaign} />
            {/* {isLoading && <p className="text-blue-500"> Generando inforrme de IA...</p>} */}

            {/* {error && <p className="text-red-500">Error: {error.message}</p>} */}

            {/* {analysis && (
                <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                    {analysis}
                </pre>
            )} */}
        </div>

    )
}
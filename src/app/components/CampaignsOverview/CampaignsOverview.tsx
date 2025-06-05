// components/CampaignsOverview.tsx
'use client';

import { useCampaigns } from '@/app/lib/queries/useCampaign';
import { useCampaignStore } from '@/app/lib/store/useCampaignStore';
import { CampaignAd } from '@/app/lib/models/CampaignAd';

export const CampaignsOverview = () => {
    const { data, isLoading, isError, error } = useCampaigns() as {
        data?: CampaignAd[];
        isLoading: boolean;
        isError: boolean;
        error?: Error;
    };

    const { updatedMsg } = useCampaignStore();

    if (isLoading) return <div>Cargando campañas...</div>;
    if (isError) return <div>Error al cargar campañas: {error?.message}</div>;

    return (
        <div>
            {updatedMsg && (
                <div className="mt-2 text-green-500 dark:text-green-400 font-semibold">
                    {updatedMsg}
                </div>
            )}

            <ul className="mt-4 space-y-2 max-h-64 overflow-auto">
                {data?.map((campaign) => (
                    <li key={campaign.id} className="border p-2 rounded shadow-sm">
                        <p>
                            <strong>{campaign.name}</strong> (Estado: {campaign.status})
                        </p>
                        <p>Impresiones: {campaign.impressions ?? 0}</p>
                        <p>Clicks: {campaign.clicks ?? 0}</p>
                        <p>Gasto: ${campaign.spend?.toFixed(2) ?? '0.00'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

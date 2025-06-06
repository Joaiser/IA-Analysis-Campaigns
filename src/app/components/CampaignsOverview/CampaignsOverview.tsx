// components/CampaignsOverview.tsx
'use client';

import { useCampaigns } from '@/app/lib/queries/useCampaign';
import { useCampaignStore } from '@/app/lib/store/useCampaignStore';
import { CampaignAd } from '@/app/lib/models/CampaignAd';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';

export const CampaignsOverview = () => {
    const { data, isLoading, isError, error } = useCampaigns();

    const { updatedMsg } = useCampaignStore();

    const now = new Date();

    function getStartDate(campaign: CampaignAd): Date | null {
        const dateStr = campaign.start_time || campaign.date_start || null;
        return dateStr ? new Date(dateStr) : null;
    }

    function getStopDate(campaign: CampaignAd): Date | null {
        const dateStr = campaign.stop_time || campaign.date_stop || null;
        return dateStr ? new Date(dateStr) : null;
    }


    if (isLoading) return <div>Cargando campañas...</div>;
    if (isError) return <div>Error al cargar campañas: {error?.message}</div>;

    return (
        <div className='space-y-6 w-3xl mx:w-2xs'>
            {updatedMsg && (
                <div className="mt-2 text-green-500 dark:text-green-400 font-semibold">
                    {updatedMsg}
                </div>
            )}

            {data?.map((campaign) => {
                const startDate = getStartDate(campaign);
                const stopDate = getStopDate(campaign);

                const isFinished = stopDate && stopDate < now;
                const statusLabel = isFinished ? 'Finalizada' : campaign.status;

                const { clicks, impressions, spend, cpc, cpm, ctr } = campaign;

                return (
                    <div
                        key={campaign.id}
                        className="rounded-lg shadow-md bg-white dark:bg-gray-900 border p-4 sm:p-6 md:p-8 w-full max-w-3xl mx-auto overflow-hidden"
                    >

                        <h2 className='text-lg font-bold mb-2 dark:text-white'>
                            {campaign.name}
                        </h2>

                        <p className='text-sm dark:text-gray-300 mb-1'>
                            Estado:{' '}
                            <span className={isFinished ? 'text-red-500' : 'text-green-500'}>
                                {statusLabel}
                            </span>
                        </p>

                        {startDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Inicio: {startDate.toLocaleDateString('es-ES')}
                            </p>
                        )}
                        {stopDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Fin: {stopDate.toLocaleDateString('es-ES')}
                            </p>
                        )}

                        <div className='mb-4 dark:text-white'>
                            <p>Impresiones: {typeof impressions === 'number' ? impressions : 0}</p>
                            <p>Clicks: {typeof clicks === 'number' ? clicks : 0}</p>
                            <p>Gasto: ${typeof spend === 'number' ? spend.toFixed(2) : '0.00'}</p>
                        </div>
                        {/*Metricas calculadas */}
                        <div className='mb-4 text-sm dark:text-white space-y-1'>
                            <p title="Coste por Click - lo que pagas por cada clic en el anuncio">
                                <strong>CPC:</strong> {cpc !== null ? `$${cpc.toFixed((2))}` : 'N/A'}
                            </p>
                            <p title="Coste por Mil impresiones- lo que cuesta mostrar el anuncio mil veces">
                                <strong>CPM:</strong> {cpm !== null ? `$${cpm.toFixed(2)}` : 'N/A'}
                            </p>
                            <p title="Click through rate - porcenntaje de gente que hace clic tras ver el anuncio">
                                <strong>CTR:</strong> {ctr !== null ? `${ctr.toFixed(2)}%` : 'N/A'}
                            </p>
                        </div>

                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={[
                                        {
                                            name: 'Campaña',
                                            Impresiones: campaign.impressions ?? 0,
                                            Clicks: campaign.clicks ?? 0,
                                        },
                                    ]}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="Impresiones" fill="#3b82f6" />
                                    <Bar dataKey="Clicks" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
'use client';

import { useCampaigns } from '@/app/lib/queries/useCampaign';
import { useCampaignStore } from '@/app/lib/store/useCampaignStore';
import { useFilterStore } from '@/app/lib/store/filterStore';
import { CampaignAd } from '@/app/lib/models/CampaignAd';
import { useFilteredCampaigns } from '@/app/lib/queries/useFilteredCampaigns';
import Link from 'next/link';
import { GenerateAnalysisButton } from '../GenerateAnalysisButton/GenerateAnalysisButton';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from 'recharts';


export const CampaignsOverview = () => {
    const {
        data: allData,
        isLoading: isAllLoading,
        isError: isAllError,
        error: allError,
    } = useCampaigns();
    const {
        data: filteredData,
        isLoading: isFilteredLoading,
        isError: isFilteredError,
        error: filteredError
    } = useFilteredCampaigns();

    const { updatedMsg } = useCampaignStore();
    const { objective, dateRange, platforms } = useFilterStore();

    const now = new Date();

    // Helpers
    function getStartDate(campaign: CampaignAd): Date | null {
        const dateStr = campaign.start_time || campaign.date_start || null;
        return dateStr ? new Date(dateStr) : null;
    }

    function getStopDate(campaign: CampaignAd): Date | null {
        const dateStr = campaign.stop_time || campaign.date_stop || null;
        return dateStr ? new Date(dateStr) : null;
    }

    function isValidCampaign(campaign: CampaignAd): boolean {
        const hasStats = Number(campaign.impressions ?? 0) > 0 || Number(campaign.clicks ?? 0) > 0 || Number(campaign.spend ?? 0) > 0;
        const hasName = typeof campaign.name === 'string' && campaign.name.trim() !== '';
        const hasDates = !!getStartDate(campaign) || !!getStopDate(campaign);
        return hasStats && hasName && hasDates;
    }

    function matchesFilters(campaign: CampaignAd): boolean {
        //dpuracion de filtros
        // console.log('Filtros:', { objective, dateRange, platforms });

        //Objetivo 
        const matchesObjective = !objective || campaign.objective == objective;

        //Rango de fechas
        const campaignStart = getStartDate(campaign)
        const campaignStop = getStopDate(campaign)
        const rangeStart = dateRange?.from
        const rangeEnd = dateRange?.to
        const matchesDateRange = !rangeStart || !rangeEnd
            ? true
            : !!(campaignStart &&
                campaignStop &&
                !isNaN(new Date(rangeStart).getTime()) &&
                !isNaN(new Date(rangeEnd).getTime()) &&
                campaignStop >= new Date(rangeStart) &&
                campaignStart <= new Date(rangeEnd));


        //platafromas 
        const campaignPlatforms = campaign.targeting?.publisher_platforms ?? [];

        const matchesPlatform = platforms.length === 0 ||
            (Array.isArray(campaignPlatforms) && platforms.some(p => campaignPlatforms.includes(p)));

        //depuracion
        // console.log('Campaña:', {
        //     objective: campaign.objective,
        //     startDate: getStartDate(campaign),
        //     stopDate: getStopDate(campaign),
        //     platforms: campaign.targeting?.publisher_platforms
        // });
        //depuracion
        // console.log('Resultado matches:', matchesObjective, matchesDateRange, matchesPlatform);

        return matchesObjective && matchesDateRange && matchesPlatform
    }
    // Lógica de datos
    const isLoading = isAllLoading || isFilteredLoading;
    const isError = isAllError || isFilteredError;
    const error = allError || filteredError;
    const dataToUse = filteredData ?? allData ?? [];
    const validCampaigns = dataToUse.filter(isValidCampaign).filter(matchesFilters);



    //renderizado condicional

    if (isLoading) {
        return <p>Cargando campañas...</p>
    }

    if (isError) {
        return <p className='text-red-500'>Error {error?.message || 'Error al cargar los datos'}</p>
    }

    if (validCampaigns.length === 0) {
        return <div>No hay campañas con datos para mostrar.</div>;
    }

    return (
        <div className='space-y-6 w-3xl mx:w-2xs'>
            {updatedMsg && (
                <div className="mt-2 text-green-500 dark:text-green-400 font-semibold">
                    {updatedMsg}
                </div>
            )}

            {validCampaigns.map((campaign: CampaignAd) => {
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
                            <Link
                                href={`/campaigns/${campaign.id}`}
                                className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                                {campaign.name}
                            </Link>
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

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6 text-gray-800 dark:text-gray-100">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col justify-center items-center">
                                <p className="font-semibold text-sm">Impresiones</p>
                                <p>{typeof impressions === "number" ? impressions : 0}</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col justify-center items-center">
                                <p className="font-semibold text-sm">Clicks</p>
                                <p>{typeof clicks === "number" ? clicks : 0}</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col justify-center items-center">
                                <p className="font-semibold text-sm">Gasto</p>
                                <p>${typeof spend === "number" ? spend.toFixed(2) : "0.00"}</p>
                            </div>
                        </div>


                        <div className='mb-4 text-sm dark:text-white space-y-1'>
                            {campaign.targeting && typeof campaign.targeting === 'object' && (
                                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-800 dark:text-gray-200">
                                    <h3 className="font-semibold mb-2">Targeting:</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {campaign.targeting.age_min !== undefined && campaign.targeting.age_max !== undefined && (
                                            <li>Edad: {campaign.targeting.age_min} - {campaign.targeting.age_max} años</li>
                                        )}
                                        {(campaign.targeting.genders ?? []).length > 0 && (
                                            <li>
                                                Género: {(campaign.targeting.genders ?? []).map(g => {
                                                    if (g === 1 || g === '1') return 'Hombres';
                                                    if (g === 2 || g === '2') return 'Mujeres';
                                                    if (g === 0 || g === '0') return 'Todos';
                                                    return g;
                                                }).join(', ')}
                                            </li>
                                        )}
                                        {campaign.targeting.geo_locations && (
                                            <>
                                                {(campaign.targeting.geo_locations.countries ?? []).length > 0 && (
                                                    <li>Países: {(campaign.targeting.geo_locations.countries ?? []).join(', ')}</li>
                                                )}
                                                {(campaign.targeting.geo_locations.regions ?? []).length > 0 && (
                                                    <li>Regiones: {(campaign.targeting.geo_locations.regions ?? []).join(', ')}</li>
                                                )}
                                                {(campaign.targeting.geo_locations.cities ?? []).length > 0 && (
                                                    <li>Ciudades: {(campaign.targeting.geo_locations.cities ?? []).map((city: any) => city.name || city.key || 'desconocida').join(', ')}</li>
                                                )}
                                            </>
                                        )}
                                        {(campaign.targeting.publisher_platforms ?? []).length > 0 && (
                                            <li>Plataformas: {(campaign.targeting.publisher_platforms ?? []).join(', ')}</li>
                                        )}
                                        {(campaign.targeting.facebook_positions ?? []).length > 0 && (
                                            <li>Posiciones Facebook: {(campaign.targeting.facebook_positions ?? []).join(', ')}</li>
                                        )}
                                        {(campaign.targeting.instagram_positions ?? []).length > 0 && (
                                            <li>Posiciones Instagram: {(campaign.targeting.instagram_positions ?? []).join(', ')}</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-800 dark:text-gray-100 my-4">
                                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 flex items-center justify-center">
                                    <p className="font-semibold mr-5" title="Coste por clic">CPC</p>
                                    <p title={typeof cpc === "number" ? `${cpc.toFixed(4)}€` : "N/A"}>
                                        {typeof cpc === "number" ? `${cpc.toFixed(2)}€` : "N/A"}
                                    </p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 flex items-center justify-center">
                                    <p className="font-semibold mr-5" title="Coste por mil impresiones">CPM</p>
                                    <p title={typeof cpm === "number" ? `${cpm.toFixed(4)}€` : "N/A"}>
                                        {typeof cpm === "number" ? `${cpm.toFixed(2)}€` : "N/A"}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6 flex items-center justify-center">
                                    <p className="font-semibold mr-5" title="Porcentaje de clics por impresión">CTR</p>
                                    <p title={typeof ctr === "number" ? `${ctr.toFixed(4)}%` : "N/A"}>
                                        {typeof ctr === "number" ? `${ctr.toFixed(2)}%` : "N/A"}
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={[{
                                        name: 'Campaña: ' + campaign.name,
                                        Impresiones: impressions ?? 0,
                                        Clicks: clicks ?? 0,
                                    }]}
                                >
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
                        <GenerateAnalysisButton campaignId={campaign.id} />
                    </div>
                );
            })}
        </div>
    );
};
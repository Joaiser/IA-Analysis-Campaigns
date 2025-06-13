import { CampaignAd } from "@/app/lib/models/CampaignAd"
import { CampaignDetailChart } from "@/app/components/CampaignDetail/CampaignDetailChart";

type Props = {
    campaign: CampaignAd
}

export function CampaignDetail({ campaign }: Props) {
    const {
        id,
        name,
        status,
        start_time,
        stop_time,
        impressions,
        clicks,
        spend,
        cpc,
        cpm,
        ctr,
        objective,
        targeting
    } = campaign

    const startDate = start_time ? new Date(start_time) : null
    const stopDate = stop_time ? new Date(stop_time) : null
    const isFinished = stopDate ? stopDate.getTime() < Date.now() : false
    const statusLabel = isFinished ? "Finalizada" : "Activa"

    return (
        <>
            <div
                key={id}
                className="rounded-2xl shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 sm:p-8 w-full max-w-3xl flex flex-col justify-center items-center"
            >
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{name}</h2>

                <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    <span className="text-gray-700 dark:text-gray-300">
                        Estado:
                        <span className={`ml-1 font-semibold ${isFinished ? 'text-red-500' : 'text-green-500'}`}>
                            {statusLabel}
                        </span>
                    </span>
                    {startDate && (
                        <span className="text-gray-500 dark:text-gray-400">
                            Inicio: {startDate.toLocaleDateString("es-ES")}
                        </span>
                    )}
                    {stopDate && (
                        <span className="text-gray-500 dark:text-gray-400">
                            Fin: {stopDate.toLocaleDateString("es-ES")}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6 text-gray-800 dark:text-gray-100">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 flex flex-col justify-center items-center">
                        <p className="font-semibold text-sm px-8">Impresiones</p>
                        <p>{typeof impressions === "number" ? impressions : 0}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col justify-center items-center">
                        <p className="font-semibold text-sm px-8">Clicks</p>
                        <p>{typeof clicks === "number" ? clicks : 0}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col justify-center items-center">
                        <p className="font-semibold text-sm px-8">Gasto</p>
                        <p>${typeof spend === "number" ? spend.toFixed(2) : "0.00"}</p>
                    </div>
                </div>


                {targeting && typeof targeting === "object" && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-base text-gray-700 dark:text-gray-200 mb-2">🎯 Segmentación:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {targeting.age_min !== undefined && targeting.age_max !== undefined && (
                                <li>Edad: {targeting.age_min} - {targeting.age_max} años</li>
                            )}

                            {(targeting.genders ?? []).length > 0 && (
                                <li>
                                    Género: {(targeting.genders ?? []).map(g => {
                                        if (g === 1 || g === '1') return 'Hombres';
                                        if (g === 2 || g === '2') return 'Mujeres';
                                        if (g === 0 || g === '0') return 'Todos';
                                        return g;
                                    }).join(', ')}
                                </li>
                            )}

                            {targeting.geo_locations && (
                                <>
                                    {(targeting.geo_locations.countries ?? []).length > 0 && (
                                        <li>Países: {targeting.geo_locations.countries.join(', ')}</li>
                                    )}
                                    {(targeting.geo_locations.regions ?? []).length > 0 && (
                                        <li>Regiones: {targeting.geo_locations.regions.join(', ')}</li>
                                    )}
                                    {(targeting.geo_locations.cities ?? []).length > 0 && (
                                        <li>Ciudades: {(targeting.geo_locations.cities ?? []).map((city: any) => city.name || city.key || 'Desconocida').join(', ')}</li>
                                    )}
                                </>
                            )}

                            {(targeting.publisher_platforms ?? []).length > 0 && (
                                <li>Plataformas: {targeting.publisher_platforms.join(', ')}</li>
                            )}

                            {(targeting.facebook_positions ?? []).length > 0 && (
                                <li>Posiciones Facebook: {targeting.facebook_positions.join(', ')}</li>
                            )}

                            {(targeting.instagram_positions ?? []).length > 0 && (
                                <li>Posiciones Instagram: {targeting.instagram_positions.join(', ')}</li>
                            )}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-800 dark:text-gray-100 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 flex items-center justify-center">
                        <p className="font-semibold mr-5" title="Coste por clic">CPC</p>
                        <p title={typeof cpc === "number" ? `$${cpc.toFixed(4)}` : "N/A"}>
                            {typeof cpc === "number" ? `$${cpc.toFixed(2)}` : "N/A"}
                        </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 flex items-center justify-center">
                        <p className="font-semibold mr-5" title="Coste por mil impresiones">CPM</p>
                        <p title={typeof cpm === "number" ? `$${cpm.toFixed(4)}` : "N/A"}>
                            {typeof cpm === "number" ? `$${cpm.toFixed(2)}` : "N/A"}
                        </p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6 flex items-center justify-center">
                        <p className="font-semibold mr-5" title="Porcentaje de clics por impresión">CTR</p>
                        <p title={typeof ctr === "number" ? `${ctr.toFixed(4)}%` : "N/A"}>
                            {typeof ctr === "number" ? `${ctr.toFixed(2)}%` : "N/A"}
                        </p>
                    </div>
                </div>


                <div className="mt-8 relative w-full h-64 z-50">
                    <CampaignDetailChart campaign={campaign} />
                </div>
            </div>
        </>
    )
}

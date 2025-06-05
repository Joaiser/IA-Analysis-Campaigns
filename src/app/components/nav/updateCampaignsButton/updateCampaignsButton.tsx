'use client'

import { RefreshCw } from 'lucide-react';
import { useUpdateCampaigns } from '@/app/lib/queries/useUpdateCampaigns';
import { useCampaignStore } from '@/app/lib/store/useCampaignStore';

export const CampaignList = () => {
    const { mutate: updateCampaigns } = useUpdateCampaigns();
    const { isUpdating, setIsUpdating, setUpdatedMsg } = useCampaignStore();

    const handleUpdate = () => {
        setIsUpdating(true);
        updateCampaigns(undefined, {
            onSuccess: () => {
                setUpdatedMsg('Campañas actualizadas correctamente 🚀');
                setIsUpdating(false);
                setTimeout(() => setUpdatedMsg(null), 3000);
            },
            onError: () => {
                setUpdatedMsg('Error al actualizar campañas ⚠️');
                setIsUpdating(false);
                setTimeout(() => setUpdatedMsg(null), 3000);
            },
        });
    };

    return (
        <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className={`btn btn-primary flex items-center gap-2
        ${isUpdating ? 'cursor-wait' : 'cursor-pointer hover:bg-blue-700'}
        transition-colors duration-300`}
            title="Actualizar campañas"
        >
            <RefreshCw
                size={16}
                className={`transition-transform duration-500 ${isUpdating ? 'animate-spin' : 'hover:rotate-90'
                    }`}
            />
            {isUpdating ? 'Actualizando...' : 'Actualizar Campañas'}
        </button>
    );
};


'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateCampaigns = () => {
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/update-campaigns',)
            if (!res.ok) {
                throw new Error('Error al actualizar las campañas');
            }
            const data = await res.json();
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
        onError: (error: Error) => {
            console.error('Error al actualizar las campañas:', error);
        }
    });
}
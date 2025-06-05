//ARCHIVO PARA CONSULTAS DE CAMPAÑA USANDO REACT QUERY
'use client';
import { useQuery } from '@tanstack/react-query';

export const useCampaigns = () => {
    return useQuery({
        queryKey: ['campaigns'],
        queryFn: async () => {
            const res = await fetch('/api/get-campaigns');
            if (!res.ok) {
                throw new Error('Error al obtener las campañas');
            }
            const data = await res.json();
            return data;
        }
    });
}
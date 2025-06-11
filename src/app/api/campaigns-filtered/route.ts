// app/api/campaigns-filtered/route.ts
import { NextResponse } from "next/server";
import { getFilterredCampaignAds } from "@/app/lib/models/CampaignAd";

export const dynamic = 'force-dynamic'; // Importante para filtros dinámicos

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Convertir parámetros a formato correcto
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        // Validación de fechas
        if (from && isNaN(new Date(from).getTime())) {
            return NextResponse.json(
                { message: 'Fecha "from" inválida' },
                { status: 400 }
            );
        }

        if (to && isNaN(new Date(to).getTime())) {
            return NextResponse.json(
                { message: 'Fecha "to" inválida' },
                { status: 400 }
            );
        }

        // Construir objeto de filtros
        const filters = {
            objective: searchParams.get('objective') || undefined,
            platforms: searchParams.getAll('platforms').filter(p => p),
            from: from || undefined,
            to: to || undefined
        };

        const filteredCampaigns = await getFilterredCampaignAds(filters);

        return NextResponse.json(filteredCampaigns, { status: 200 });

    } catch (error) {
        console.error("Error en GET /api/campaigns-filtered:", error);
        return NextResponse.json(
            {
                message: 'Error al obtener campañas filtradas',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        );
    }
}
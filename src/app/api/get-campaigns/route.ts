import { NextResponse } from "next/server";
import { getAllCampaignAds } from "@/app/lib/models/CampaignAd";

export async function GET() {
    try {
        const campaigns = await getAllCampaignAds();
        return NextResponse.json(campaigns, { status: 200 });
    } catch (error) {
        console.error("Error al obtener campañas:", error);
        return NextResponse.json(
            { message: 'Error al obtener campañas', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );

    }
}
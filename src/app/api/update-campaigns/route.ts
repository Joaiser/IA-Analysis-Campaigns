//Va a insertar en mongoDB los datos que reciben de models/campaingAd.ts

import { NextResponse } from "next/server";
import { upsertCampaignAd } from "@/app/lib/models/CampaignAd";


//
// PODEMOS VALIDAR AQUI CON ZOD
//

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN!;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID!;

const AD_FIELDS = [
    'id',
    'name',
    'status',
    'effective_status',
    'campaign_id',
    'insights.date_preset(maximum){impressions,clicks,spend,date_start,date_stop}',
    'targeting',
    'objective'
].join(',');





export async function GET() {
    try {
        const url = `https://graph.facebook.com/v19.0/${AD_ACCOUNT_ID}/ads?fields=${AD_FIELDS},adset_id&access_token=${ACCESS_TOKEN}`;
        const response = await fetch(url);
        const result = await response.json();
        let campaignObjective = null;

        if (!result.data) {
            return NextResponse.json(
                { message: 'Error al obtener datos de Meta', details: result },
                { status: 404 }
            );
        }

        for (const ad of result.data) {
            const insights = ad.insights?.data?.[0];

            let campaignStartTime = "";
            let campaignStopTime = "";

            if (ad.adset_id) {
                const adsetUrl = `https://graph.facebook.com/v19.0/${ad.adset_id}?fields=start_time,end_time&access_token=${ACCESS_TOKEN}`;
                const adsetRes = await fetch(adsetUrl);
                const adsetData = await adsetRes.json();
                campaignStartTime = adsetData.start_time || "";
                campaignStopTime = adsetData.end_time || "";
            }

            if (ad.campaign_id) {
                const campaignUrl = `https://graph.facebook.com/v19.0/${ad.campaign_id}?fields=objective&access_token=${ACCESS_TOKEN}`;
                const campaignRes = await fetch(campaignUrl);
                const campaignData = await campaignRes.json();
                campaignObjective = campaignData.objective || null;
            }

            const campaign = {
                id: ad.id,
                name: ad.name,
                status: ad.status,
                effective_status: ad.effective_status,
                start_time: campaignStartTime,
                stop_time: campaignStopTime,
                impressions: insights?.impressions || 0,
                clicks: insights?.clicks ? parseInt(insights.clicks) : 0,
                spend: insights?.spend ? parseFloat(insights.spend) : 0,
                date_start: insights?.date_start || null,
                date_stop: insights?.date_stop || null,
                targeting: ad.targeting || null,
                objective: campaignObjective
            };

            await upsertCampaignAd(campaign);
        }

        return NextResponse.json({ message: 'Campañas actualizadas correctamente' });
    } catch (error) {
        console.error('Error al actualizar campañas:', error);
        return NextResponse.json(
            {
                message: 'Error al actualizar campañas',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

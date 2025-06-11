import { CampaignAd } from "@/app/lib/models/CampaignAd";

export interface NormalizedCampaignAd extends Omit<CampaignAd, 'clicks' | 'impressions' | 'spend' | 'cpc' | 'cpm' | 'ctr'> {
    clicks: number;
    impressions: number;
    spend: number;
    cpc: number | null;
    cpm: number | null;
    ctr: number | null;
}

// Convierte string o number a número seguro, fallback 0
export function toNumberSafe(value: string | number | undefined | null): number {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'number') return value;
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
}

// Convierte cualquier valor a Date o null
export function safeParseDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
}

// Solo parsea campos fecha
export function parseCampaignDates(campaign: CampaignAd): CampaignAd {
    return {
        ...campaign,
        start_time: safeParseDate(campaign.start_time),
        stop_time: safeParseDate(campaign.stop_time),
        date_start: safeParseDate(campaign.date_start),
        date_stop: safeParseDate(campaign.date_stop),
        insights_date_start: safeParseDate(campaign.insights_date_start),
        insights_date_stop: safeParseDate(campaign.insights_date_stop),
    };
}

// Normaliza los números y calcula métricas
export function normalizeCampaign(campaign: CampaignAd): NormalizedCampaignAd {
    const clicks = toNumberSafe(campaign.clicks);
    const impressions = toNumberSafe(campaign.impressions);
    const spend = toNumberSafe(campaign.spend);

    return {
        ...campaign,
        clicks,
        impressions,
        spend,
        cpc: clicks > 0 ? spend / clicks : null,
        cpm: impressions > 0 ? (spend / impressions) * 1000 : null,
        ctr: impressions > 0 ? (clicks / impressions) * 100 : null,
    };
}

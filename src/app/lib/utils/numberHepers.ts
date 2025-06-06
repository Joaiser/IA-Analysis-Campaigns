import { CampaignAd } from "@/app/lib/models/CampaignAd";

export interface NormalizedCampaignAd extends CampaignAd {
    clicks: number;
    impressions: number;
    spend: number;
    cpc: number | null;
    cpm: number | null;
    ctr: number | null;
}

export function toNumberSafe(value: string | number | undefined | null): number {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'number') return value;
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
}

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

import clientPromise from "../mongodb";
import { WithId, Document } from 'mongodb';
import { normalizeCampaign, parseCampaignDates } from "@/app/lib/utils/numberHepers";


export interface Targeting {
    age_min?: number;
    age_max?: number;
    genders?: (number | string)[];
    geo_locations?: {
        countries?: string[];
        regions?: string[];
        cities?: string[];
    };
    publisher_platforms?: string[];
    facebook_positions?: string[];
    instagram_positions?: string[];
    device_platforms?: string[];
}

export interface CampaignAd {
    id: string;
    name: string;
    status: string;
    effective_status: string;

    start_time?: string | number | Date | null;
    stop_time?: string | number | Date | null;
    date_start?: string | number | Date | null;
    date_stop?: string | number | Date | null;
    insights_date_start?: string | number | Date | null;
    insights_date_stop?: string | number | Date | null;

    impressions?: number | string;
    clicks?: number | string;
    spend?: number | string;
    cpc?: number | string;
    cpm?: number | string;
    ctr?: number | string;


    objective?: string;

    targeting?: Targeting;
    custom_locations?: any[];
    custom_audiences?: any[];
    interests?: { id: string; name: string }[];
    targeting_automation?: {
        advantage_audience?: number;
        [key: string]: any;
    };

    publisher_platforms?: string[];
    facebook_positions?: string[];
    instagram_positions?: string[];
    device_platforms?: string[];
}

export interface FilterParams {
    objective?: string | null;
    from?: string | null;
    to?: string | null;
    platforms?: string[];
}




const COLLECTION_NAME = 'campaign_ads';


export async function getAllCampaignAds(): Promise<WithId<Document>[]> {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection(COLLECTION_NAME);
    return collection.find({}).toArray();

}


export async function upsertCampaignAd(ad: CampaignAd): Promise<void> {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection(COLLECTION_NAME);

    const sanitized = parseCampaignDates(ad);
    const normalized = normalizeCampaign(sanitized);

    await collection.updateOne(
        { id: ad.id },
        { $set: normalized },
        { upsert: true }
    );
}



export async function getFilterredCampaignAds(filters: FilterParams) {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<CampaignAd>(COLLECTION_NAME);

    const andConditions: any[] = [];

    if (filters.objective) {
        andConditions.push({ objective: filters.objective });
    }

    if (filters.from && filters.to) {
        andConditions.push({
            $or: [
                {
                    $and: [
                        { date_start: { $gte: new Date(filters.from) } },
                        { date_start: { $lte: new Date(filters.to) } }
                    ]
                },
                {
                    $and: [
                        { start_time: { $gte: new Date(filters.from) } },
                        { start_time: { $lte: new Date(filters.to) } }
                    ]
                }
            ]
        });
    }

    if (filters.platforms && filters.platforms.length > 0) {
        andConditions.push({
            'targeting.publisher_platforms': {
                $in: filters.platforms.map(p => p.toLowerCase())
            }
        });
    }

    andConditions.push({
        $or: [
            { impressions: { $gt: 0 } },
            { clicks: { $gt: 0 } },
            { spend: { $gt: 0 } }
        ]
    });

    andConditions.push({ name: { $exists: true, $ne: "" } });

    andConditions.push({
        $or: [
            { date_start: { $exists: true } },
            { start_time: { $exists: true } }
        ]
    });

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    console.log("🧠 Query final:", JSON.stringify(query, null, 2));

    return collection.find(query).toArray();
}

import clientPromise from "../mongodb";
import { WithId, Document } from 'mongodb';

export interface CampaignAd {
    id: string;
    name: string;
    status: string;
    effective_status: string;
    start_time?: string;
    stop_time?: string;
    campaign_start_time?: string;
    campaign_stop_time?: string;
    date_start?: string;
    date_stop?: string;
    insights_date_start?: string;
    insights_date_stop?: string;

    impressions?: number | string;
    clicks?: number | string;
    spend?: number | string;

    targeting?: {
        age_min?: number;
        age_max?: number;
        age_range?: number[]; // Array de 2 números
        genders?: (string | number)[]; // viene como Array(1) con números tipo 2 o 0
        geo_locations?: {
            countries?: string[];
            regions?: string[];
            cities?: string[];
        };
        custom_locations?: any[];
        location_types?: string[];
        custom_audiences?: any[];
        interests?: { id: string; name: string }[];
        targeting_automation?: {
            advantage_audience?: number;
            [key: string]: any;
        };
    };

    publisher_platforms?: string[];
    facebook_positions?: string[];
    instagram_positions?: string[];
    device_platforms?: string[];
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

    await collection.updateOne(
        { id: ad.id },
        { $set: ad },
        { upsert: true }
    )
}

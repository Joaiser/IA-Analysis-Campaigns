import clientPromise from "../mongodb";
import { WithId, Document } from 'mongodb';

export interface CampaignAd {
    id: string;
    name: string;
    status: string;
    effective_status: string;
    start_time: string;
    impressions?: number;
    clicks?: number;
    spend?: number;
    date_start?: string;
    date_stop?: string;

    targeting?: {
        age_min?: number;
        age_max?: number;
        genders?: string[];
        geo_locations?: {
            countries?: string[];
            regions?: string[];
            cities?: string[];
        };
        interests?: { id: string; name: string }[];
    };


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

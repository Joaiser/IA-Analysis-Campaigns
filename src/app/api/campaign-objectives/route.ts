import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
// import { objectiveLabels } from '@/app/lib/utils/constants/objectiveLabels';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("campaign_ads");

        const objectives = await collection.distinct("objective", { objective: { $exists: true, $ne: null } });

        const clean = objectives
            .filter(Boolean)
            .map(String)
            .map((obj: string) => obj.trim())
            .sort();

        const response = clean.map((key) => ({
            value: key,
            label: key
        }))

        return NextResponse.json(response);

    } catch (error) {
        console.error("Error al obtener los objetivos únicos:", error);
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}

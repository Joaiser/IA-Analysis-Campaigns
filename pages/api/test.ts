import { clientPromise, dbName } from "@/app/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;

        const db = client.db(dbName);

        // Obtenemos las colecciones
        const collections = await db.listCollections().toArray();

        res.status(200).json({ success: true, collections });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: "Error connecting to MongoDB", error: errorMessage });
    }
}

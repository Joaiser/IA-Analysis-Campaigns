import clientPromise from "@/app/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db(); // Usamos la base de datos predeterminada
        const collections = await db.listCollections().toArray(); // Obtenemos las colecciones de la base de datos

        // Si la conexión es exitosa, respondemos con el nombre de las colecciones
        res.status(200).json({ success: true, collections });
    } catch (error) {
        // Si hay un error en la conexión, respondemos con el error
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: "Error connecting to MongoDB", error: errorMessage });
    }
}

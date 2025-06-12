import { ObjectId } from "mongodb";
import { clientPromise, dbName } from "@/app/lib/mongodb";

export interface AiReport {
    _id?: ObjectId;
    campaignId: string; // ID de la campaña a la que pertenece
    generatedAt: Date;
    analysis: string; // texto generado por GPT
    keywords?: string[]; // opcional, palabras clave que extrae
    summary?: string; // resumen breve si lo quieres aparte
    insights?: string[]; // bullets de ideas concretas
    modelUsed: string; // modelo de IA (ej: gpt-4)
}

export async function saveAiReport(report: AiReport) {
    const client = await clientPromise;

    const db = client.db(dbName);
    const result = await db.collection<AiReport>("ai_reports").insertOne({
        ...report,
        generatedAt: new Date(),
    })

    return result.insertedId;
}
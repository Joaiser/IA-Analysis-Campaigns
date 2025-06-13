import { NextResponse } from 'next/server';
import { clientPromise, dbName } from "@/app/lib/mongodb";
// import { objectiveLabels } from '@/app/lib/utils/constants/objectiveLabels';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(dbName);
        // console.log("DB usada:", db.databaseName);
        const collections = await db.listCollections().toArray();
        // console.log("Colecciones:", collections.map(c => c.name));

        const collection = db.collection("ia-analisys-campaigns");

        const sampleDocs = await collection.find({}).limit(3).toArray();
        // console.log("Ejemplo docs:", sampleDocs);

        const objectives = await collection.find({ objective: { $exists: true, $ne: null } }).toArray();
        // console.log("Objectives field values:", objectives.map(d => d.objective));

        // Mapear y limpiar
        const clean = objectives
            .map(d => String(d.objective).trim())
            .filter(Boolean)
            .sort();

        // Eliminar duplicados
        const unique = [...new Set(clean)];

        const response = unique.map(key => ({ value: key, label: key }));
        // console.log("Response final:", response);

        return NextResponse.json(response);

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}

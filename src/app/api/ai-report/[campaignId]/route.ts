import { NextResponse } from "next/server";
import { clientPromise, dbName } from "@/app/lib/mongodb";
import { AiReport } from "@/app/lib/models/aiReports";
import OpenAi from "openai"
import { saveAiReport } from "@/app/lib/models/aiReports";


const openai = new OpenAi({
    apiKey: process.env.OPEN_API_KEY,
})

//Función auxilar para extraer y formatear las claves utiles del targeting
function formatTargeting(targeting: any): string {
    if (!targeting) return "No disponible";

    const {
        age_min,
        age_max,
        genders,
        geo_locations,
        publisher_platforms,
        facebook_positions,
        instagram_positions,
        device_platforms,
        targeting_automation
    } = targeting;

    //mapeo de géneros
    const genderMap: Record<number, string> = {
        0: "mujeres",
        1: "hombres",
        2: "todos los generos"
    }

    const formattedGenders = genders?.map((g: number) => genderMap[g] || `desconocido (${g}`).join(", ") || "No especificado"

    const locations = geo_locations?.countries?.join(", ") ||
        geo_locations?.regions?.map((r: any) => r.name).join(", ") ||
        geo_locations?.cities?.map((c: any) => c.name).join(", ") ||
        "No especificadas";

    const locationTypes = geo_locations?.location_types?.join(", ") || "N/A";

    const automation = targeting_automation?.advantage_audience === 1
        ? "Se usó Advantage+ Audience para optimizar automáticamente la segmentación."
        : "No se usó automatización de audiencia.";

    return `
 Segmentación (Targeting):
- Rango de edad: ${age_min} - ${age_max}
- Géneros: ${formattedGenders}
- Ubicaciones geográficas: ${locations} (tipo: ${locationTypes})
- Plataformas donde se publicó: ${publisher_platforms?.join(", ") || "N/A"}
- Posiciones en Facebook: ${facebook_positions?.join(", ") || "N/A"}
- Posiciones en Instagram: ${instagram_positions?.join(", ") || "N/A"}
- Dispositivos objetivo: ${device_platforms?.join(", ") || "N/A"}
- Automatización: ${automation}
  `.trim();
}


export async function POST(req: Request, { params }: { params: { campaignId: string } }) {
    const { campaignId } = params;

    try {
        const client = await clientPromise
        const db = client.db(dbName)

        //1. Verificar si ya hay un analisis guardado
        const existing = await db.collection<AiReport>("ai_reports").findOne({ campaignId })
        if (existing) return NextResponse.json({ message: "Ya existe un informe para esta campaña" }, { status: 400 })

        //2. Saca datos relevantes de la campaña
        const campaign = await db.collection("ia_analysis_campaigns").findOne({ id: campaignId })
        if (!campaign) return NextResponse.json({ message: 'no se encontraron campañas' }, { status: 400 })

        const targetInfo = formatTargeting(campaign.targeting)

        //3. Monta el prompt para GPT
        const prompt = `
        Eres un analista de campañas de marketing. Tienes que hacer informes 
        campañas de marketing para tu jefe detallados. Los datos de la campaña:
        Nombre: ${campaign.name}
        Objetivo: ${campaign.objective}
        Impresiones: ${campaign.impressions}
        Clicks: ${campaign.clicks}
        CPC: ${campaign.cpc}
        CPM:${campaign.cpm}
        CTR: ${campaign.ctr}
        Fecha de inicio: ${campaign.start_time}
        Fecha de fin: ${campaign.stop_time}
        Gasto: ${campaign.spend}
        Targeting: ${targetInfo}
        Dame un análisis claro sobre esta campaña, bien estructurado`;

        //4. Llama a la API de OPENAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        })

        const analysis = completion.choices[0]?.message?.content || "No se pudo generar análisis.";

        //5. Guardar el analisis
        const newReport: AiReport = {
            campaignId,
            generatedAt: new Date(),
            analysis,
            modelUsed: "gpt-4o-mini",
        };

        await saveAiReport(newReport)

        //6. Devuelve el analisis
        // return NextResponse.json({ newReport, cached: false })
        return new Response(JSON.stringify({ report: 'Simulación de reporte AI' }), { status: 200 })
    } catch (error) {
        console.error("Error generando análisis GPT:", error);
        return NextResponse.json({ message: "Error interno generando análisis" }, { status: 500 });
    }
}

//verificar si hay un informe generado en a bd
export async function GET(req: Request, { params }: { params: { campaignId: string } }) {

    const { campaignId } = params

    try {
        const client = await clientPromise
        const db = client.db(dbName)

        const existing = await db.collection<AiReport>("ai_reports").findOne({ campaignId })

        if (!existing) return NextResponse.json({ found: false })

        return NextResponse.json({ found: true, report: existing })
    } catch (error) {
        console.error("Error comprobando informe GPT:", error)
        return NextResponse.json({ message: "Error interno" }, { status: 500 })
    }
}
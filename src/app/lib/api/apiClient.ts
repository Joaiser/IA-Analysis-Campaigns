const API_URL = process.env.NEXT_PUBLIC_URL || ''


type ObjectiveItem = {
    value: string;
    label: string;
};


export async function fetchCampaignObjectives(): Promise<ObjectiveItem[]> {
    const res = await fetch(`${API_URL}/api/campaign-objectives`)
    if (!res.ok) throw new Error("Error al cargar los objetivos")

    // console.log("Llamando a:", `${API_URL}/api/campaign-objectives`);

    return res.json()
}
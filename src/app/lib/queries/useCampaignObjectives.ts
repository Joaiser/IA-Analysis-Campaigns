import { useQuery } from "@tanstack/react-query";


type ObjectiveItem = {
    value: string;
    label: string;
};

export async function fetchObjectivesFromDB(): Promise<ObjectiveItem[]> {
    const res = await fetch("api/campaign-objectives");
    // console.log(res.status, await res.text)
    if (!res.ok) {
        throw new Error("Error al cargar los objetivos");
    }
    return res.json();
}


export const useCampaignObjectives = () => {
    return useQuery({
        queryKey: ["campaign-objectives"],
        queryFn: fetchObjectivesFromDB
    })
}
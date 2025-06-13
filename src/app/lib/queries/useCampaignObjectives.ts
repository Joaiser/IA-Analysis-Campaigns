import { useQuery } from "@tanstack/react-query";
import { fetchCampaignObjectives } from "@/app/lib/api/apiClient";

export const useCampaignObjectives = () => {
    return useQuery({
        queryKey: ["campaign-objectives"],
        queryFn: fetchCampaignObjectives
    })
}
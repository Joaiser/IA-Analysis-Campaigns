import { create } from "zustand"
import { AiReport } from "@/app/lib/models/aiReports"

interface AiReportState {
    reports: Record<string, AiReport>;
    setReport: (campaignId: string, report: AiReport) => void;
    clearReport: () => void;
}

export const useAiReportStore = create<AiReportState>((set) => ({
    reports: {},
    setReport: (campaignId, report) => set((state) => ({
        reports: { ...state.reports, [campaignId]: report }
    })),
    clearReport: () => set({ reports: {} }),
}));

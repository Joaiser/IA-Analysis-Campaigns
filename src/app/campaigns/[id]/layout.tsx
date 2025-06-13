import React from "react";
import { Nav } from "@/app/components/nav/Nav";
import { FilterSidebar } from "@/app/components/sidebar/FilterSidebar";


export default function CampaignLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <FilterSidebar />
            <div className="flex-1 flex flex-col">
                <Nav />
                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

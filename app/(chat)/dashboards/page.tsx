"use client"

import DynamicChart from "@components/custom/DynamicChart";

const chartConfig = {
    type: "bar",
    xKey: "month",
    yKeys: [
        { dataKey: "desktop", label: "Desktop", color: "#2563eb" },
        { dataKey: "mobile", label: "Mobile", color: "#60a5fa" }
    ],
    data: [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 }
    ], title: 's', description: 'dd'
};

export default function Chat() {
    return (
        <div className="flex-grow flex p-14 justify-center items-center">
            <DynamicChart loading={false} config={chartConfig} />
        </div>
    );
}

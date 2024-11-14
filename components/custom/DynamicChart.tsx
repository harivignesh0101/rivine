"use client";

import {Bar, BarChart, CartesianGrid, XAxis, Legend, PieChart, Pie, Cell} from "recharts";
import PropTypes from "prop-types";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {Skeleton} from "@components/ui/skeleton";

// @ts-expect-error - wrong data in config
function DynamicChart({ config, loading }) {
    const { type, xKey, yKeys, data, title, description } = config;
    if (!loading) {
        if (type === "bar") {
            return (
                <div className="flex w-full">
                    <Card>
                        <CardHeader>
                            {/*<CardTitle>{title}</CardTitle>*/}
                            {/*<CardDescription>{description}</CardDescription>*/}
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={yKeys.reduce((acc: any, yKey: any) => {
                                acc[yKey.dataKey] = {label: yKey.label, color: yKey.color};
                                return acc;
                            }, {})}>
                                <BarChart width={600} height={300} data={data}>
                                    <CartesianGrid vertical={false}/>
                                    <XAxis
                                        dataKey={xKey}
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dashed"/>}
                                    />
                                    <Legend/>
                                    {yKeys.map((yKey: any) => (
                                        <Bar
                                            key={yKey.dataKey}
                                            dataKey={yKey.dataKey}
                                            name={yKey.label}
                                            fill={yKey.color}
                                            radius={4}
                                        />
                                    ))}
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                            <div className="flex gap-2 font-medium leading-none">
                                {title}
                            </div>
                            {description && (
                                <div className="leading-none text-muted-foreground">
                                    {description}
                                </div>
                            )}

                        </CardFooter>
                    </Card>
                </div>
            );
        } else if (type === "pie") { // not working properly
            return (
                <div className="flex w-full">
                    <Card>
                        <CardHeader>
                            {/*<CardTitle>{title}</CardTitle>*/}
                            {/*<CardDescription>{description}</CardDescription>*/}
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={yKeys.reduce((acc: any, yKey: any) => {
                                acc[yKey.dataKey] = { label: yKey.label, color: yKey.color };
                                return acc;
                            }, {})}>
                                <PieChart width={400} height={300}>
                                    <Pie
                                        data={data}
                                        dataKey={yKeys[0].dataKey} // Assuming a single dataKey for Pie
                                        nameKey={xKey}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill={yKeys[0].color}
                                        label={(entry) => entry.name}
                                    >
                                        {data.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={yKeys.find((y: any) => y.dataKey === entry[yKeys[0].dataKey])?.color || '#8884d8'}
                                            />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dashed" />}
                                    />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                            <div className="flex gap-2 font-medium leading-none">
                                {title}
                            </div>
                            {description && (
                                <div className="leading-none text-muted-foreground">
                                    {description}
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            );
        }


        return <p>Chart type {type} is not supported.</p>;
    } else {
        return (
            <div className="flex w-full">
                <Card>
                    <CardHeader>
                        {/*<CardTitle>{title}</CardTitle>*/}
                        {/*<CardDescription>{description}</CardDescription>*/}
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-3">
                            <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]"/>
                                <Skeleton className="h-4 w-[200px]"/>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            {title}
                        </div>
                        {description && (
                            <div className="leading-none text-muted-foreground">
                                {description}
                            </div>
                        )}

                    </CardFooter>
                </Card>
            </div>
        )
    }
}

DynamicChart.propTypes = {
    config: PropTypes.shape({
        type: PropTypes.string.isRequired,
        xKey: PropTypes.string.isRequired,
        yKeys: PropTypes.arrayOf(
            PropTypes.shape({
                dataKey: PropTypes.string.isRequired,
                label: PropTypes.string,
                color: PropTypes.string,
            })
        ).isRequired,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
};

export default DynamicChart;


const barChart = {
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
    ],
    title: "bar"
}; // bar chart sample

import {streamObject, streamText} from "ai";
import { google } from '@ai-sdk/google';
import { getAuth } from '@clerk/nextjs/server';
import {NextRequest} from "next/server";
import {z} from "zod";

export async function POST(req: NextRequest) {
    const { messages } = await req.json();
    const { userId } = getAuth(req);

    // Validate the messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: 'Messages array is required and cannot be empty' }), { status: 400 });
    }

    // Extract the user message from the structured messages array
    const userMessage = messages.find(msg => msg.role === 'user')?.content;
    if (!userMessage) {
        return new Response(JSON.stringify({ error: 'User message is required' }), { status: 400 });
    }

    try {
        const result = await streamText({
            model: google('models/gemini-1.5-flash-latest'),
            system: 'You are a helpful assistant.',
            messages,
            tools: {
                getWeather: {
                    description: 'Get the current weather at a location',
                    parameters: z.object({
                        latitude: z.number(),
                        longitude: z.number(),
                    }),
                    execute: async ({latitude, longitude}) => {
                        const response = await fetch(
                            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
                        );

                        const weatherData = await response.json();
                        return weatherData;
                    },
                },
                getChart: {
                    description: 'Generate an AI-powered chart based on the input data and question. Only "bar" chart is available as of now',
                    parameters: z.object({
                        question: z
                            .string()
                            .describe('The question or prompt that indicates the type of chart needed. Also describe the labels of all y axis'),
                        data: z
                            .array(
                                z.object({
                                    // You can specify known fields here
                                    x1: z.string().optional().describe('This is the x-axis for the data'),
                                    y1: z.number().optional().describe('This is the first y-axis for the data'),
                                    y2: z.number().optional().describe('This is the second y-axis for the data'),
                                }).catchall(z.union([z.string(), z.number()])) // Allows dynamic properties
                            )
                            .describe('This the data which will be used for generating chart. It\'s an array of json objects containing the data.')
                    }),
                    execute: async ({ question, data }) => {
                        // Send the data and question to the AI model for processing
                        const { elementStream } = await streamObject({
                            model: google('models/gemini-1.5-flash-latest'),
                            system:
                                'You are a data visualization assistant. Given a set of data and a question, analyze the data to create an appropriate chart structure. ' +
                                'Provide the chart configuration in JSON format including type, xKey, yKeys, data, title, and description.',
                            prompt: JSON.stringify({ question, data }),
                            output: 'array',
                            schema: z.object({
                                type: z.string().describe('The chart type, such as bar, line, or pie'),
                                xKey: z.string().describe('The x-axis key for the data'),
                                yKeys: z
                                    .array(
                                        z.object({
                                            dataKey: z.string(),
                                            label: z.string().describe('The y-axis key for the data. take the label from question'),
                                            color: z.string().describe('"#2563eb", "#60a5fa" keep these as the top 2 colours'),
                                        })
                                    )
                                    .describe('Array of y-axis keys with labels and colors'),
                                data: z
                                    .array(
                                        z.object({
                                            // You can specify known fields here
                                            x1: z.string().optional().describe('This is the x-axis for the data'),
                                            y1: z.number().optional().describe('This is the first y-axis for the data'),
                                            y2: z.number().optional().describe('This is the second y-axis for the data'),
                                        }).catchall(z.union([z.string(), z.number()])) // Allows dynamic properties
                                    )
                                    .describe('The data used to populate the chart'),
                                title: z.string().describe('The title of the chart'),
                                description: z.string().describe('A description of the chart')
                            })
                        });

                        let chartConfig;

                        // Collect streaming data from the AI model to construct the chart configuration
                        for await (const element of elementStream) {
                            chartConfig = {
                                type: element.type,
                                xKey: element.xKey,
                                yKeys: element.yKeys,
                                data: element.data,
                                title: element.title,
                                description: element.description,
                            };
                        }
                        return chartConfig;
                    }
                },
            }
        });

        // Ensure that result.toAIStreamResponse() is a Response object
        const aiStreamResponse = result.toAIStreamResponse(); // Check what this returns

        // If aiStreamResponse is not a Response object, convert it to JSON
        if (aiStreamResponse instanceof Response) {
            return aiStreamResponse;
        } else {
            return new Response(JSON.stringify(aiStreamResponse), { status: 200 });
        }
    } catch (error) {
        console.error('Error generating content:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate content' }), { status: 500 });
    }
}

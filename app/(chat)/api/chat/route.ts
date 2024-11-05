import { streamText } from "ai";
import { google } from '@ai-sdk/google';
import path from "node:path";
import * as fs from "node:fs";
import { getAuth } from '@clerk/nextjs/server';
import {NextRequest} from "next/server";

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

    // for (const message of messages) {
    //     if (message.role === 'user' && message.experimental_attachments) {
    //         const newContent = message.experimental_attachments.map((attachment: any) => {
    //             const filePath = path.join(process.cwd(), 'temp', userId!, attachment.name);
    //
    //             if (attachment.type === 'file') {
    //                 return {
    //                     type: attachment.type,
    //                     data: fs.readFileSync(filePath),
    //                     mimeType: attachment.mimeType,
    //                 };
    //             } else if (attachment.type === 'image') {
    //                 return {
    //                     type: attachment.type,
    //                     image: fs.readFileSync(filePath),
    //                 };
    //             }
    //             return null; // or handle unknown attachment types
    //         }).filter((item: any) => item !== null); // Remove any null entries from the array
    //
    //         newContent.push({
    //             type: 'text',
    //             text: message.content,
    //         });
    //
    //         message.content = newContent;
    //         delete message.experimental_attachments;
    //     }
    // }

    try {
        const result = await streamText({
            model: google('models/gemini-1.5-flash-latest'),
            system: 'You are a helpful assistant.',
            messages,
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

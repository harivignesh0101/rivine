// app/api/genai/chat/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyDeYl3Wuy3lDoPe_Kbj9558RY1zcs7j0FA');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: { json: () => PromiseLike<{ message: any; }> | { message: any; }; }) {
    const { message } = await req.json();

    // Validate the input
    if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    try {
        const result = await model.generateContent(message);
        return new Response(JSON.stringify({ response: result.response.text() }), { status: 200 });
    } catch (error) {
        console.error('Error generating content:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate content' }), { status: 500 });
    }
}

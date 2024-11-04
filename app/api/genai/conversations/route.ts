import {connect} from "@lib/db";
import {NextResponse} from "@node_modules/next/dist/server/web/spec-extension/response";
import Conversation from "@models/conversation.model";
import { getAuth } from '@clerk/nextjs/server'


export const GET = async (request: any) => {
    const { userId } = getAuth(request)
    console.log(userId);
    try {
        await connect();
        const conversations = await Conversation.find({ userId: userId })
            .select({ _id: 1, createdAt: 1 })
            .lean();
        const formattedConversations = conversations.map(convo => ({
            conversationId: convo._id,
            createdAt: convo.createdAt,
        }));
        return new NextResponse(JSON.stringify(formattedConversations), {status: 200});
    } catch (error) {
        return new NextResponse('Unable to connect to the server. ' + error, {status: 500});
    }
}

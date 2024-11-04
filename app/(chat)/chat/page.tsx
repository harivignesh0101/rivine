import {generateUUID} from "@lib/utils";
import {Chat} from "@components/custom/chat";

export default function ChatPage() {
    const id = generateUUID();


    return (
        <>
            <div className="flex flex-grow w-full h-full">
                <Chat
                    key={id}
                    id={id}
                    initialMessages={[]}
                    selectedModelId={'test'}
                />
            </div>
        </>
    );
}

import { Terminal } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export default function Chat() {
    return (
        <div className="flex-grow flex p-14 justify-center items-center">
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Attention!</AlertTitle>
                <AlertDescription>
                    The dashboards feature is being revamped to incorporate the latest updates from the chat functionality.
                </AlertDescription>
            </Alert>
        </div>
    );
}

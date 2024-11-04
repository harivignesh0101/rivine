"use client"
import React, { ReactNode } from 'react';
import {SidebarProvider, SidebarTrigger} from "@components/ui/sidebar";
import {AppSidebar} from "@components/Sidebar"; // Import specific icons from lucide-react

interface ConsoleLayoutProps {
    children: ReactNode;
}

const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({ children }) => {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-grow h-screen">
                    <SidebarTrigger />
                    <div className="flex flex-grow w-full h-full">
                        {children}
                    </div>
                </div>
            </SidebarProvider>
        </>

    );
};

export default ConsoleLayout;

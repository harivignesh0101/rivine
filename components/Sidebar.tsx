import { MessageCircle, LayoutDashboard, Files } from "lucide-react"

import Image from 'next/image'

import Link from "next/link";
import LogoLight from "@public/assets/logo.png"
import LogoDark from "@public/assets/logo-white.png"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter, SidebarHeader,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs";
import {ModeToggle} from "@components/ui/theme/theme-toggle";
import { useTheme } from "next-themes"

// Menu items.
const items = [
    {
        title: "Chat",
        url: "/chat",
        icon: MessageCircle,
    },
    {
        title: "Dashboards",
        url: "/dashboards",
        icon: LayoutDashboard,
    },
    // {
    //     title: "Files",
    //     url: "/files",
    //     icon: Files,
    // }
]

export function AppSidebar() {
    const { theme, systemTheme } = useTheme()

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex justify-start items-center">

                            <Image src={
                                theme === "dark" || (theme === "system" && systemTheme === "dark")
                                    ? LogoDark
                                    : LogoLight // Default to light if system is light
                            }  alt="Logo" height={35} width={35}/>
                            <span className="pl-2">
                                Rivine
                            </span>
                        </div>
                        <ModeToggle></ModeToggle>
                    </div>

                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex justify-center">
                    <UserButton></UserButton>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

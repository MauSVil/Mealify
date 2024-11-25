'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { NavActions } from "@/components/nav-actions"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AddressProvider } from "./_providers/AddressProvider"
import { useUser } from "@/hooks/useUser"
import { Socket } from "socket.io-client"
import { useEffect, useRef } from "react"
import ky from "ky"
import { getSocketForRole } from "@/lib/socket"
import { User } from "@/lib/types/Zod/User"
import { useSocket } from "./_hooks/useSocket";

type Props = {
  children: React.ReactNode
}

export default function UserPrivateLayout(props: Props) {
  const { children } = props;

  const socket = useSocket();

  return (
    <AddressProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              Mealify
            </div>
            <div className="ml-auto px-3">
              <NavActions />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 px-10 py-10">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AddressProvider>
  )
}

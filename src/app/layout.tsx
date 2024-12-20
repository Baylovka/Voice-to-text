import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Voice to text",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <SidebarTrigger className="top-0 sticky" />
              <main className="flex-1 p-4">
                {children}
              </main>
              <Toaster />
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AudioLines, ChevronUp, History, LogOut, Settings, CreditCard } from "lucide-react"
import { SignedIn, UserButton, useUser, useClerk } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Menu items
const items = [
  {
    title: "Voice to text",
    url: "/",
    icon: AudioLines,
    isBage: true
  },
  {
    title: "Payment",
    url: "/payment",
    icon: CreditCard,
    isBage: false
  },
  {
    title: "History",
    url: undefined,
    icon: History,
    isBage: false
  }
]

interface IHistory {
  id: number
  title: string
  language: string
  processingTime: string
  wordCount: number
  transcript: string
  userId: string
}

export function AppSidebar() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [history, setHistory] = useState<IHistory[] | null>(null);
  const [triesCount, setTriesCount] = useState<number | null>(null);
  const router = useRouter();

  const userId = user?.id;

  useEffect(() => {
    const createUserIfNotExist = async () => {
      if (userId) {
        try {
          const response = await axios.post('/api/user/create', { userId });
          console.log("User created or already exists", response.data);
          setTriesCount(response.data.user.freeTries);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    };

    const getAllHistory = async () => {
      if (userId) {
        try {
          const response = await axios.post('/api/history/get-all-by-user-id', { userId });
          console.log("History received", response.data);
          setHistory(response.data);
        } catch (error) {
          console.error("Error getting history:", error);
        }
      }
    };

    createUserIfNotExist();
    getAllHistory();

  }, [userId]);

  const handleClick = (title: string) => {
    router.push(`/history/${title}`);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        App
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.url ? (
                      <Link key={index} href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    ) : (
                      <a>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                  {item.isBage && (<SidebarMenuBadge>{triesCount}</SidebarMenuBadge>)}
                </SidebarMenuItem>
              ))}


              <SidebarMenuSub>
                {history ? (history.map((item, index) => (
                  <SidebarMenuSubItem key={index}>
                    <SidebarMenuSubButton style={{ cursor: "pointer" }} onClick={() => handleClick(item.title)}>
                      <span>{item.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))) : (
                  <SidebarMenuSubButton>
                    <span>Записів не знайдено</span>
                  </SidebarMenuSubButton>
                )}
              </SidebarMenuSub>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {/* {user?.imageUrl ? (
                    <img src={user?.imageUrl} alt="Avatar" className="rounded-full h-6 w-6" />
                  ) : (
                    <UserRound />
                  )} */}
                  <UserButton />
                  {user?.fullName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <SignedIn>
                <DropdownMenuContent side="top" className="w-fit">
                  <DropdownMenuItem className="select-text focus:bg-transparent cursor-text">
                    <span>{user?.emailAddresses[0].emailAddress}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => openUserProfile()}>
                    <Settings />
                    <span>Manage Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                    <LogOut />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </SignedIn>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

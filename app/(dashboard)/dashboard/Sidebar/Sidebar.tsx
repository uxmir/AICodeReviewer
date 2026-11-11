"use client";
import React from "react";
import {
  Sparkles,
  Send,
  Loader2,
  CardSim,
  GitCommitHorizontal,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { signOut,useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface itemArr {
  id: number;
  item: string;
  icon: string;
  link:string
}

const iconRender: Record<string, LucideIcon> = {
  card: CardSim,
  git: GitCommitHorizontal,
  settings: Settings,
};
const Sidebar: React.FC = () => {
  const { data: session } = useSession();
  const router=useRouter()
  const sidebarItem: itemArr[] = [
    {
      id: 1,
      item: "Overview",
      icon: "card",
      link:"/dashboard"
    },
    {
      id: 2,
      item: "Repositories",
      icon: "git",
      link:"/dashboard/repo",
    },
    {
      id: 3,
      item: "Pull Requests",
      icon: "git",
      link:"",
    },
    {
      id: 4,
      item: "Github Apps",
      icon: "git",
      link:"/dashboard/github",
    },
    {
      id: 5,
      item: "Settings",
      icon: "settings",
      link:"",
    },
  ];
    const handleLogout=async()=>{
      await signOut({
          fetchOptions:{
              onSuccess:()=>{
              router.push("/login")
              }
          }
      })
    }
  return (
    <div>
      {sidebarItem?.map((i) => {
        const IconComponent = iconRender[i.icon] || CardSim;
        return (
          <div key={i.id}>
           <Link href={i.link}>
               <div className="flex items-center gap-x-4">
              <IconComponent size={20} />
              <span>{i.item}</span>
            </div>
           </Link>
          </div>
        );
      })}
      <div>
        <p>{session?.user?.name}</p>
        <p>{session?.user?.email}</p>
      </div>
      <button onClick={handleLogout}>Signout</button>
    </div>
  );
};

export default Sidebar;

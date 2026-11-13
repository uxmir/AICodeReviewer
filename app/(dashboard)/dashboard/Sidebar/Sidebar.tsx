
"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  LayoutDashboard,
  GitBranch,
  GitPullRequest,
  Boxes,
  Settings,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface itemArr {
  id: number;
  item: string;
  icon: string;
  link: string;
}

const iconRender: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  repositories: GitBranch,
  pullRequests: GitPullRequest,
  githubApps: Boxes,
  settings: Settings,
};

const Sidebar: React.FC = () => {
  return (
    <Suspense fallback={<div className="w-64 h-screen bg-slate-50 p-6">Loading...</div>}>
      <SideBarLogic />
    </Suspense>
  );
};

export default Sidebar;

const SideBarLogic: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [installationId, setInstallationId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathName = usePathname() as string;

  useEffect(() => {
    const id = searchParams.get("installationId") || searchParams.get("installation_id");
    if (id) {
      setInstallationId(id);
      localStorage.setItem("github_installation_id", id);
    } else {
      const savedId = localStorage.getItem("github_installation_id");
      if (savedId) {
        setInstallationId(savedId);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  const sidebarItem: itemArr[] = [
    {
      id: 1,
      item: "Overview",
      icon: "dashboard",
      link: "/dashboard",
    },
    {
      id: 2,
      item: "Repositories",
      icon: "repositories",
      link: installationId ? `/dashboard/${installationId}` : "#",
    },
    {
      id: 3,
      item: "Pull Requests",
      icon: "pullRequests",
      link: "",
    },
    {
      id: 4,
      item: "Github Apps",
      icon: "githubApps",
      link: "/dashboard/github",
    },
    {
      id: 5,
      item: "Settings",
      icon: "settings",
      link: "",
    },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("github_installation_id");
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };
  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Top Section: Logo & Nav Links */}
      <div className="flex flex-col gap-y-6">
        {/* App Brand / Title */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              AI
            </div>
            <span className="font-semibold text-slate-800 tracking-wide text-base">
              Code Reviewer
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-500 hover:text-slate-800 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-y-1.5">
          {sidebarItem?.map((i) => {
            const IconComponent = iconRender[i.icon] || LayoutDashboard;
            const isActive = pathName === i.link;

            return (
              <Link
                key={i.id}
                href={i.link}
                className={`flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <IconComponent size={18} className={isActive ? "text-white" : "text-slate-500"} />
                <span>{i.item}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User Profile & Signout */}
      <div className="pt-4 border-t border-slate-200 flex flex-col gap-y-3">
        {/* User Info */}
        <div className="flex items-center gap-x-3 px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-slate-800 truncate">
              {session?.user?.name || "User"}
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              {session?.user?.email || "user@example.com"}
            </span>
          </div>
        </div>

        {/* Signout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-x-2 w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 shadow-xs"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden  bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
            AI
          </div>
          <span className="font-semibold text-slate-800 text-sm">Code Reviewer</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
        >
          <Menu size={20} />
        </button>
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden transition-opacity"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-4 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
      <aside className="hidden md:flex w-64 h-[100vh] fixed top-0 left-0 overflow-y-auto bg-white border-r border-slate-200 p-4 select-none z-30 flex-col justify-between">
        {sidebarContent}
      </aside>
    </>
  );
};
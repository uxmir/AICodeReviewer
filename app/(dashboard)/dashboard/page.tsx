"use client";

import React, { useEffect, useState } from "react";
import { 
  GitBranch, 
  GitPullRequest, 
  ShieldCheck, 
  ArrowRight, 
  Boxes, 
  ExternalLink,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const OverviewPage: React.FC = () => {
  const { data: session } = useSession();
  const [installationId, setInstallationId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("github_installation_id");
    if (id) {
      setInstallationId(id);
    }
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-x-2 text-slate-300 text-sm font-medium mb-1">
            <Sparkles size={16} className="text-amber-400" />
            <span>AI Code Review Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {session?.user?.name || "Developer"}! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor your connected GitHub repositories and automated code reviews in real-time.
          </p>
        </div>
        {installationId && (
          <Link
            href={`/dashboard/${installationId}`}
            className="flex items-center gap-x-2 bg-white text-slate-900 hover:bg-slate-100 font-medium px-4 py-2.5 rounded-xl text-sm transition shadow-xs"
          >
            <span>View Repositories</span>
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Connection Status</p>
            <h3 className="text-lg font-bold text-slate-800 mt-1">
              {installationId ? "Connected" : "Not Linked"}
            </h3>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${installationId ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Installation ID</p>
            <h3 className="text-base font-bold text-slate-800 mt-1 truncate max-w-[140px]">
              {installationId || "N/A"}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
            <Boxes size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Repos</p>
            <h3 className="text-lg font-bold text-slate-800 mt-1">
              {installationId ? "Synced" : "0"}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <GitBranch size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Reviews</p>
            <h3 className="text-lg font-bold text-slate-800 mt-1">Active</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <GitPullRequest size={24} />
          </div>
        </div>
      </div>

      {/* Quick Action Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Manage GitHub App</h3>
            <p className="text-slate-500 text-sm mb-6">
              Configure your GitHub App permissions, check installation status, or reinstall the app if needed.
            </p>
          </div>
          <Link
            href="/dashboard/github"
            className="inline-flex items-center gap-x-2 text-sm font-semibold text-slate-900 hover:text-slate-700"
          >
            <span>Go to GitHub Settings</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Explore Repositories</h3>
            <p className="text-slate-500 text-sm mb-6">
              Browse through your connected repositories, inspect code structures, and view automated reviews.
            </p>
          </div>
          <Link
            href={installationId ? `/dashboard/${installationId}` : "/dashboard/github"}
            className="inline-flex items-center gap-x-2 text-sm font-semibold text-slate-900 hover:text-slate-700"
          >
            <span>View Repos List</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
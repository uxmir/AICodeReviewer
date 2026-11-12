"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, GitBranch, ArrowRight } from "lucide-react";
const Page = () => {
  const [installId, setInstallId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
    const id = localStorage.getItem("github_installation_id");
    if (id) {
      setInstallId(id);
    }
  }, []);
  const handleInstall = () => {
    window.location.href = process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || "";
  };
  if (!isMounted) return null;
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xs p-8 text-center flex flex-col items-center">
        {installId ? (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              GitHub App Connected
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Your GitHub app has been successfully installed and linked to your account.
            </p>
            <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 font-mono mb-6">
              Installation ID: <span className="font-semibold text-slate-900">{installId}</span>
            </div>
            <a
              href={`/dashboard/${installId}`}
              className="w-full flex items-center justify-center gap-x-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-xs"
            >
              <span>View Repositories</span>
              <ArrowRight size={16} />
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-200">
              <GitBranch size={30} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Connect GitHub App
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Install the GitHub App to manage your repositories and enable automated AI code reviews.
            </p>
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-x-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-xs cursor-pointer"
            >
              <GitBranch size={18} />
              <span>Install GitHub App</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
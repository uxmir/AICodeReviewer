// "use client";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { findRepos } from "@/store/slice/repoSlice";
// import { useParams, useSearchParams } from "next/navigation";
// import React, { Suspense, useEffect } from "react";

// const page: React.FC = () => {
//   return (
//     <Suspense>
//       <FetchRepo />
//     </Suspense>
//   );
// };
// export default page;

// const FetchRepo: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { loading, repos } = useAppSelector((state) => state.repo);
//   const searchParams: any = useSearchParams();
//   const params: any = useParams();
//   const installationId = params.installationId as string;
//   const page = searchParams.get("page") || ("1" as string);
//   const limit = searchParams.get("limit") || ("10" as string);
//   useEffect(() => {
//     if (installationId) {
//       dispatch(findRepos({ installationId, page, limit }));
//     }
//   }, [dispatch, installationId, page, limit]);
//   const repoList = repos?.paginatedData || [] as any;
//   const currentPage=repos?.currentPage as number;
//   const totalPages=repos?.totalPages as number; 
//   console.log(currentPage,totalPages)
//   if (loading) return <div>loading...</div>; 
//   return (
//     <>
//       <div>
//         <h2>Repo Page</h2>
//         {repoList.length === 0 ? (
//           <p>No repositories found. Please make sure the app is installed.</p>
//         ) : (
//           repoList.map((r: any) => (
//             <div key={r.id}>
//               <p>{r?.name}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </>
//   );
// };

"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { findRepos } from "@/store/slice/repoSlice";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import {
  GitBranch,
  Lock,
  Globe,
  Star,
  GitFork,
  ExternalLink,
  Code2,
  FolderGit2,
  Loader2,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Page: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
        </div>
      }
    >
      <FetchRepo />
    </Suspense>
  );
};

export default Page;

const FetchRepo: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, repos } = useAppSelector((state) => state.repo);
  const searchParams = useSearchParams();
  const params = useParams();

  const installationId = params.installationId as string;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  useEffect(() => {
    if (installationId) {
      dispatch(findRepos({ installationId, page, limit }));
    }
  }, [dispatch, installationId, page, limit]);

  const repoList = (repos?.paginatedData || []) as any[];
  const currentPage = (repos?.currentPage || Number(page)) as number;
  const totalPages = (repos?.totalPages || 1) as number;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/dashboard/${installationId}?page=${newPage}&limit=${limit}`);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="h-44 bg-white border border-slate-200 rounded-2xl p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-5 w-2/3 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
              </div>
              <div className="h-4 w-1/3 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-x-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <FolderGit2 size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Connected Repositories
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Installation ID:{" "}
            <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {installationId}
            </span>
          </p>
        </div>

        <div className="text-sm text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
          Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
          <span className="font-semibold text-slate-900">{totalPages}</span>
        </div>
      </div>

      {/* Repository Grid */}
      {repoList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <GitBranch size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">No Repositories Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            No repositories are accessible under this installation. Please make sure the GitHub App has repository permissions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {repoList.map((r: any) => (
            <div
              key={r.id}
              className="group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Repo Name & Visibility Badge */}
                <div className="flex items-start justify-between gap-x-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {r?.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                      {r?.full_name}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center gap-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      r?.private
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {r?.private ? <Lock size={11} /> : <Globe size={11} />}
                    {r?.private ? "Private" : "Public"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 line-clamp-2 mt-3 min-h-[40px]">
                  {r?.description || "No description provided for this repository."}
                </p>
              </div>

              {/* Bottom Metadata & GitHub Link */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-x-3">
                  {r?.language && (
                    <span className="inline-flex items-center gap-x-1 font-medium text-slate-700">
                      <Code2 size={13} className="text-blue-500" />
                      {r.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-x-1">
                    <Star size={13} />
                    {r?.stargazers_count ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-x-1">
                    <GitFork size={13} />
                    {r?.forks_count ?? 0}
                  </span>
                </div>

                {r?.html_url && (
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-x-1 font-medium text-slate-700 hover:text-slate-900 transition"
                    title="Open on GitHub"
                  >
                    <span>GitHub</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shadcn Pagination */}
      {totalPages > 1 && (
        <div className="pt-4 border-t border-slate-200">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNum) => {
                  if (
                    totalPages > 5 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - currentPage) > 1
                  ) {
                    if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

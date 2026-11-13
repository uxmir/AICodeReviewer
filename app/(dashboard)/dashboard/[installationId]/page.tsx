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
  RefreshCw,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-pulse">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-12 bg-slate-100 rounded-lg w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
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

      {/* Repository Table */}
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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 ">
              <TableRow className="border-b border-gray-300 px-6">
                <TableHead className="py-4 font-semibold text-slate-700">Repository</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Status</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repoList.map((r: any) => {
                const firstLetter = r?.name ? r.name.charAt(0).toUpperCase() : "R";
                return (
                  <TableRow key={r.id} className="hover:bg-slate-50/60 transition-colors border-b border-gray-300 ">
                    {/* Repository Name & Avatar */}
                    <TableCell className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                          {firstLetter}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 truncate">
                              {r?.name}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                            {r?.full_name}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status (Public / Private) */}
                    <TableCell className="py-4">
                      <span
                        className={`inline-flex items-center gap-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          r?.private
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {r?.private ? <Lock size={12} /> : <Globe size={12} />}
                        {r?.private ? "Private" : "Public"}
                      </span>
                    </TableCell>

                    {/* Actions (Sync Button) */}
                    <TableCell className="py-4 pr-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-medium border-slate-200 hover:bg-slate-100 cursor-pointer shadow-xs"
                        onClick={() => {
                          console.log("Syncing repo:", r?.name);
                        }}
                      >
                        <RefreshCw size={13} className="text-slate-500" />
                        Sync
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { findAllReview } from "@/store/slice/reviewSlice";
import Link from "next/link";
import React, { useEffect } from "react";
import { ArrowUpRight, FileCode2 } from "lucide-react";

const ReviewListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reviews, loading } = useAppSelector((state) => state.review);

  useEffect(() => {
    dispatch(findAllReview());
  }, [dispatch]);

  const reviewData = reviews || [];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-medium">
        loading....
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Code Reviews
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse all automated repository review findings and analysis.
          </p>
        </div>
        <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-2xs">
          Total: {reviewData.length}
        </div>
      </div>

      {/* Review List Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {reviewData.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <FileCode2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No reviews found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Trigger a review to see logs appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviewData.map((r: any) => (
              <div
                key={r?._id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors duration-150"
              >
                <div className="space-y-1 min-w-0">
                  <span className="font-mono text-[11px] text-slate-400">
                    ID: #{String(r?._id).slice(-6).toUpperCase()}
                  </span>
                  <Link href={`/dashboard/aireview/${r?._id}`}>
                    <h3 className="font-medium text-slate-800 hover:text-slate-950 truncate transition-colors">
                      {r?.title || "Untitled Review"}
                    </h3>
                  </Link>
                </div>

                <Link
                  href={`/dashboard/aireview/${r?._id}`}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-2xs"
                >
                  View Details
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewListPage;
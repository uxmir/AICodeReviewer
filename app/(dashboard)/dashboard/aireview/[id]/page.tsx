"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { findSingle } from "@/store/slice/reviewSlice";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { Check, Copy, Sparkles, Terminal } from "lucide-react";

const ReviewDetailPage = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-sm">
          Loading suspense...
        </div>
      }
    >
      <SingleReviewContent />
    </Suspense>
  );
};

export default ReviewDetailPage;

const SingleReviewContent: React.FC = () => {
  const params = useParams();
  const reviewId = params.id as string;
  const dispatch = useAppDispatch();
  const { review, loading } = useAppSelector((state) => state.review);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (reviewId) {
      dispatch(findSingle(reviewId));
    }
  }, [dispatch, reviewId]);

  const handleCopy = () => {
    if (review?.aiReview) {
      navigator.clipboard.writeText(review.aiReview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center text-slate-800 font-mono text-sm">
        loading review details....
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title & Header Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            AI Code Review Analysis
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {review?.title}
          </h1>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400 font-mono">
            <span>ID: {reviewId}</span>
          </div>
        </div>

        {/* Dark Code Block Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Terminal / Code Window Header */}
          <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                review-findings.md
              </span>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700/60 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8 bg-slate-900/50 overflow-x-auto">
            <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-slate-300 selection:bg-indigo-500 selection:text-white">
              {review?.aiReview}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { findSingle } from "@/store/slice/reviewSlice";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

const ReviewDetailPage = () => {
  return (
    <Suspense fallback={<div>Loading suspense...</div>}>
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

  useEffect(() => {
    if (reviewId) {
      dispatch(findSingle(reviewId));
    }
  }, [dispatch, reviewId]);

  if (loading) return <div>loading review details....</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{review?.title}</h1>
      <div className="bg-gray-100 p-4 rounded mt-4">
        <pre className="whitespace-pre-wrap">{review?.aiReview}</pre>
      </div>
    </div>
  );
};
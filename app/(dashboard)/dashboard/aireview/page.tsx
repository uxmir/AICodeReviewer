"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { findAllReview } from "@/store/slice/reviewSlice";
import Link from "next/link";
import React, { useEffect } from "react";

const ReviewListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reviews, loading } = useAppSelector((state) => state.review);

  useEffect(() => {
    dispatch(findAllReview());
  }, [dispatch]);

  const reviewData = reviews || [];

  if (loading) return <div>loading....</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">AI Code Reviews</h2>
      {reviewData.map((r: any) => (
        <div key={r?._id} className="border p-3 mb-2 rounded hover:bg-gray-50">
          <Link href={`/dashboard/aireview/${r?._id}`}>
            <p className="font-medium text-blue-600">{r?.title}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ReviewListPage;
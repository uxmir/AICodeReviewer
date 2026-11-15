import mongoose, { Schema, Document, Model } from "mongoose";

export interface Review extends Document {
  repoId: string;
  title?: string;
  aiReview?: string;
  status: "Pending" | "Reviewed" | "Failed";
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<Review>(
  {
    repoId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Generating review...",
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Failed"],
      default: "Pending",
    },
    aiReview: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const reviewModel: Model<Review> =
  mongoose.models.review || mongoose.model<Review>("review", reviewSchema);

export default reviewModel;
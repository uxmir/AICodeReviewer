export interface Review {
  _id?: string;
  repoId: string;
  title: string;
  aiReview: string;
  status: "Pending" | "Reviewed" | "Failed" | string;
  createdAt?: string;
}
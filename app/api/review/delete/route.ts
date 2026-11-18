import reviewModel from "@/models/reviews";
import ApiError from "@/utils/response.error";
import ApiResponse from "@/utils/response.success";

export async function DELETE(reviewId: string) {
  try {
    if (!reviewId)
      return ApiError.handleResponse(
        ApiError.notFound("reviewId is not found"),
      );
    await reviewModel.findByIdAndDelete(reviewId);
    return ApiResponse.ok("data is deleted");
  } catch (error: any) {
    return ApiError.handleResponse(error);
  }
}

import { dbConnect } from "@/lib/db";
import reviewModel from "@/models/reviews";
import ApiError from "@/utils/response.error";
import ApiResponse from "@/utils/response.success";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!id)
      return ApiError.handleResponse(
        ApiError.badRequest("Review ID is required"),
      );
    const response = await reviewModel.findById(id);
    if (!response)
    return ApiError.handleResponse(ApiError.notFound("Review not found"));
    return ApiResponse.ok("Review found successfully", response);
  } catch (error: any) {
    return ApiError.handleResponse(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id)
      return ApiError.handleResponse(ApiError.notFound("id is not found"));
    await reviewModel.findByIdAndDelete(id);
    return ApiResponse.ok("data is deleted");
  } catch (error: any) {
    return ApiError.handleResponse(error);
  }
}

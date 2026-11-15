import { dbConnect } from "@/lib/db";
import reviewModel from "@/models/reviews";
import ApiError from "@/utils/response.error";
import ApiResponse from "@/utils/response.success";

export async function GET(){
try {
  await dbConnect()
  const response=await reviewModel.find().sort({createdAt:-1})
  return ApiResponse.ok("review found successfully",response)
} catch (error:any) {
  return ApiError.handleResponse(error)  
}
}
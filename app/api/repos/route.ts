import { dbConnect } from "@/lib/db";
import Installation from "@/models/Installation";
import { getGithubApp } from "@/utils/github.app";
import ApiError from "@/utils/response.error";
import ApiResponse from "@/utils/response.success";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page: number = parseInt(searchParams.get("page") || "1", 10);
    const limit: number = parseInt(searchParams.get("limit") || "10", 10);
    const installId: string | null = searchParams.get("installationId");

    if (!installId) throw ApiError.unauthorized("installationid is not found");
    const installation = await Installation.findOne({
      installationId: installId,
    });

    if (!installation) {
      throw ApiError.notFound("Installation not found in database");
    }
    const allData:any=installation?.repositories?.reverse();
    //paginateddata
    const totalPages: number = Math.ceil(allData.length / limit);
    const currentPage: number = Math.min(Math.max(1, page), totalPages);
    const startIndex: number = (currentPage - 1) * limit;
    const endIndex: number = startIndex + limit;
    const paginatedData: any = allData?.slice(startIndex, endIndex);

   return  ApiResponse.ok("data fetched successfully", {
      installationId:installation.installationId,
      totalPages,
      currentPage,
      paginatedData,
    });
  } catch (error: any) {
    return ApiError.handleResponse(error);
  }
}

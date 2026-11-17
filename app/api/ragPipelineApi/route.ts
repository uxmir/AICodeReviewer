import ApiError from "@/utils/response.error";
import ApiResponse from "@/utils/response.success";
import Installation from "@/models/Installation";
import { inngest } from "@/lib/ingest-client";
import { dbConnect } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { repoId, owner, repoName } = await req.json();

    if (!repoId || !owner || !repoName) {
     return ApiError.handleResponse(ApiError.notFound("something is missing"));
    }
    await dbConnect();
    const installationRecord = await Installation.findOne({
      "repositories.id": Number(repoId),
    });

    if (!installationRecord) {
    return ApiError.handleResponse(ApiError.notFound("installationid is missing"));
    }
    await inngest.send({
      name: "rag.sync",
      data: {
        repoId: String(repoId),
        owner,
        repoName,
        installationId: installationRecord.installationId,
      },
    });
    return ApiResponse.ok("rag synced successfully");
  } catch (error: any) {
    return ApiError.handleResponse(error);
  }
}
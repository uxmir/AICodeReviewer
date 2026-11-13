import { dbConnect } from "@/lib/db";
import Installation from "@/models/Installation";
import { getGithubApp } from "@/utils/github.app";
import ApiError from "@/utils/response.error";
import ApiResponse from "@/utils/response.success";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const signature = req.headers.get("x-hub-signature-256");
    const event = req.headers.get("x-github-event");
    if (!event) throw ApiError.badRequest("GitHub Event header missing");
    if (!signature) throw ApiError.unauthorized("Webhook signature missing");

    const rawBody = await req.text();
    const app = getGithubApp();
    const isValid = app.webhooks.verify(rawBody, signature);
    if (!isValid) throw ApiError.unauthorized("Invalid webhook signature");
    const body = await JSON.parse(rawBody);
    //for repo that exists
    if (event === "installation") {
      const { action, installation, repositories } = body;
      if (action === "created" || action === "added") {
        await Installation.findOneAndUpdate(
          { installationId: installation.id },
          {
            installationId: installation.id,
            account: installation.account.login,
            targetType: installation.target_type,
            repositories: repositories || installation.repositories || [],
          },
          { upsert: true, new: true },
        );
      } else if (action === "deleted" || action === "suspended") {
        await Installation.findOneAndDelete({
          installationId: installation.id,
        });
      }
    }
    //for repo that is added or removed
    else if (event === "installation_repositories") {
      const { action, installation, repositories_added, repositories_removed } =
        body;
      const existInstallation = await Installation.findOne({
        installationId: installation.id,
      });
      
      if (existInstallation) {
        let updateRepos = existInstallation?.repositories || [];
        if (action === "added" && repositories_added) {
          const existingIds = new Set(updateRepos.map((r: any) => r.id));
          const uniqueNewRepos = repositories_added.filter(
            (r: any) => !existingIds.has(r.id),
          );
          updateRepos = [...updateRepos, ...uniqueNewRepos];
        }
         else if (action === "removed" && repositories_removed) {
          const removedId = repositories_removed?.map((t: any) => t.id);
          updateRepos = updateRepos?.filter(
            (t: any) => !removedId.includes(t.id),
          );
        }
        existInstallation.repositories = updateRepos;
        await existInstallation.save();
      }
    }
    return ApiResponse.ok("Webhook event triggered successfully");
  } catch (error: any) {
    return ApiError.handleResponse(error);
  }
}

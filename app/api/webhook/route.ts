import { vectorSearch } from "./../ingest/functions/ragPipeline";
import { dbConnect } from "@/lib/db";
import Installation from "@/models/Installation";
import { aiAction } from "@/utils/ai-model";
import { getGithubApp } from "@/utils/github.app";
import ApiError from "@/utils/response.error";
import ApiResponse from "@/utils/response.success";

export async function POST(req: Request) {
  try {
    // 1. Ensure database connection
    await dbConnect();

    // 2. Extract signature and event name from GitHub webhook headers
    const signature = req.headers.get("x-hub-signature-256");
    const event = req.headers.get("x-github-event");
    if (!event) return ApiError.handleResponse(ApiError.badRequest("GitHub Event header missing"));
    if (!signature) return ApiError.handleResponse(ApiError.unauthorized("Webhook signature missing"));

    // 3. Verify webhook request body (Security check: ensure request came from GitHub)
    const rawBody = await req.text();
    const app = getGithubApp();
    const isValid = app.webhooks.verify(rawBody, signature);
    if (!isValid) return ApiError.handleResponse(ApiError.unauthorized("Invalid webhook signature"));

    // Parse raw body into JSON object after verification
    const body = JSON.parse(rawBody);

    // =========================================================================
    // Event 1: "installation" (Triggered when user installs, uninstalls, or suspends the GitHub App)
    // =========================================================================
    if (event === "installation") {
      const { action, installation, repositories } = body;

      // Save or update installation in DB when installed or repository access is added
      if (action === "created" || action === "added") {
        await Installation.findOneAndUpdate(
          { installationId: installation.id },
          {
            installationId: installation.id,
            account: installation.account.login,
            targetType: installation.target_type,
            repositories: repositories || installation.repositories || [],
          },
          { upsert: true, new: true }
        );
      } 
      // Delete installation record from DB if uninstalled or suspended
      else if (action === "deleted" || action === "suspended") {
        await Installation.findOneAndDelete({
          installationId: installation.id,
        });
      }
    }

    // =========================================================================
    // Event 2: "installation_repositories" (Triggered when repositories are added or removed from the app)
    // =========================================================================
    else if (event === "installation_repositories") {
      const { action, installation, repositories_added, repositories_removed } =
        body;

      // Find the installation record in the database
      const existInstallation = await Installation.findOne({
        installationId: installation.id,
      });

      if (existInstallation) {
        let updateRepos = existInstallation?.repositories || [];

        // Add newly added repositories while filtering out duplicates
        if (action === "added" && repositories_added) {
          const existingIds = new Set(updateRepos.map((r: any) => r.id));
          const uniqueNewRepos = repositories_added.filter(
            (r: any) => !existingIds.has(r.id)
          );
          updateRepos = [...updateRepos, ...uniqueNewRepos];
        } 
        // Filter out removed repositories from the list
        else if (action === "removed" && repositories_removed) {
          const removedId = repositories_removed?.map((t: any) => t.id);
          updateRepos = updateRepos?.filter(
            (t: any) => !removedId.includes(t.id)
          );
        }

        // Save the updated repository list to the database
        existInstallation.repositories = updateRepos;
        await existInstallation.save();
      }
    }

    // =========================================================================
    // Event 3: "push" (Triggered when new code is pushed to the repository -> AI Code Review)
    // =========================================================================
    else if (event === "push") {
      const { repository, commits, installation } = body;
      const repoId = String(repository.id);
      const owner = repository.owner.login;
      const repoName = repository.name;

      // Traverse through all commits to collect paths of added and modified files
      const changedFiles = new Set<string>();
      commits?.forEach((commit: any) => {
        commit.added?.forEach((file: string) => changedFiles.add(file));
        commit.modified?.forEach((file: string) => changedFiles.add(file));
      });

      const fileList = Array.from(changedFiles);

      if (fileList.length > 0 && installation?.id) {
        const octokit = await app.getInstallationOctokit(installation.id);
        let pushedCodeContent = "";

        for (const filePath of fileList) {
          try {
            const { data }: any = await octokit.rest.repos.getContent({
              owner,
              repo: repoName,
              path: filePath,
            });
            if (data.content) {
              const decoded = Buffer.from(data.content, "base64").toString("utf-8");
              pushedCodeContent += `\n--- File: ${filePath} ---\n${decoded}\n`;
            }
          } catch (err) {
            console.error(`Could not fetch file ${filePath}:`, err);
          }
        }

        if (pushedCodeContent) {
          const similarContext = await vectorSearch(repoId, pushedCodeContent);
          await aiAction(similarContext,pushedCodeContent,repoId)
        }
      }
    }

    // =========================================================================
    // Event 4: "pull_request" (Triggered when a Pull Request is opened or synchronized)
    // =========================================================================
    else if (event === "pull_request") {
      const { action, pull_request, repository, installation } = body;
      if (action === "opened" || action === "synchronize") {
        const repoId = String(repository.id);
        const owner = repository.owner.login;
        const repoName = repository.name;
        const pullNumber = pull_request.number;

        if (installation?.id) {
          const octokit = await app.getInstallationOctokit(installation.id);
          const { data: prFiles }: any = await octokit.rest.pulls.listFiles({
            owner,
            repo: repoName,
            pull_number: pullNumber,
          });

          let prCodeContent = "";

          for (const file of prFiles) {
            if (file.status !== "removed") {
              try {
                const { data }: any = await octokit.rest.repos.getContent({
                  owner,
                  repo: repoName,
                  path: file.filename,
                  ref: pull_request.head.ref,
                });

                if (data.content) {
                  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
                  prCodeContent += `\n--- File: ${file.filename} ---\n${decoded}\n`;
                }
              } catch (err) {
                console.error(`Could not fetch PR file ${file.filename}:`, err);
              }
            }
          }

          if (prCodeContent) {
            const similarContext = await vectorSearch(repoId, prCodeContent);
             await aiAction(similarContext,prCodeContent,repoId)
          }
        }
      }
    }
    // Send a 200 OK response back to GitHub once everything completes successfully
    return ApiResponse.ok("Webhook event triggered successfully");
  } catch (error: any) {
    // Handle errors using the custom error handler
    return ApiError.handleResponse(error);
  }
}
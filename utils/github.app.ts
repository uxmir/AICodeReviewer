
import { App } from "octokit";
import fs from "fs";
import path from "path";
let githubApp: App | null = null;
export function getGithubApp() {
  if (!githubApp) {
    const keyPath = path.join(process.cwd(), process.env.GITHUB_PRIVATE_KEY || "github-private-key.pem");
    const privateKey = fs.readFileSync(keyPath, "utf8");

    githubApp = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: privateKey, 
      webhooks: {
        secret: process.env.GITHUB_WEBHOOK_SECRET!,
      },
    });
  }
  return githubApp;
}
import { connectOpenAI } from "@/lib/ai";
import { dbConnect } from "@/lib/db";
import { inngest } from "@/lib/ingest-client";
import CodeEmbedding from "@/models/codeEmbedding";
import { getGithubApp } from "@/utils/github.app";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const ragPipeline = inngest.createFunction(
  {
    id: "rag-pipeline",
    triggers: [{ event: "rag.sync" }],
  },
  async ({ event, step }: any) => {
    const { repoId, owner, repoName, installationId } = event.data;

    // Step 1: Fetching all files from GitHub using Octokit
    const files = await step.run("fetch-github-files", async () => {
      const app = await getGithubApp();
      const octokit = await app.getInstallationOctokit(installationId);
      
      const { data: repoTree }: any = await octokit.rest.git.getTree({
        repo: repoName, 
        owner: owner,
        tree_sha: "HEAD",
        recursive: "1",
      });

      let validFiles: any = [];
      //fetching all data from gtihub by octokit
      for (const repoFile of repoTree?.tree || []) {
        if (repoFile.type === "blob" && /\.(ts|tsx|js|jsx|py|json|md)$/.test(repoFile.path)) {
          try {
            const { data: repoData }: any = await octokit.rest.repos.getContent({
              owner,
              repo: repoName,
              path: repoFile.path,
            });

            if (repoData.content) {
              const decodedContent = Buffer.from(repoData.content, "base64").toString("utf-8");
              validFiles.push({ path: repoFile.path, content: decodedContent });
            }
          } catch (error: any) {
            console.error(`File fetching error for ${repoFile.path}:`, error);
          }
        }
      }
      return validFiles;
    });

    // Step 2: Chunking code
    const chunksData = await step.run("split-code-into-chunks", async () => {
      if (!files || files.length === 0) return [];
      
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });

      let allChunks: any = [];

      for (const file of files) {
        const chunks = await splitter.splitText(file.content);
        chunks.forEach((chunk, index) => {
          allChunks.push({
            path: file.path,
            chunkIndex: index,
            code: chunk,
          });
        });
      }
      return allChunks;
    });

    // Step 3: Creating embeddings and saving to DB
    const upsertResult = await step.run("embed-by-ai", async () => {
      if (!chunksData || chunksData.length === 0) {
        return { totalChunksSaved: 0, message: "No code to embed" };
      }
      await dbConnect();
      const ai = await connectOpenAI();
      const docsToInsert = await Promise.all(
        chunksData.map(async (item: any) => {
          const responseEmbedding = await ai.embeddings.create({
            model: "text-embedding-3-small",
            input: item.code,
          });
          return {
            repoId,
            filePath: item.path,
            chunkIndex: item.chunkIndex,
            code: item.code,
            embedding: responseEmbedding.data[0].embedding,
          };
        })
      );
      await CodeEmbedding.deleteMany({ repoId });
      await CodeEmbedding.insertMany(docsToInsert);
      
      return { totalChunksSaved: docsToInsert.length };
    });

    return {
      success: true,
      message: "Data chunked and saved to MongoDB successfully",
      data: upsertResult,
    };
  }
);
//vector search fundtion

export async function vectorSearch(repoId:string,code:string){
const ai=await connectOpenAI();
await dbConnect();
const responseEmbedding:any=await ai.embeddings.create({
  model:"text-embedding-3-small",
  input:code
})
const vectorQuery:any=responseEmbedding.data[0].embedding;
const result:any=await CodeEmbedding.aggregate([
  {
    $vectorSearch:{
    index:"vector_index" ,
    path:"embedding" ,
    queryVector:vectorQuery,
    numCandidates:50 ,
    limit:3,
    filter:{repoId:{$eq:repoId }}
    }
  },
  {
    $project:{
      _id:1 ,
      repoId:1 ,
      path:1,
      code:1 ,
      score: { $meta: "vectorSearchScore"},
    }
  }
])
return result as any
} 
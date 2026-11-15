import { connectOpenAI } from "@/lib/ai";
import { dbConnect } from "@/lib/db";
import { inngest } from "@/lib/ingest-client";
import CodeEmbedding from "@/models/codeEmbedding";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const ragPipeline = inngest.createFunction(
  {
    id: "rag-pipeline",
    triggers: [{ event: "rag.sync" }],
  },
  async ({ event, step }: any) => {
    const { repoId, filePath, sampleCode } = event.data;
//chunking code
    const chunks = await step.run("split-code-into-chunks", async () => {
      if (!sampleCode) return [];
      const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
        chunkSize: 500,
        chunkOverlap: 50,
      });
      return await splitter.splitText(sampleCode);
    });
    //creating embedding
    const upsertResult = await step.run("embed-by-ai", async () => {
      if (!chunks || chunks.length === 0) {
        return { totalChunksSaved: 0, message: "No code to embed" };
      }

      await dbConnect()
      const ai = await connectOpenAI();
      const docsToInsert = await Promise.all(
        chunks.map(async (chunk: string, index: number) => {
          const responseEmbedding = await ai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk,
          });
          return {
            repoId,
            filePath,
            chunkIndex: index,
            code: chunk,
            embedding: responseEmbedding.data[0].embedding,
          };
        })
      );
      //deleting and creating db for embedded data
      await CodeEmbedding.deleteMany({repoId,filePath})
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
  model:"text-embedding-3-small" as string,
  input:code
})
const vectorQuery:any=responseEmbedding.data[0].embedding;
const result:any=await CodeEmbedding.aggregate([
  {
    $vectorSearch:{
    index:"vector_index" as string,
    path:"embedding" as string,
    queryVector:vectorQuery as any,
    numCandidates:50 as number,
    limit:3 as number,
    filter:{repoId:{$eq:repoId as string}}
    }
  },
  {
    $project:{
      _id:1 as number,
      repoId:1 as number,
      path:1 as number,
      code:1 as number,
      score: { $meta: "vectorSearchScore" as string},
    }
  }
])
return result as any
} 
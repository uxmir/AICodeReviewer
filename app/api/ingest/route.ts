import { serve } from "inngest/next";
import { inngest } from "../../../lib/ingest-client";
import { ragPipeline } from "./functions/ragPipeline";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions:[ragPipeline],
});
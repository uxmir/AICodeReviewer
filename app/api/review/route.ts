import { dbConnect } from "@/lib/db";
import reviewModel from "@/models/reviews";
import ApiError from "@/utils/response.error";
export async function GET(req: Request) {
  try {
    await dbConnect();
    //sse stup and api fetching
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        //tracking closing sse
        let isClosed: boolean = false;
        let changeStream: any = null;
        const cleanup = async () => {
          if (isClosed) return;
          isClosed = true;
          try {
            if (changeStream) {
              await changeStream.close();
            }
          } catch (error) {
            // ignore changeStream close error
          } finally {
            try {
              controller.close();
            } catch (error) {
              // ignore if already closed
            }
          }
        };
        //fetching api
        const fetchReviews = async () => {
          if (isClosed) return;
          const response = await reviewModel.find().sort({ createdAt: -1 });
          if (!isClosed) {
            controller.enqueue(
              encoder.encode(`data:${JSON.stringify({ data: response })}\n\n`),
            );
          }
        };
        try {
          //calling apies
          await fetchReviews();
          //watching changes in dbmodel
          changeStream = await reviewModel.watch();
          changeStream.on("change", async () => {
            await fetchReviews();
          });
          //cleanig watching in db after closing tab
          req.signal.addEventListener("abort", async () => {
            await cleanup();
          });
        } catch (error: any) {
          if (!isClosed) {
            controller.enqueue(
              encoder.encode(`data:${JSON.stringify(error?.message)}\n\n`),
            );
          }
          //closing controller
          await cleanup();
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return ApiError.handleResponse(error);
  }
}

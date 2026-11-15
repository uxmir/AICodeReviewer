import { connectOpenAI } from "@/lib/ai";
import reviewModel from "@/models/reviews";

export async function aiAction(similarContext: any, codeContent: string, repoId: string) {
  try {
    // 1. Initially create or update the review record with 'Pending' status
    let reviewDoc = await reviewModel.findOneAndUpdate(
      { repoId },
      { 
        repoId, 
        status: "Pending",
        title: "Generating review..." 
      },
      { upsert: true, new: true }
    );

    // 2. Connect to OpenAI client
    const ai = await connectOpenAI();
    
    // 3. Generate code review and structured summary using AI
    const response = await ai.chat.completions.create({
      model: "gpt-6-luna", // Your configured model name
      messages: [
        {
          role: "system",
          content: `You are an expert senior software engineer. Review the newly pushed code against the existing codebase context. 
          Provide your response in a structured format where the very first line is a short, concise title or summary of the review.`
        },
        {
          role: "user",
          content: `Existing Codebase Context:\n${JSON.stringify(similarContext)}\n\nCode to Review:\n${codeContent}`,
        },
      ],
    });

    const reviewText = response.choices[0]?.message?.content || "No review generated.";
    const extractedTitle = reviewText.split('\n')[0] || "Code Review Summary";
    const finalTitle = extractedTitle.length > 60 ? extractedTitle.substring(0, 60) + "..." : extractedTitle;

    // 5. Update review document with AI response, 'Reviewed' status, and dynamic title
    reviewDoc.aiReview = reviewText;
    reviewDoc.status = "Reviewed";
    reviewDoc.title = finalTitle;
    await reviewDoc.save();

    return reviewDoc;
  } catch (error) {
    console.error("AI Action Failed:", error);

    // 6. Handle failure by setting status to 'Failed' in the database
    await reviewModel.findOneAndUpdate(
      { repoId },
      { 
        status: "Failed",
        title: "Review generation failed",
        aiReview: "Could not generate review due to an error."
      },
      { upsert: true, new: true }
    );

    throw error;
  }
}
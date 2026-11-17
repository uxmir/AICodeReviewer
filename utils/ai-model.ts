import { connectOpenAI } from "@/lib/ai";
import reviewModel from "@/models/reviews";

export async function aiAction(similarContext: any, codeContent: string, repoId: string) {
  const reviewDoc = await reviewModel.create({
    repoId,
    status: "Pending",
    title: "Generating review...",
  });

  try {
    const ai = await connectOpenAI();
    const response = await ai.chat.completions.create({
      model: "gpt-6-luna",
      messages: [
        {
          role: "system",
          content: `You are an expert senior software engineer. Review the newly pushed code against the existing codebase context. 
          Provide your response in a structured format where the very first line is a short, concise title or summary of the review.`,
        },
        {
          role: "user",
          content: `Existing Codebase Context:\n${JSON.stringify(similarContext)}\n\nCode to Review:\n${codeContent}`,
        },
      ],
    });

    const reviewText = response.choices[0]?.message?.content || "No review generated.";
    const extractedTitle = reviewText.split("\n")[0].replace(/^#+\s*/, "") || "Code Review Summary";
    const finalTitle = extractedTitle.length > 60 ? extractedTitle.substring(0, 60) + "..." : extractedTitle;
    reviewDoc.aiReview = reviewText;
    reviewDoc.status = "Reviewed";
    reviewDoc.title = finalTitle;
    await reviewDoc.save();

    return reviewDoc;
  } catch (error) {
    console.error("AI Action Failed:", error);
    reviewDoc.status = "Failed";
    reviewDoc.title = "Review generation failed";
    reviewDoc.aiReview = "Could not generate review due to an error.";
    await reviewDoc.save();

    throw error;
  }
}
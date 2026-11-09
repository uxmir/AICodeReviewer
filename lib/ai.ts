
const API_KEY = process.env.OPENAI_API_KEY;
export const apikeyChecker = () => {
  if (!API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set in the environment variables.");
    throw new Error("OPENAI_API_KEY is missing!");
  }
};
export const checkOpenAI = async () => {
  apikeyChecker(); 
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({
    apiKey: API_KEY,
  });

  if (!client) {
    console.error("Error: Failed to initialize OpenAI client.");
    throw new Error("Failed to initialize OpenAI client.");
  }

  console.log("🟢 OpenAI client initialized successfully.");
  return client;
};
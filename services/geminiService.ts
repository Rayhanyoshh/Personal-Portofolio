import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const refineText = async (text: string, context: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      You are an expert career coach and copywriter helping a user build their portfolio website.
      
      Context: The user is writing for the "${context}" section of their portfolio.
      Current Draft: "${text}"
      
      Task: Rewrite the draft to be more professional, engaging, and impactful. Keep it concise.
      Return ONLY the rewritten text, no explanations.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Return original text on error
  }
};

export const suggestMissingInfo = async (currentData: any): Promise<string> => {
    try {
    const ai = getAIClient();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      Analyze the following JSON data representing a portfolio:
      ${JSON.stringify(currentData)}
      
      The user asked: "What information do I need for my portfolio?"
      
      Based on what is currently empty or weak in the data provided, give a short, bulleted list of specific advice on what they should add next. 
      Respond in Indonesian (Bahasa Indonesia) as requested by the user.
      Keep it encouraging and brief (max 3 points).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || "Unable to generate suggestions.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Silakan lengkapi data diri, pengalaman, dan proyek Anda untuk membuat portofolio yang menarik.";
  }
}
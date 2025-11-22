
import { GoogleGenAI, Type } from "@google/genai";
import { Rarity, DhammaCard } from "../types";

const apiKey = process.env.API_KEY || ""; 

const ai = new GoogleGenAI({ apiKey });

export const generateRandomDhammaCard = async (): Promise<Omit<DhammaCard, 'id' | 'acquiredAt' | 'serialNumber' | 'instanceId' | 'visualVariant'>> => {
  try {
    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model,
      contents: "Generate a unique Thai Buddhist Dhamma vocabulary card. The term must be in Thai. Provide a meaning, a category (e.g., ศีล, สมาธิ, ปัญญา, อิทธิบาท 4), a short teaching or quote related to it, a detailed explanation, and a rarity tier.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING, description: "The Dhamma term in Thai (e.g., อริยสัจ 4, สติ)" },
            meaning: { type: Type.STRING, description: "Short definition in Thai" },
            category: { type: Type.STRING, description: "Category of Dhamma (e.g. ศีล, สมาธิ, ปัญญา)" },
            teaching: { type: Type.STRING, description: "A short inspiring quote, proverb, or key concept related to the term in Thai" },
            details: { type: Type.STRING, description: "Practical explanation or context in Thai, about 2-3 sentences" },
            rarity: { 
              type: Type.STRING, 
              enum: [Rarity.COMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY] 
            },
          },
          required: ["term", "meaning", "category", "teaching", "details", "rarity"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");

    // Fallback if parsing fails
    if (!data.term) {
      throw new Error("Failed to generate valid card data");
    }

    return {
      term: data.term,
      meaning: data.meaning,
      details: data.details,
      category: data.category || "ทั่วไป",
      teaching: data.teaching || data.meaning,
      rarity: data.rarity as Rarity,
    };

  } catch (error) {
    console.error("Error generating card:", error);
    // Fallback card in case of API failure
    return {
      term: "อภัยทาน",
      meaning: "การให้หมวดอภัย",
      category: "ทาน",
      teaching: "การให้อภัยเป็นทานอันสูงสุด ชนะความโกรธด้วยความไม่โกรธ",
      details: "ระบบขัดข้องชั่วคราว แต่น้ำใจไมตรีจิตยังคงอยู่ ลองใหม่อีกครั้ง",
      rarity: Rarity.COMMON,
    };
  }
};

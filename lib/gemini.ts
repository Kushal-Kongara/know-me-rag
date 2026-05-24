import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
}

export const ai = new GoogleGenAI({
    apiKey,
});

export async function createEmbedding(text: string): Promise<number[]> {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: {
            outputDimensionality: 1536,
        },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
        throw new Error("Failed to create embedding");
    }

    return embedding;
}

export async function generateAnswer(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const text = response.text;

    if (!text) {
        throw new Error("Failed to generate answer");
    }

    return text;
}
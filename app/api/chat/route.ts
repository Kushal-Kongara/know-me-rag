import { NextRequest, NextResponse } from "next/server";
import { createEmbedding, generateAnswer } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase";

type MatchDocument = {
    id: number;
    content: string;
    metadata: {
        source?: string;
        chunkIndex?: number;
    } | null;
    similarity: number;
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const question = body.question;

        if (!question || typeof question !== "string") {
            return NextResponse.json(
                { error: "Question is required" },
                { status: 400 }
            );
        }

        const questionEmbedding = await createEmbedding(question);

        const { data, error } = await supabaseAdmin.rpc("match_documents", {
            query_embedding: questionEmbedding,
            match_count: 5,
        });

        if (error) {
            return NextResponse.json(
                { error: `Failed to retrieve documents: ${error.message}` },
                { status: 500 }
            );
        }

        const matches = (data ?? []) as MatchDocument[];

        const context = matches
            .map((match, index) => {
                return `Source ${index + 1}:\n${match.content}`;
            })
            .join("\n\n---\n\n");

        const prompt = `
You are Know Me AI, a portfolio assistant for Kushal Kongara.

Answer the user's question using ONLY the context below.

Rules:
- If the answer is not in the context, say: "I don't have that information in my current knowledge base."
- Do not invent experience, companies, projects, dates, or achievements.
- Keep answers clear, direct, and professional.
- Use first person when answering as Kushal.
- Mention that the answer is based on the provided portfolio knowledge when helpful.

Context:
${context}

User question:
${question}
`;

        const answer = await generateAnswer(prompt);

        return NextResponse.json({
            answer,
            sources: matches.map((match) => ({
                content: match.content,
                metadata: match.metadata,
                similarity: match.similarity,
            })),
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
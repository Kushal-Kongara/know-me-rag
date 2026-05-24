import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

function chunkText(text: string, maxChunkSize = 800): string[] {
    const sections = text
        .split(/\n(?=# )|\n(?=## )/)
        .map((section) => section.trim())
        .filter(Boolean);

    const chunks: string[] = [];

    for (const section of sections) {
        if (section.length <= maxChunkSize) {
            chunks.push(section);
            continue;
        }

        const paragraphs = section
            .split("\n\n")
            .map((paragraph) => paragraph.trim())
            .filter(Boolean);

        let currentChunk = "";

        for (const paragraph of paragraphs) {
            if ((currentChunk + "\n\n" + paragraph).length > maxChunkSize) {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = paragraph;
            } else {
                currentChunk += currentChunk ? "\n\n" + paragraph : paragraph;
            }
        }

        if (currentChunk) chunks.push(currentChunk.trim());
    }

    return chunks;
}

async function main() {
    const { createEmbedding } = await import("../lib/gemini");
    const { supabaseAdmin } = await import("../lib/supabase");

    const filePath = path.join(process.cwd(), "data", "about-me.md");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const chunks = chunkText(fileContent);

    console.log(`Found ${chunks.length} chunks`);

    const { error: deleteError } = await supabaseAdmin
        .from("documents")
        .delete()
        .neq("id", 0);

    if (deleteError) {
        throw new Error(`Failed to clear old documents: ${deleteError.message}`);
    }

    for (const [index, chunk] of chunks.entries()) {
        console.log(`Embedding chunk ${index + 1}/${chunks.length}`);

        const embedding = await createEmbedding(chunk);

        const { error } = await supabaseAdmin.from("documents").insert({
            content: chunk,
            metadata: {
                source: "about-me.md",
                chunkIndex: index,
            },
            embedding,
        });

        if (error) {
            throw new Error(`Failed to insert chunk ${index}: ${error.message}`);
        }
    }

    console.log("Ingestion complete");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
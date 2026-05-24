# Know Me RAG

Know Me RAG is an AI-powered portfolio assistant that answers questions about my projects, skills, experience, hackathons, and AI work using Retrieval-Augmented Generation.

Instead of relying only on the model's memory, the app retrieves relevant information from my own portfolio knowledge base and uses that context to generate grounded answers.

## Live Demo

Coming soon.

## What This Project Does

Users can ask questions like:

- What projects has Kushal built?
- What is Kushal's AI experience?
- What did Kushal build at Oatmeal AI?
- What hackathons has Kushal done?
- What is Kushal's tech stack?

The system retrieves relevant chunks from my knowledge base and generates an answer using Gemini.

## RAG Architecture

```text
Markdown Knowledge Base
        ↓
Text Chunking
        ↓
Gemini Embeddings
        ↓
Supabase pgvector
        ↓
Semantic Retrieval
        ↓
Gemini Answer Generation
        ↓
Grounded Response + Sources

Tech Stack
Next.js
TypeScript
Tailwind CSS
Gemini API
Supabase
PostgreSQL
pgvector
Core RAG Flow
Portfolio knowledge is stored in data/about-me.md.
The ingestion script splits the markdown file into smaller chunks.
Each chunk is converted into a Gemini embedding.
Chunks and embeddings are stored in Supabase pgvector.
When a user asks a question, the question is embedded.
Supabase retrieves the most semantically similar chunks.
Gemini generates an answer using only the retrieved context.
The UI displays the answer and retrieved source chunks.
Key Features
Portfolio chatbot interface
Gemini-powered embeddings
Supabase pgvector semantic search
Source chunk display
Similarity score display
Retrieval quality threshold
Markdown-based knowledge source
Free-friendly AI stack
Why I Built This

I built this project to understand how RAG systems work end-to-end.

The goal was not just to build another chatbot, but to learn the full pipeline: knowledge source preparation, chunking, embeddings, vector storage, retrieval, context injection, and grounded answer generation.

Local Setup

Clone the repo:

git clone https://github.com/YOUR_USERNAME/know-me-rag.git
cd know-me-rag

Install dependencies:

npm install

Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=

Run ingestion:

npm run ingest

Start the development server:

npm run dev

Open:

http://localhost:3000
Important Note

The app only knows information that exists in the markdown knowledge base. If something is not included in the source file, the assistant should not invent it.


Important: replace this line:

```md
git clone https://github.com/YOUR_USERNAME/know-me-rag.git

with your real GitHub repo URL.
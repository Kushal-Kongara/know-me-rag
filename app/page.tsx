"use client";

import { useState } from "react";

type Source = {
  content: string;
  metadata: {
    source?: string;
    chunkIndex?: number;
  } | null;
  similarity: number;
};

type ChatResponse = {
  answer: string;
  sources: Source[];
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (!question.trim()) return;

    setIsLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get answer");
      }

      const result = data as ChatResponse;
      setAnswer(result.answer);
      setSources(result.sources || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const sampleQuestions = [
    "What projects has Kushal built?",
    "What is Kushal's AI experience?",
    "What did Kushal build at Oatmeal AI?",
    "What hackathons has Kushal done?",
    "What is Kushal's tech stack?",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            Know Me AI
          </p>

          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
            Ask my portfolio anything.
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            This is a RAG-powered portfolio assistant. It answers questions
            about my projects, skills, experience, hackathons, and AI work using
            my own knowledge base.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask something like: What AI projects has Kushal built?"
            className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-slate-900 p-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleAsk}
              disabled={isLoading || !question.trim()}
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Thinking..." : "Ask Know Me AI"}
            </button>

            <p className="text-sm text-slate-400">
              Powered by Gemini + Supabase pgvector
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {sampleQuestions.map((sample) => (
            <button
              key={sample}
              onClick={() => setQuestion(sample)}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              {sample}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-3 text-xl font-semibold">Answer</h2>
            <p className="whitespace-pre-wrap leading-8 text-slate-200">
              {answer}
            </p>
          </div>
        )}

        {sources.length > 0 && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold">Retrieved Sources</h2>

            <div className="space-y-4">
              {sources.slice(0, 3).map((source, index) => (
                <div
                  key={`${source.metadata?.chunkIndex}-${index}`}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-cyan-300">
                      Source {index + 1}
                    </p>
                    <p className="text-xs text-slate-500">
                      Similarity: {source.similarity.toFixed(3)}
                    </p>
                  </div>

                  <p className="line-clamp-4 text-sm leading-6 text-slate-400">
                    {source.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
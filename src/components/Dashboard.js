import { useState } from "react";
import { generate } from "../services/ollama";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      setOutput(await generate(prompt));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <label htmlFor="prompt" className="block text-sm font-medium text-slate-700">
        What should Qwen write?
      </label>
      <textarea
        id="prompt"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleGenerate();
        }}
        placeholder="Write a product description for a bamboo desk lamp…"
        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
        <span className="text-xs text-slate-500">Ctrl/⌘ + Enter to run</span>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {(output || loading) && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          {loading ? (
            <p className="animate-pulse text-sm text-slate-500">Waiting for Qwen…</p>
          ) : (
            <>
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">{output}</pre>
              <button
                onClick={() => navigator.clipboard?.writeText(output)}
                className="mt-3 text-xs font-medium text-indigo-600 hover:underline"
              >
                Copy text
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}

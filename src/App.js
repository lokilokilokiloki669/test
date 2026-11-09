import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import { getConfig, saveConfig, ping } from "./services/ollama";

const TABS = ["Content generator", "Chatbot"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [host, setHost] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState({ ok: null, text: "" });

  useEffect(() => {
    const c = getConfig();
    setHost(c.host);
    setModel(c.model);
  }, []);

  async function save() {
    saveConfig({ host, model });
    setStatus({ ok: null, text: "Checking…" });
    try {
      const models = await ping();
      setStatus({ ok: true, text: `Connected. Models: ${models.join(", ") || "none pulled yet"}` });
    } catch (e) {
      setStatus({ ok: false, text: e.message });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Local Qwen dashboard</h1>
        <button
          onClick={() => setShowSettings((s) => !s)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-white"
          aria-expanded={showSettings}
        >
          Connection
        </button>
      </header>

      {showSettings && (
        <div className="mb-6 space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <div>
            <label htmlFor="host" className="block text-sm font-medium">Ollama host</label>
            <input
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="http://localhost:11434 or https://your-tunnel-url"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium">Model</label>
            <input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={save} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Save and test
            </button>
            {status.text && (
              <span className={`text-sm ${status.ok === false ? "text-red-600" : status.ok ? "text-green-700" : "text-slate-500"}`}>
                {status.text}
              </span>
            )}
          </div>
        </div>
      )}

      <nav className="mb-4 flex gap-1 border-b border-slate-200" role="tablist">
        {TABS.map((t, i) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === i ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === 0 ? <Dashboard /> : <Chat />}
    </main>
  );
}

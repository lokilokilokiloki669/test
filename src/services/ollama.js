import axios from "axios";

const DEFAULT_HOST = process.env.NEXT_PUBLIC_OLLAMA_HOST || "http://localhost:11434";
const DEFAULT_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || "qwen2.5:7b";

const HEADERS = {
  "Content-Type": "application/json",
  // Lets ngrok skip its browser warning page; harmless elsewhere.
  "ngrok-skip-browser-warning": "true",
};

// Runtime overrides (set from the Connection panel) win over env vars.
export function getConfig() {
  if (typeof window === "undefined") return { host: DEFAULT_HOST, model: DEFAULT_MODEL };
  try {
    return {
      host: (localStorage.getItem("ollama_host") || DEFAULT_HOST).replace(/\/+$/, ""),
      model: localStorage.getItem("ollama_model") || DEFAULT_MODEL,
    };
  } catch {
    return { host: DEFAULT_HOST, model: DEFAULT_MODEL };
  }
}

export function saveConfig({ host, model }) {
  try {
    localStorage.setItem("ollama_host", host.trim());
    localStorage.setItem("ollama_model", model.trim());
  } catch {}
}

function toMessage(err) {
  if (err.code === "ECONNABORTED") return "The request timed out. The model may still be loading. Try again.";
  if (err.response) {
    const detail = err.response.data?.error || err.response.statusText;
    return `Ollama returned ${err.response.status}: ${detail}`;
  }
  return "Cannot reach Ollama. Check that it is running, the host URL is correct, and OLLAMA_ORIGINS allows this site.";
}

// Single-prompt generation -> /api/generate
export async function generate(prompt) {
  const { host, model } = getConfig();
  try {
    const { data } = await axios.post(
      `${host}/api/generate`,
      { model, prompt, stream: false },
      { timeout: 120000, headers: HEADERS }
    );
    return data.response;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

// Multi-turn chat -> /api/chat. messages = [{ role, content }, ...]
export async function chat(messages) {
  const { host, model } = getConfig();
  try {
    const { data } = await axios.post(
      `${host}/api/chat`,
      { model, messages, stream: false },
      { timeout: 120000, headers: HEADERS }
    );
    return data.message; // { role: "assistant", content: "..." }
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

// Connectivity check -> /api/tags (also lists pulled models)
export async function ping() {
  const { host } = getConfig();
  try {
    const { data } = await axios.get(`${host}/api/tags`, { timeout: 5000, headers: HEADERS });
    return data.models?.map((m) => m.name) ?? [];
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

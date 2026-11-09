# ai-ollama

Next.js dashboard + chat UI for a local Ollama (Qwen) instance. Deploys to Vercel as-is.

## Deploy
1. Push this folder's contents to the root of a GitHub repo.
2. On vercel.com: Add New > Project > import the repo > Deploy (Next.js is auto-detected).
3. Optional: set `NEXT_PUBLIC_OLLAMA_HOST` / `NEXT_PUBLIC_OLLAMA_MODEL` in Vercel env vars, or just use the in-app "Connection" panel.

## Run Ollama
    ollama pull qwen2.5:7b
    OLLAMA_ORIGINS="https://your-app.vercel.app,http://localhost:3000" ollama serve

## Reach it from Vercel (tunnel)
    cloudflared tunnel --url http://localhost:11434 --http-host-header localhost:11434
    # or: ngrok http 11434 --host-header="localhost:11434"
Paste the https URL into the app's "Connection" panel.

## Local dev
    npm install && npm run dev

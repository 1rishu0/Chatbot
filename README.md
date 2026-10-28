# ChatBot / AI Assistant

A full-stack AI chat assistant that runs entirely on your own machine. A React frontend talks to a Django REST backend, which runs a LangGraph agent powered by a local LLM through Ollama.

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React (Vite), axios, react-markdown             |
| Backend  | Python, Django, Django REST Framework           |
| Agent    | LangGraph + LangChain                           |
| LLM      | Ollama (default model: `llama3.1`)              |
| Tooling  | `uv` (Python environments), Docker Compose      |

## Features

- Multiple conversations with a sidebar (create, switch, delete)
- Conversation history sent to the agent on every message, so it keeps context
- Auto-generated conversation titles
- Markdown rendering for assistant replies
- Backend-offline indicator
- Switchable LLM provider (Ollama locally, Groq optionally) via environment variable

## Project Structure

```
ChatBot/
├── Backend/
│   ├── config/            # Django project settings and URLs
│   ├── chat/              # Models, serializers, views, URLs
│   │   └── agent/         # LangGraph graph and runner
│   ├── Dockerfile
│   ├── manage.py
│   └── pyproject.toml
├── Frontend/
│   ├── src/
│   │   ├── api/           # axios client and endpoint functions
│   │   └── components/    # Sidebar, ChatWindow, MessageBubble, MessageInput
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Quick Start (Docker)

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone https://github.com/1rishu0/Chatbot
cd ChatBot
docker compose up --build
```

In a second terminal, pull the model once (about 4-5 GB):

```bash
docker compose exec ollama ollama pull llama3.1
```

Then open **http://localhost:5173**.

Useful commands:

```bash
docker compose up -d             # run in the background
docker compose logs -f backend   # follow backend logs
docker compose down              # stop (data is kept)
docker compose down -v           # stop and delete all data and models
```

> Ollama in Docker runs on CPU by default, so replies can be slow. NVIDIA users can enable GPU passthrough in `docker-compose.yml`; others can run Ollama natively and point `OLLAMA_BASE_URL` at `http://host.docker.internal:11434`.

## Manual Setup (without Docker)

**Requirements:** Python 3.12+, [uv](https://docs.astral.sh/uv/), Node.js 20+, [Ollama](https://ollama.com/download)

### 1. Ollama

```bash
ollama pull llama3.1
ollama serve
```

### 2. Backend

```bash
cd Backend
cp .env.example .env        # on Windows: copy .env.example .env
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
```

The API is now at http://127.0.0.1:8000/api/.

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Configuration

Backend environment variables (see `Backend/.env.example`):

| Variable          | Default                   | Description                          |
|-------------------|---------------------------|--------------------------------------|
| `LLM_PROVIDER`    | `ollama`                  | `ollama` or `groq`                   |
| `OLLAMA_MODEL`    | `llama3.1`                | Model name pulled in Ollama          |
| `OLLAMA_BASE_URL` | `http://localhost:11434`  | Where the Ollama server is reachable |
| `GROQ_API_KEY`    | none                      | Required only when using Groq        |
| `GROQ_MODEL`      | `llama-3.1-8b-instant`    | Groq model name                      |

Frontend environment variable:

| Variable            | Default                      | Description          |
|---------------------|------------------------------|----------------------|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api`  | Backend API base URL |

## API Reference

| Method | Endpoint                                 | Description                       |
|--------|------------------------------------------|-----------------------------------|
| GET    | `/api/health/`                           | Health check                      |
| GET    | `/api/conversations/`                    | List conversations                |
| POST   | `/api/conversations/`                    | Create a conversation             |
| GET    | `/api/conversations/{id}/`               | Get a conversation with messages  |
| PATCH  | `/api/conversations/{id}/`               | Rename a conversation             |
| DELETE | `/api/conversations/{id}/`               | Delete a conversation             |
| POST   | `/api/conversations/{id}/send_message/`  | Send a message, get the reply     |

Example:

```bash
curl -X POST http://127.0.0.1:8000/api/conversations/<id>/send_message/ \
  -H "Content-Type: application/json" \
  -d '{"content": "What is LangGraph in one sentence?"}'
```

## Troubleshooting

- **"Could not reach the local model"**: make sure Ollama is running and the model is pulled (`ollama list`).
- **Frontend shows "Backend unreachable"**: check that Django is running and that `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`.
- **Slow replies**: local models on CPU are slow; try a smaller model (for example `llama3.2:3b`) and set `OLLAMA_MODEL` accordingly.

## Roadmap

- Tools for the agent (calculator, web search, document lookup)
- Streaming replies
- User authentication

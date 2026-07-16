# LooksMax AI

AI-powered facial attractiveness & looksmaxxing analysis platform. Upload a photo or use your
webcam to receive a comprehensive, structured report on facial features, symmetry, harmony, and
personalized improvement suggestions — powered by multimodal LLM vision models with automatic
provider failover.

> **Note:** All scores and recommendations are AI-generated aesthetic opinions, not scientific
> measurements. Images are processed for analysis only and are never stored.

---

## Features

- **Image Upload & Live Camera** — JPEG/PNG/WebP, drag-and-drop, or `getUserMedia` with mirror preview, countdown, and front/back camera switch.
- **Client-side Compression** — Canvas resizes to 1024px longest edge at 0.9 quality (JPEG), strips metadata before upload.
- **Provider-Agnostic Backend** — Gemini (primary) → Ollama Cloud → NVIDIA NIM failover with zero user interruption.
- **Robust LLM Parsing** — Markdown-stripping regex + Zod validation on every response.
- **Rich Dashboard** — Score rings, Recharts radar & bar charts, expandable recommendations, skincare routines, hair/beard/glasses suggestions, JSON export.
- **Privacy First** — No database, no auth, no stored images. Server-controlled prompts prevent prompt injection from image metadata.
- **Modern UI** — Next.js 15 App Router, TailwindCSS, Framer Motion, Sonner toasts, Zustand state.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| UI | shadcn-style components, Lucide icons |
| Animation | Framer Motion |
| Charts | Recharts |
| State | Zustand |
| Validation | Zod |
| Notifications | Sonner |
| Hosting | Vercel |

---

## Folder Structure

```
.
├── app/
│   ├── api/
│   │   ├── analyze/route.ts        # POST analysis endpoint (Edge runtime)
│   │   └── providers/route.ts      # GET provider health statuses (Edge runtime)
│   ├── analyze/page.tsx            # Upload / camera / results page
│   ├── layout.tsx                  # Root layout + Sonner Toaster
│   ├── page.tsx                    # Homepage (hero, features, FAQ, footer)
│   └── globals.css                 # Tailwind + theme tokens
├── components/
│   ├── ui/                         # button.tsx, card.tsx, progress.tsx
│   ├── input/                      # upload-card, camera-card, analyze-button
│   └── analysis/                   # dashboard, score-cards, charts-section, recommendations
├── lib/
│   ├── schemas.ts                  # Zod AnalysisResult schema
│   └── index.ts                    # cn(), JSON extraction, formatters
├── providers/
│   ├── types.ts                    # VisionProvider interface
│   ├── gemini.ts                   # GeminiProvider + ProviderError
│   ├── ollama.ts                   # OllamaProvider
│   ├── nvidia.ts                   # NvidiaProvider
│   ├── router.ts                   # ProviderRouter (array-based failover)
│   └── index.ts
├── prompt/
│   └── analysis.ts                 # Server-controlled analysis prompt
├── hooks/
│   ├── store.ts                    # Zustand store
│   ├── useCamera.ts                # getUserMedia + capture
│   └── useImageCompression.ts      # Canvas compression
├── types/
│   └── index.ts                    # AnalysisResult, ProviderStatus, UploadState
├── .env.example
└── README.md
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in at least one provider key.

```bash
# Gemini (Primary — recommended)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

# Ollama Cloud (Fallback)
OLLAMA_API_KEY=
OLLAMA_BASE_URL=https://ollama.com/v1
OLLAMA_MODEL=minimax-m3

# NVIDIA NIM (Final fallback)
NVIDIA_API_KEY=
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=nvidia/nemotron-3-nano-omni-30b-a3b-reasoning

# Provider order (comma-separated fallback priority)
AI_PROVIDER_ORDER=gemini,ollama,nvidia
```

If a provider's API key is missing, it is skipped automatically. If all configured providers
fail (quota, rate-limit, server error), the router returns a friendly error — the user never
sees raw provider messages.

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local   # then edit with your keys

# Run dev server
npm run dev

# Build
npm run build

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Reference

### `POST /api/analyze`

Analyzes an uploaded image.

**Request** — `multipart/form-data`:
| Field | Type | Notes |
|-------|------|-------|
| `image` | File | JPEG/PNG/WebP, max 15MB |

**Response (200)**:
```json
{
  "success": true,
  "result": { /* AnalysisResult (see schema) */ },
  "provider": "gemini"
}
```

**Errors**:
| Status | Body | Reason |
|--------|------|--------|
| 400 | `{ "error": "..." }` | Invalid type, oversized, or missing image |
| 500 | `{ "error": "..." }` | All providers unavailable |

### `GET /api/providers`

Returns health status of each configured provider.

**Response (200)**:
```json
{
  "statuses": [
    { "provider": "gemini", "available": true, "latency": 412, "lastChecked": 1718382000000 }
  ]
}
```

---

## JSON Schema (AnalysisResult)

All provider responses are normalized into this single internal schema before being sent to the
client and validated with Zod (`lib/schemas.ts`). Top-level fields include:

- `overall_score`, `potential_score` (1–10)
- `facial_symmetry`, `jawline`, `eyes`, `nose`, `lips`, `skin`, `hair`, `eyebrows`,
  `facial_harmony`, `golden_ratio`, `masculinity`, `femininity` (each with `score` + attributes)
- `estimated_age`
- `strengths`, `weaknesses` (string[])
- `first_impression` (string)
- `looksmaxxing` (categories with `suggestions`, `difficulty`, `impact`)
- `hairstyles`, `beard_styles`, `glasses`, `skin_care`, `fitness` (typed arrays)
- `confidence` (0–100)

---

## Prompt Injection Protection

- The analysis prompt is **always** constructed server-side in `prompt/analysis.ts`.
- User-provided text or image EXIF/metadata is **never** sent to or read by the model.
- The server validates MIME type and payload size before processing.
- The LLM response is stripped of markdown fences and conversational text before Zod parsing.

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. In Vercel, import the repository.
3. Add the environment variables from `.env.example` in **Project Settings → Environment Variables**.
4. Deploy. The Edge runtime route handlers need no extra config.

> **Note:** The `/api/analyze` and `/api/providers` routes use `export const runtime = "edge"`
> and rely only on Web-standard APIs (`fetch`, `Request`, `Response`, `FormData`, `Blob`), so
> they are compatible with Edge, Node, and Serverless runtimes.

---

## Ethical Guidelines

- Output is framed as AI-generated aesthetic opinion, not objective fact.
- No demeaning, discriminatory, or harmful language.
- Interventions distinguish well-supported advice (skincare, grooming, sleep, photography)
  from ideas with limited evidence (e.g., jaw exercises are explicitly flagged).
- No NSFW detection bypass, no face recognition, no identity matching.

---

## Future Roadmap

Progress tracking, accounts, multi-photo averaging, side-profile analysis, body analysis,
celebrity comparisons, personalized weekly routines, AI coach, before/after timelines, and a
premium API tier.

---

## License

MIT

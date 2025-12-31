# Franklin OS - Visual Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Franklin OS                               │
│                   AI Operating System                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Hero    │  │Workbench │  │ Hybrid   │  │ Pricing  │       │
│  │  Page    │→ │Dashboard │→ │ Agents   │→ │Dashboard │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│       ↓             ↓              ↓              ↓             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Academy  │  │Integration│ │AI Center │  │  Deploy  │       │
│  │ Learning │  │   Hub     │  │          │  │  Wizard  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                          │ REST API
┌──────────────────────────┴───────────────────────────────────────┐
│                    Backend (FastAPI)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │   Oracle       │  │  Local LLM     │  │  File Chunking │   │
│  │   Analyzer     │  │  Orchestrator  │  │  Engine        │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │   Export       │  │   Billing      │  │  Knowledge     │   │
│  │   Engine       │  │   System       │  │  Base          │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                          │
┌──────────────────────────┴───────────────────────────────────────┐
│                    AI Provider Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │OpenAI│  │Claude│  │Gemini│  │Stable│  │Llama │  │Mistral│  │
│  │GPT-4 │  │  3   │  │ Pro  │  │  AI  │  │  3   │  │  7B   │  │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  │
│   Cloud      Cloud     Cloud     Cloud     Local     Local     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## User Journey

```
Start
  │
  ├─> 1. Hero Page
  │     - See system status
  │     - View metrics
  │     - Choose action
  │
  ├─> 2. Workbench Dashboard (NEW!)
  │     ├─> Upload files (up to 500MB)
  │     ├─> Write prompts
  │     ├─> Get cost estimate (Oracle)
  │     ├─> Execute task
  │     └─> Export (9 formats)
  │
  ├─> 3. Hybrid Agent Creator (NEW!)
  │     ├─> Select AI providers
  │     ├─> Adjust weights
  │     ├─> Choose collaboration mode
  │     └─> Save hybrid agent
  │
  ├─> 4. Academy
  │     ├─> Browse knowledge base
  │     ├─> Add learnings
  │     ├─> Search topics
  │     └─> View agent progress
  │
  └─> 5. Pricing Dashboard (NEW!)
        ├─> View usage
        ├─> Check costs
        ├─> Get estimates
        └─> Manage billing
```

## Data Flow

```
┌─────────────┐
│    User     │
│   Prompt    │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│     Oracle       │ ← Analyze complexity
│   Analyzer       │   Calculate cost
└──────┬───────────┘   Estimate time
       │
       ↓
┌──────────────────┐
│  User Approval   │ ← Show estimate
│  (Accept/Reject) │   Get confirmation
└──────┬───────────┘
       │
       ↓ [Approved]
┌──────────────────┐
│   AI Provider    │
│   Selection      │
├──────────────────┤
│ • OpenAI         │
│ • Anthropic      │
│ • Google         │
│ • Stability AI   │
│ • Local Llama    │ ← Fallback if APIs fail
│ • Local Mistral  │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│   Processing     │
│   (Streaming)    │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│    Response      │
└──────┬───────────┘
       │
       ├─> Save to Project
       ├─> Add to Knowledge Base
       ├─> Create Billing Transaction
       └─> Export (if requested)
           ├─> Excel
           ├─> Word
           ├─> PowerPoint
           ├─> Google Docs
           ├─> Notion
           ├─> Audio (TTS)
           └─> Image
```

## File Upload & Chunking Flow

```
Large File (500MB)
       │
       ↓
┌──────────────────┐
│  Upload Start    │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│  Chunk File      │
│  (10MB chunks)   │
└──────┬───────────┘
       │
       ├─> Chunk 1 ────┐
       ├─> Chunk 2 ────┤
       ├─> Chunk 3 ────┤ Process in parallel
       ├─> ...  ────────┤
       └─> Chunk N ────┘
                │
                ↓
         ┌──────────────┐
         │   Reassemble │
         │    Results   │
         └──────┬───────┘
                │
                ↓
         ┌──────────────┐
         │    Output    │
         └──────────────┘
```

## Hybrid Agent Workflow

```
Task: "Analyze contract and create summary"
       │
       ↓
┌──────────────────────────────────────┐
│      Hybrid Agent Configuration      │
├──────────────────────────────────────┤
│  GPT-4:     60% (General Analysis)   │
│  Claude:    30% (Legal Reasoning)    │
│  Gemini:    10% (Visual Elements)    │
└──────────────────┬───────────────────┘
       │
       ↓ [Mode: Parallel]
       │
   ┌───┴────┬────────┬────────┐
   │        │        │        │
   ↓        ↓        ↓        ↓
┌──────┐┌──────┐┌──────┐┌────────┐
│GPT-4 ││Claude││Gemini││ Weight │
│60%   ││30%   ││10%   ││ Merge  │
└───┬──┘└───┬──┘└───┬──┘└────┬───┘
    │       │       │         │
    └───────┴───────┴─────────┘
                │
                ↓
         ┌──────────────┐
         │    Final     │
         │   Response   │
         └──────────────┘
```

## Monetization Flow

```
User Request
     │
     ↓
┌─────────────┐
│   Is Chat?  │─ Yes ─> FREE (No charge)
└──────┬──────┘
       │ No (Task)
       ↓
┌─────────────────┐
│ Oracle Analysis │
│  Complexity:    │
│  • Length       │
│  • Code         │
│  • Data         │
│  • Creative     │
│  • Multi-step   │
└──────┬──────────┘
       │
       ↓
┌─────────────────┐
│ Cost Estimate   │
│  Per Provider:  │
│  • OpenAI: $X   │
│  • Claude: $Y   │
│  • Google: $Z   │
│  • Local: $0    │
└──────┬──────────┘
       │
       ↓
┌─────────────────┐
│ User Approval   │
└──────┬──────────┘
       │ Approved
       ↓
┌─────────────────┐
│ Execute Task    │
└──────┬──────────┘
       │
       ↓
┌─────────────────┐
│ Bill User       │
│ • Create Txn    │
│ • Update Usage  │
│ • Save Breakdown│
└─────────────────┘
```

## Export System

```
AI Response
     │
     ↓
┌────────────────────┐
│  Export Request    │
└─────────┬──────────┘
          │
     ┌────┴────┬────────┬────────┬────────┬─────────┐
     │         │        │        │        │         │
     ↓         ↓        ↓        ↓        ↓         ↓
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │Excel │ │ Word │ │PowerPt││Google│ │Notion│ │Audio │
  │.xlsx │ │.docx │ │.pptx │ │Docs  │ │.md   │ │.mp3  │
  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
     │         │        │        │        │         │
     └─────────┴────────┴────────┴────────┴─────────┘
                        │
                        ↓
                 ┌──────────────┐
                 │   Download   │
                 └──────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────┐
│          Frontend Layer             │
├─────────────────────────────────────┤
│ • React 18                          │
│ • TypeScript                        │
│ • Vite (Build Tool)                 │
│ • TailwindCSS                       │
│ • shadcn/ui Components              │
│ • Lucide Icons                      │
│ • TanStack Query                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│          Backend Layer              │
├─────────────────────────────────────┤
│ • FastAPI                           │
│ • Python 3.12+                      │
│ • SQLModel (ORM)                    │
│ • Pydantic (Validation)             │
│ • httpx (HTTP Client)               │
│ • PyJWT (Authentication)            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│          Database Layer             │
├─────────────────────────────────────┤
│ • PostgreSQL (Production)           │
│ • SQLite (Development)              │
│ • 12 Database Models                │
│ • Indexed Queries                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        AI Provider Layer            │
├─────────────────────────────────────┤
│ • OpenAI SDK                        │
│ • Anthropic SDK                     │
│ • Google Generative AI              │
│ • Stability AI                      │
│ • llama-cpp-python                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        Export Libraries             │
├─────────────────────────────────────┤
│ • openpyxl (Excel)                  │
│ • python-docx (Word)                │
│ • python-pptx (PowerPoint)          │
│ • Pillow (Images)                   │
│ • Google TTS (Audio)                │
└─────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────┐
│         Security Layers             │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │   JWT Authentication        │   │
│  │   (Token-based)             │   │
│  └─────────────────────────────┘   │
│               ↓                     │
│  ┌─────────────────────────────┐   │
│  │   CORS Protection           │   │
│  │   (Allowed Origins)         │   │
│  └─────────────────────────────┘   │
│               ↓                     │
│  ┌─────────────────────────────┐   │
│  │   Input Validation          │   │
│  │   (Pydantic Models)         │   │
│  └─────────────────────────────┘   │
│               ↓                     │
│  ┌─────────────────────────────┐   │
│  │   Rate Limiting             │   │
│  │   (Provider Semaphores)     │   │
│  └─────────────────────────────┘   │
│               ↓                     │
│  ┌─────────────────────────────┐   │
│  │   Audit Logging             │   │
│  │   (All Transactions)        │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

**Franklin OS**: Complete AI Operating System Architecture

Built for transparency, sovereignty, and intelligent automation.

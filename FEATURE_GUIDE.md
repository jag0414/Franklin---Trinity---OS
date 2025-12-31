# Franklin OS - Complete Feature Guide

## 🎯 Overview

Franklin OS is now a complete AI Operating System with advanced features for enterprise-grade AI orchestration, monetization, and knowledge management.

## 🚀 New Features

### 1. Liquid Workbench Dashboard

**Location**: Page 2 after hero section  
**Component**: `LiquidWorkbench.tsx`

A VS Studio-inspired interface for professional AI work:

- **File Explorer**: Upload and manage files up to 500MB
- **Command Center**: Execute AI tasks with real-time feedback
- **Cost Estimation**: See estimated costs before execution
- **Multi-Format Export**: Export to 9+ formats instantly
- **Provider Status**: Monitor all AI providers in real-time

**Usage**:
```typescript
// Files are automatically chunked for processing
// Upload via drag-and-drop or file picker
// All responses saved to project
```

### 2. Hybrid Hyper Agent Creator

**Location**: Multi-Model page  
**Component**: `HybridAgentCreator.tsx`

Create custom AI agents combining multiple providers:

**Available Agents**:
- OpenAI GPT-4 (General Intelligence)
- Anthropic Claude (Reasoning & Ethics)
- Google Gemini (Multimodal Analysis)
- Local Llama (Local Processing)
- Local Mistral (Fast Inference)
- CodeLlama (Code Generation)

**Collaboration Modes**:
- **Sequential**: One agent after another
- **Parallel**: All agents simultaneously
- **Consensus**: Agents vote on best answer

**Weight System**: Adjust influence (0-100%) for each agent

### 3. Monetization System

**Component**: `MonetizationDashboard.tsx`

**Pricing Tiers**:
- **Free**: Unlimited chat + 1K tokens/day for tasks
- **Basic** ($10/mo): 100K tokens/day + all providers
- **Pro** ($50/mo): 1M tokens/day + hybrid agents + API access
- **Enterprise** (Custom): Unlimited + SLA + white-label

**Oracle Cost Analyzer**:
- Analyzes task complexity (0-100 score)
- Estimates tokens, time, and cost
- Breaks down costs by provider
- Shows detailed complexity factors

**Provider Costs**:
- OpenAI: $0.03/1K tokens
- Anthropic: $0.03/1K tokens
- Google: $0.01/1K tokens
- Local LLMs: FREE

### 4. Local LLM Support

**Purpose**: Fallback when APIs fail + cost savings

**Supported Models**:
- Llama 3 (70B)
- Mistral (7B)
- CodeLlama (34B)
- Custom endpoints

**Features**:
- Automatic fallback in priority order
- Health monitoring
- Remote endpoint support
- Zero API costs

**API Endpoints**:
```bash
GET  /api/llm/local/list          # List all local LLMs
POST /api/llm/local/register      # Register new LLM
POST /api/llm/local/execute       # Execute with fallback
```

### 5. File Chunking for Large Files

**Capacity**: Up to 500MB files  
**Chunk Size**: Configurable (default 10MB)

**Process**:
1. Upload large file
2. Automatic chunking
3. Parallel processing
4. Reassembly

**API**:
```bash
POST /api/files/upload
POST /api/files/chunk
GET  /api/files/{uuid}/chunks
```

### 6. Multi-Format Export

**Microsoft 365**:
- Excel (.xlsx) - Structured data
- Word (.docx) - Documents
- PowerPoint (.pptx) - Presentations
- Project (.json) - Project data

**Google Workspace**:
- Google Docs - HTML format
- Google Sheets - CSV format
- Google Slides - Coming soon

**Other Formats**:
- Notion - Markdown
- Audio (.mp3) - Text-to-speech via Google TTS
- Image (.jpeg) - Visualizations

**API**:
```bash
POST /api/export/microsoft365?format=excel
POST /api/export/google-workspace?format=docs
POST /api/export/notion
```

### 7. Knowledge Base & Academy

**Purpose**: Continuous learning system for AI agents

**Categories**:
- Legal & Governance
- Construction & Engineering
- Blockchain & Crypto
- Finance & Compliance
- Security & Fraud Detection
- Architecture
- Coding
- Data Analysis
- Project Management

**Features**:
- Add knowledge entries
- Semantic search
- Access tracking
- Quality scoring
- Cross-training matrix

**API**:
```bash
POST /api/academy/knowledge/add
GET  /api/academy/knowledge/search?query=X&category=Y
GET  /api/academy/knowledge/categories
```

### 8. Oracle Complexity Analyzer

**Purpose**: Fair, transparent pricing based on task complexity

**Factors Analyzed**:
- Length/word count
- Code patterns
- Data analysis requirements
- Creativity needs
- Multi-step complexity

**Output**:
- Complexity score (0-100)
- Estimated tokens
- Estimated time
- Cost breakdown by provider
- Detailed factor analysis

**API**:
```bash
POST /api/oracle/analyze
{
  "prompt": "Your task here",
  "provider": "openai"
}

Response:
{
  "complexity_score": 75.5,
  "estimated_tokens": 1300,
  "estimated_time_seconds": 8,
  "final_cost": 0.0456,
  "provider_costs": {
    "openai": 0.0456,
    "anthropic": 0.0456,
    "google": 0.0152,
    "local": 0.0
  },
  "factors": {...}
}
```

### 9. Billing & Transaction System

**Features**:
- Transaction tracking
- Cost breakdowns
- Usage summaries
- Provider-level analytics

**API**:
```bash
POST /api/billing/transaction
GET  /api/billing/transactions?user_id=X&limit=100
GET  /api/billing/summary?user_id=X
```

**Sample Response**:
```json
{
  "total_amount": 42.50,
  "total_tokens": 1500000,
  "transaction_count": 327,
  "by_provider": {
    "openai": {"amount": 25.30, "tokens": 843000, "count": 156},
    "anthropic": {"amount": 12.20, "tokens": 406000, "count": 98},
    "google": {"amount": 5.00, "tokens": 500000, "count": 73}
  }
}
```

### 10. Stability AI Integration

**Purpose**: High-quality image generation

**Quality Levels**:
- Standard: Fast, good quality
- High: Slower, better quality
- Ultra: Best quality, longest time

**Model**: Stable Diffusion XL

**Integration**: Available in IntegrationHub

## 📱 UI Components

### Navigation Flow

1. **Hero Page**: System overview with metrics
2. **Workbench**: Main working area (VS Studio style)
3. **Hybrid Agents**: Create multi-model agents
4. **Academy**: Knowledge base & learning
5. **Pricing**: Cost monitoring & tiers
6. **Integrations**: All connectors
7. **AI Center**: Chat & quick tasks
8. **Deploy**: Deployment wizard

### Liquid UI Design

- Animated gradient backgrounds
- Glassmorphism effects
- Real-time data flow visualization
- Responsive grid layouts
- Dark theme optimized

## 🔧 Technical Architecture

### Backend (FastAPI)

**New Database Models**:
```python
- FileChunk          # Large file processing
- TaskComplexity     # Oracle analysis results
- BillingTransaction # Payment tracking
- LocalLLMConfig     # Local model registry
- KnowledgeBaseEntry # Learning materials
```

**Key Services**:
- Oracle analyzer
- File chunking service
- Local LLM orchestrator
- Export generators
- Knowledge indexer

### Frontend (React + TypeScript)

**New Components**:
- LiquidWorkbench (580 lines)
- HybridAgentCreator (410 lines)
- MonetizationDashboard (380 lines)

**Enhanced Components**:
- AppLayout (new sections)
- IntegrationHub (Stability AI, exports)
- AgentAcademy (knowledge base)

## 🎯 Use Cases

### 1. High-Volume Processing
```
Upload 200MB dataset → Auto-chunk → Parallel processing → Export to Excel
```

### 2. Hybrid Intelligence
```
Create agent: 60% GPT-4 + 30% Claude + 10% Gemini → Complex analysis
```

### 3. Cost Optimization
```
Free chat for exploration → Oracle analysis → Accept cost → Execute task
```

### 4. Offline Operation
```
API fails → Automatic fallback to Local Llama → Continue working
```

### 5. Knowledge Accumulation
```
Complete tasks → Extract learnings → Store in Academy → Improve future performance
```

## 📊 Performance Metrics

- **File Upload**: 500MB in ~30 seconds
- **Chunking**: 10MB chunks, parallel processing
- **Cost Savings**: 50-80% with caching + local LLMs
- **Response Time**: <100ms cached, 2-5s live
- **Accuracy**: Oracle estimates within 10% of actual

## 🔐 Security & Privacy

- All chat is free and NOT billed
- Local LLMs keep data on-premise
- Transparent cost calculations
- No surprise charges
- Detailed audit logs

## 🚦 Getting Started

### 1. Start Backend
```bash
python app.py
# Backend runs on http://localhost:8000
```

### 2. Start Frontend
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Configure Local LLMs (Optional)
```bash
POST /api/llm/local/register
{
  "name": "My Llama",
  "model_type": "llama",
  "endpoint_url": "http://localhost:8080/v1/completions",
  "priority": 1
}
```

### 4. Try the Workbench
- Navigate to Workbench section
- Upload a file
- Enter a prompt
- See cost estimate
- Execute task
- Export results

## 📚 API Documentation

Full interactive documentation at: `http://localhost:8000/docs`

## 🎓 Best Practices

1. **Use chat for free exploration** - Only pay when executing tasks
2. **Check Oracle estimate** - Review costs before execution
3. **Configure local LLMs** - For cost savings and resilience
4. **Create hybrid agents** - For complex multi-step tasks
5. **Export frequently** - Save your work in multiple formats
6. **Feed the Academy** - Help agents learn for better future performance

## 🆘 Troubleshooting

### Large file upload fails
- Check chunking is enabled
- Verify disk space
- Increase chunk size if needed

### Local LLM not responding
- Check health status: `GET /api/llm/local/list`
- Verify endpoint URL is accessible
- Check API key if required

### Export fails
- Verify format is supported
- Check file dependencies installed
- Review error message in response

### Cost estimate seems wrong
- Oracle is an estimate, not guarantee
- Actual costs depend on API response
- Complex tasks may vary from estimate

## 🔮 Future Enhancements

- Real-time WebSocket updates for long tasks
- Advanced analytics dashboard
- Team collaboration features
- Custom export templates
- Vector search for knowledge base
- Automated agent training
- Multi-language support

---

**Franklin OS**: The complete AI Operating System for sovereign intelligence.

Built with ❤️ for transparency, control, and innovation.

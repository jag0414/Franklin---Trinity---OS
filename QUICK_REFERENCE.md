# Franklin OS - Quick Reference

## 🎯 Key Features at a Glance

### Free Forever
✅ Unlimited chat interface  
✅ Local LLM processing  
✅ Basic exports  
✅ Community support  

### Paid Features
💰 Task execution (complexity-based pricing)  
💰 High-volume processing  
💰 Advanced analytics  
💰 Priority support  

## 🚀 Quick Start Commands

### Backend
```bash
# Start server
python app.py

# With custom port
PORT=8000 python app.py

# With all providers
OPENAI_API_KEY=sk-xxx ANTHROPIC_API_KEY=sk-ant-xxx python app.py
```

### Frontend
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production
npm run preview
```

## 📋 Common API Calls

### Get Cost Estimate
```bash
curl -X POST http://localhost:8000/api/oracle/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Analyze this dataset", "provider": "openai"}'
```

### Execute with Local LLM
```bash
curl -X POST http://localhost:8000/api/llm/local/execute \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing"}'
```

### Upload Large File
```bash
curl -X POST http://localhost:8000/api/files/upload \
  -F "file=@largefile.pdf"
```

### Export to Excel
```bash
curl -X POST http://localhost:8000/api/export/microsoft365?format=excel \
  -H "Content-Type: application/json" \
  -d '{"task_id": "123", "title": "Results"}' \
  -o output.xlsx
```

### Add to Knowledge Base
```bash
curl -X POST http://localhost:8000/api/academy/knowledge/add \
  -H "Content-Type: application/json" \
  -d '{
    "category": "legal",
    "title": "Contract Review Best Practices",
    "content": "Always check termination clauses..."
  }'
```

## 🎨 UI Navigation

### Page Flow
```
Hero → Workbench → Hybrid Agents → Academy → Pricing → Deploy
```

### Key Sections
- **Workbench**: Main work area (Ctrl+1)
- **Hybrid Agents**: Create custom AI (Ctrl+2)
- **Pricing**: Monitor costs (Ctrl+3)
- **Academy**: Knowledge base (Ctrl+4)

## 💡 Pro Tips

### Cost Optimization
1. Use chat for free exploration
2. Check Oracle estimate before tasks
3. Use local LLMs for simple queries
4. Enable caching (automatic)
5. Batch similar requests

### Performance
1. Upload files < 50MB for best speed
2. Use parallel mode for independent tasks
3. Enable chunking for large files
4. Cache frequently-used prompts
5. Use sequential mode for dependent steps

### Quality
1. Use hybrid agents for complex tasks
2. Adjust agent weights based on task
3. Claude for reasoning, GPT-4 for general
4. Gemini for multimodal, Llama for speed
5. Add learnings to Academy

## 🔧 Environment Variables

### Required
```bash
FRANKLIN_DB_URL=postgresql://user:pass@host/db
FRANKLIN_JWT_SECRET=your-secret-key
PORT=8000
```

### Optional (AI Providers)
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AI...
STABILITY_API_KEY=sk-...
```

### Optional (Configuration)
```bash
FRANKLIN_AI_GLOBAL_CONCURRENCY=8
FRANKLIN_PROVIDER_CONCURRENCY=2
FRANKLIN_WEB_ORIGIN=http://localhost:5173
```

## 📊 Pricing Quick Reference

| Tier | Price | Tokens/Day | Features |
|------|-------|------------|----------|
| Free | $0 | 1,000 | Chat, basic AI, local LLMs |
| Basic | $10/mo | 100,000 | All providers, exports |
| Pro | $50/mo | 1,000,000 | Hybrid agents, API, analytics |
| Enterprise | Custom | Unlimited | SLA, white-label, support |

**Provider Costs (per 1K tokens)**:
- OpenAI: $0.03
- Anthropic: $0.03
- Google: $0.01
- Local: $0.00

## 🐛 Common Issues & Fixes

### "Database connection failed"
```bash
# Check DB_URL format
export FRANKLIN_DB_URL=postgresql://localhost/franklin
# OR use SQLite for testing
export FRANKLIN_DB_URL=sqlite:///franklin.db
```

### "API key invalid"
```bash
# Verify key format
echo $OPENAI_API_KEY
# Should start with: sk-...
# NOT contain: ..., CHANGE_ME, etc.
```

### "File upload timeout"
```bash
# Increase timeout in client
timeout: 300000  # 5 minutes

# Or chunk the file first
POST /api/files/chunk
```

### "Local LLM not found"
```bash
# Register local LLM first
POST /api/llm/local/register
{
  "name": "Llama",
  "model_type": "llama",
  "endpoint_url": "http://localhost:8080"
}
```

## 🎯 Use Case Examples

### 1. Data Analysis Report
```
1. Upload CSV (Workbench)
2. Prompt: "Analyze trends and create report"
3. Review Oracle estimate
4. Execute with hybrid: 60% GPT-4 + 40% Claude
5. Export to Excel + Word
```

### 2. Code Review
```
1. Upload code files
2. Create hybrid: CodeLlama + GPT-4
3. Prompt: "Review for security and performance"
4. Add findings to Knowledge Base
5. Export to Notion
```

### 3. Multi-Language Document
```
1. Upload English document
2. Use Gemini (multimodal)
3. Prompt: "Translate to 5 languages"
4. Export each to separate Word docs
```

### 4. Research Summary
```
1. Chat: Explore topic (FREE)
2. Refine requirements (FREE)
3. Oracle: Check cost estimate
4. Execute: Create summary
5. Export: PowerPoint presentation
```

## 📱 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+1 | Go to Workbench |
| Ctrl+2 | Go to Hybrid Agents |
| Ctrl+3 | Go to Pricing |
| Ctrl+4 | Go to Academy |
| Ctrl+S | Save current work |
| Ctrl+E | Execute prompt |
| Ctrl+U | Upload file |
| Ctrl+X | Export current |

## 🔗 Quick Links

- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Pricing Info**: http://localhost:8000/api/oracle/pricing
- **Local LLMs**: http://localhost:8000/api/llm/local/list

## 📞 Support

- **Documentation**: See FEATURE_GUIDE.md
- **Issues**: GitHub Issues
- **Community**: Discord (coming soon)
- **Email**: support@franklin-os.ai (enterprise only)

---

**Need more help?** Check the full [FEATURE_GUIDE.md](FEATURE_GUIDE.md) for detailed documentation.

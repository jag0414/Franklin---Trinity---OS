# Security Policy

## 🔒 API Key Security

### Critical: Never Commit API Keys

**⚠️ WARNING**: API keys provide access to paid services and must NEVER be committed to version control.

### Detected API Key Formats

This project uses the following API providers. **Never** commit keys matching these patterns:

- **OpenAI**: `sk-proj-*` or `sk-*` (128+ characters)
- **Anthropic**: `sk-ant-*` 
- **Google Gemini**: `AIza*`
- **Stability AI**: `sk-*`

### How to Secure Your API Keys

#### 1. Use Environment Variables

All API keys must be stored in environment variables, never in code:

```bash
# ✅ CORRECT - Use .env file (never committed)
OPENAI_API_KEY=sk-proj-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_API_KEY=AIza-your-key-here
```

```python
# ✅ CORRECT - Load from environment
import os
api_key = os.getenv("OPENAI_API_KEY")
```

```python
# ❌ WRONG - Never hardcode
api_key = "sk-proj-2F7NCBa2bcTVgtID4J5Q41xPbgXQJIw..."  # NEVER DO THIS!
```

#### 2. Local Development Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Add your API keys to `.env`:
   ```bash
   # Edit .env with your actual keys
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   GOOGLE_API_KEY=AIza-your-actual-key-here
   ```

3. Verify `.env` is in `.gitignore`:
   ```bash
   grep "^\.env$" .gitignore
   # Should show: .env
   ```

#### 3. Production Deployment

**Railway / Vercel / Cloud Platforms:**

- Add environment variables through the platform's dashboard
- Never commit production keys to the repository
- Use separate keys for development and production

**Example: Railway Dashboard**
```
Settings → Variables Tab → Add Variable
OPENAI_API_KEY = sk-proj-your-production-key
```

#### 4. GitHub Actions / CI/CD

Use GitHub Secrets for CI/CD workflows:

1. Go to: Repository → Settings → Secrets and variables → Actions
2. Add secrets: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.
3. Reference in workflows:
   ```yaml
   env:
     OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
   ```

### What to Do If a Key Is Exposed

If you accidentally commit an API key:

1. **Immediately rotate the key:**
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/
   - Google: https://makersuite.google.com/app/apikey

2. **Remove from git history** (if caught early):
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   # WARNING: This rewrites history
   git filter-repo --path-glob '**/*.env' --invert-paths
   ```

3. **Contact support** if charges occurred
4. **Review billing** for unauthorized usage

### Mock Mode for Development

This project includes a Mock Mode that works without API keys:

```bash
# No API keys needed for development
python app.py  # Automatically uses mock mode
```

Mock mode provides fake responses for testing without incurring costs.

## 🛡️ Security Best Practices

### Environment Files

- ✅ `.env.example` - Template (safe to commit)
- ❌ `.env` - Your actual keys (NEVER commit)
- ❌ `.env.local` - Local overrides (NEVER commit)
- ❌ `.env.production` - Production keys (NEVER commit)

### Code Review Checklist

Before committing:
- [ ] No API keys in code files
- [ ] No API keys in configuration files
- [ ] `.env` is in `.gitignore`
- [ ] Only `.env.example` has placeholder values
- [ ] All keys loaded from `os.getenv()`

### Automated Security

This repository includes:
- **Pre-commit hooks** - Scan for API keys before commit
- **GitHub Actions** - Secret scanning on every push
- **Gitignore** - Prevents committing `.env` files

## 📋 API Key Rotation Schedule

Recommended rotation frequency:
- **Production**: Every 90 days
- **Development**: Every 180 days
- **Immediately**: If exposure suspected

## 🔍 Security Scanning

### Local Scanning

```bash
# Check for accidentally committed secrets
git log -p | grep -E "sk-proj-|sk-ant-|AIza"
```

### GitHub Secret Scanning

This repository should have [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning) enabled to automatically detect pushed secrets.

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email the maintainer directly (see repository contact info)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## 🔗 Additional Resources

- [OpenAI API Security Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [git-secrets tool](https://github.com/awslabs/git-secrets)

---

**Last Updated**: December 2024
**Version**: 1.0

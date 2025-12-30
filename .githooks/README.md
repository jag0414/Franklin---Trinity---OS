# Git Hooks for Security

This directory contains git hooks to prevent committing sensitive information.

## Setup

To enable the pre-commit hook:

```bash
# Make the hook executable
chmod +x .githooks/pre-commit

# Configure git to use this hooks directory
git config core.hooksPath .githooks
```

## Available Hooks

### pre-commit

Prevents committing:
- OpenAI API keys (`sk-proj-*`, `sk-*`)
- Anthropic API keys (`sk-ant-*`)
- Google API keys (`AIza*`)
- Stability AI keys
- `.env` files (except `.env.example`)

The hook runs automatically before each commit and will block the commit if secrets are detected.

## Bypassing the Hook

⚠️ **Use with extreme caution!**

If you need to bypass the hook (e.g., for a false positive):

```bash
git commit --no-verify
```

**WARNING**: Only use this if you're absolutely certain no secrets are being committed.

## Manual Testing

Test the hook without committing:

```bash
.githooks/pre-commit
```

## See Also

- [SECURITY.md](../SECURITY.md) - Complete security documentation
- [.env.example](../.env.example) - Environment variable template

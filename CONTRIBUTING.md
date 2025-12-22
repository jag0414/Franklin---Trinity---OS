# Contributing to Franklin OS

Thank you for your interest in contributing to Franklin OS! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

We welcome contributions in many forms:

- 🐛 Bug reports and fixes
- ✨ New features and enhancements
- 📝 Documentation improvements
- 🎨 UI/UX improvements
- 🧪 Tests and test coverage
- 🌐 Translations and internationalization

## 🚀 Getting Started

1. **Fork the repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Franklin---Trinity---OS.git
   cd Franklin---Trinity---OS
   ```

3. **Set up development environment**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   pip install -r requirements.txt
   ```

4. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## 💻 Development Workflow

### Frontend Development

```bash
# Start development server with hot reload
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development

```bash
# Start backend with auto-reload
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8090

# Run tests (if available)
pytest tests/
```

### Full Stack Development

Use two terminal windows:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
python -m uvicorn app:app --reload
```

## 📋 Code Style Guidelines

### TypeScript/React

- Use TypeScript for all new components
- Follow React hooks best practices
- Use functional components over class components
- Keep components small and focused
- Write descriptive prop types
- Use meaningful variable and function names

Example:
```typescript
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {label}
    </button>
  );
};
```

### Python

- Follow PEP 8 style guide
- Use type hints where possible
- Write docstrings for functions and classes
- Keep functions focused and single-purpose

Example:
```python
from typing import Optional
from fastapi import HTTPException

def get_user_by_id(user_id: int) -> Optional[User]:
    """
    Retrieve a user by their ID.
    
    Args:
        user_id: The unique identifier of the user
        
    Returns:
        User object if found, None otherwise
        
    Raises:
        HTTPException: If user_id is invalid
    """
    if user_id < 1:
        raise HTTPException(400, "Invalid user ID")
    return db.query(User).get(user_id)
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Keep custom CSS minimal
- Use shadcn/ui components when possible

## 🧪 Testing

### Writing Tests

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Test edge cases and error conditions

### Running Tests

```bash
# Frontend tests (when available)
npm test

# Backend tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=. --cov-report=html
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add JWT token refresh mechanism

Implements automatic token refresh when the token is about to expire.
Adds refresh token endpoint and client-side refresh logic.

Closes #123

---

fix(api): resolve CORS issue in production

Updates CORS configuration to allow requests from production domain.

---

docs(readme): update deployment instructions

Adds Railway and Render deployment guides.
```

## 🔄 Pull Request Process

1. **Update your branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests and linting**
   ```bash
   npm run lint
   npm run build
   # Run any other relevant tests
   ```

3. **Push your changes**
   ```bash
   git push origin your-branch
   ```

4. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template

5. **PR Requirements**
   - Clear description of changes
   - Reference related issues
   - All tests passing
   - Code follows style guidelines
   - Documentation updated (if needed)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Related Issues
Closes #123

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## 🐛 Reporting Bugs

### Before Submitting

- Check existing issues to avoid duplicates
- Verify the bug exists in the latest version
- Collect relevant information

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 96]
- Node Version: [e.g., 18.0.0]
- Python Version: [e.g., 3.11.0]

**Additional Context**
Any other relevant information
```

## 💡 Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature already exists or is planned
2. Clearly describe the feature and its benefits
3. Provide use cases and examples
4. Consider implementation complexity

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Problem it Solves**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other ways to achieve the same goal

**Additional Context**
Mockups, examples, etc.
```

## 📚 Documentation

Good documentation is crucial! When contributing:

- Update README.md for user-facing changes
- Update DEPLOYMENT.md for deployment-related changes
- Add inline code comments for complex logic
- Update API documentation for endpoint changes
- Add examples for new features

## 🔐 Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability
4. Allow time for a fix before public disclosure

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks
- Publishing others' private information
- Other unprofessional conduct

## 🎯 Priority Areas

We especially welcome contributions in these areas:

- [ ] Test coverage improvements
- [ ] Performance optimizations
- [ ] Accessibility enhancements
- [ ] Mobile responsiveness
- [ ] Documentation and examples
- [ ] Internationalization (i18n)
- [ ] Security improvements

## 🏆 Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Eligible for contributor badges

## 📞 Getting Help

Need help contributing?

- 💬 Open a discussion on GitHub
- 📧 Email the maintainers
- 📖 Check the documentation
- 🐛 Reference existing issues and PRs

## 📄 License

By contributing to Franklin OS, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

Thank you for contributing to Franklin OS! 🚀

Every contribution, no matter how small, makes a difference. We appreciate your time and effort in making this project better.

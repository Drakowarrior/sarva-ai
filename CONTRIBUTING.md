# Contributing to SARVA AI ⚡

Thank you for your interest in contributing to **SARVA AI**! We welcome contributions from developers of all skill levels, whether you are fixing bugs, improving documentation, adding new features, or submitting good first issues.

---

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Good First Issues](#good-first-issues)
   - [Pull Requests](#pull-requests)
3. [Development Setup](#development-setup)
4. [Coding & Style Standards](#coding--style-standards)
5. [Community & Questions](#community--questions)

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please treat everyone with respect, constructive feedback, and professional courtesy.

---

## How Can I Contribute?

### Reporting Bugs
If you find a bug or unexpected behavior:
1. Search existing [GitHub Issues](https://github.com/karangarg-igt/sarva-ai/issues) to verify it hasn't already been reported.
2. If not, open a new **Bug Report** issue.
3. Include:
   - Clear title and detailed description.
   - Steps to reproduce the bug.
   - Expected vs. actual behavior.
   - Screenshots or console logs if applicable.
   - Environment details (Browser, Node version, Python version, OS).

### Suggesting Enhancements
Feature requests are always welcome!
1. Check existing issues to see if the feature is already under discussion.
2. Open a **Feature Request** issue explaining:
   - What feature you'd like added and why it would benefit users/developers.
   - Proposed API design or UI behavior.

### Good First Issues
New to SARVA AI or open-source in general? Look for issues with the `good first issue` label! These are bite-sized, well-defined tasks ideal for getting familiar with the codebase.

Some quick ideas you can claim:
- [ ] Add light/dark theme persistence in `localStorage`.
- [ ] Implement a Markdown code block "Copy Code" toast notification.
- [ ] Add message history JSON/Markdown export.
- [ ] Add unit tests for backend `auth_routes.py`.
- [ ] Improve mobile responsiveness for the chat sidebar.

---

## Pull Requests (PR Workflow)

Follow these steps to submit your changes:

1. **Fork the Repository**:
   Click the "Fork" button at the top right of the [SARVA AI GitHub Repository](https://github.com/karangarg-igt/sarva-ai).

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/sarva-ai.git
   cd sarva-ai
   ```

3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make Your Changes & Test**:
   - Ensure frontend builds cleanly without warnings (`npm run build`).
   - Ensure backend starts up smoothly without syntax errors (`uvicorn main:app`).

5. **Commit Your Changes**:
   Write descriptive commit messages:
   ```bash
   git commit -m "feat(chat): add markdown code block copy button"
   ```

6. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**:
   - Open a PR against the `main` branch of `karangarg-igt/sarva-ai`.
   - Provide a concise summary of what was added/fixed and link any relevant issue numbers (e.g., `Closes #12`).

---

## Development Setup

See the [Quick Start section in README.md](file:///Users/karangarg/Documents/coding/NovaAI%202/sarva-ai/README.md#-quick-start) for complete local installation instructions for Python/FastAPI and React/Vite.

---

## Coding & Style Standards

### Python / FastAPI (Backend)
- Follow **PEP 8** style guidelines.
- Use explicit type annotations on FastAPI route handlers and services.
- Define data structures using Pydantic models in `backend/models/`.
- Handle errors gracefully using FastAPI `HTTPException`.

### JavaScript / React (Frontend)
- Use standard functional components with React Hooks.
- Keep components small and focused in `frontend/src/components/`.
- Use custom CSS variables defined in `index.css` for consistent styling.
- Ensure interactive elements are keyboard accessible and responsive across device widths.

---

Thank you for helping make SARVA AI awesome! 🚀

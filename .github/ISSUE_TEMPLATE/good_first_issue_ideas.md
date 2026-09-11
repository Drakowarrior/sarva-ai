# 💡 Suggested Good First Issues (Maintainer Seed List)

> **Note for Repository Maintainers:** This document contains a seed list of candidate `good first issue` tasks. Copy and create these as individual GitHub Issues on your repository, labeling each with `good first issue`, `help wanted`, and `enhancement`.

---

### Issue 1: Add dark/light theme persistence to localStorage
**Suggested Labels:** `good first issue`, `enhancement`, `frontend`  
**Description:**  
Currently, theme changes reset when refreshing the page.  
**Goal:**  
- Persist user theme selection (`dark` or `light`) in `localStorage`.
- Read from `localStorage` on initial app render in `App.jsx` or `index.css`.
- Fallback to system preference (`prefers-color-scheme`) if no stored preference exists.

---

### Issue 2: Add "Copy Code" toast notification to Markdown code blocks
**Suggested Labels:** `good first issue`, `enhancement`, `UI`  
**Description:**  
When clicking the "Copy" button on a code block in the chat window, the code copies to clipboard, but there is no temporary feedback toast confirming the action.  
**Goal:**  
- Add a 2-second checkmark icon or toast notification ("Copied to Clipboard!") when the copy button is triggered.

---

### Issue 3: Add Chat Conversation Export (Download as Markdown / JSON)
**Suggested Labels:** `good first issue`, `enhancement`, `feature`  
**Description:**  
Allow users to export an active conversation session into a downloadable file.  
**Goal:**  
- Add an "Export Chat" dropdown option in the chat header or sidebar.
- Allow downloading current session messages as `.md` or `.json`.

---

### Issue 4: Implement GitHub OAuth 2.0 Login Option
**Suggested Labels:** `good first issue`, `enhancement`, `auth`  
**Description:**  
Expand authentication options beyond email/password JWT signup.  
**Goal:**  
- Add a "Sign in with GitHub" button on the Auth login page.
- Implement FastAPI backend route for GitHub OAuth callback and token exchange.

---

### Issue 5: Add multi-model selector dropdown (Groq Llama 3 models, Mixtral, Gemma)
**Suggested Labels:** `good first issue`, `enhancement`, `AI`  
**Description:**  
Groq supports multiple fast open-source models (Llama 3 70B, Llama 3 8B, Mixtral 8x7b, Gemma 7b).  
**Goal:**  
- Add a model selector dropdown in the chat header.
- Pass selected `model_id` in the API payload to `/api/chat/stream`.

---

### Issue 6: Add automated unit tests for FastAPI Auth & Health routes
**Suggested Labels:** `good first issue`, `testing`, `backend`  
**Description:**  
Set up initial `pytest` coverage for backend API endpoints.  
**Goal:**  
- Create `backend/tests/test_auth.py` and `backend/tests/test_health.py` using FastAPI `TestClient`.
- Verify `/api/health` returns status 200 and auth login rejects bad credentials.

---

### Issue 7: Enhance mobile drawer sidebar responsive layout
**Suggested Labels:** `good first issue`, `UI`, `responsive`  
**Description:**  
On mobile screens (< 640px), the session history sidebar overlay should smoothly slide in from the left and close on backdrop tap.  
**Goal:**  
- Improve Framer Motion backdrop click handler and drawer animation for mobile devices.

---

### Issue 8: Add API rate-limit header indicators (`X-RateLimit-Remaining`)
**Suggested Labels:** `good first issue`, `backend`, `enhancement`  
**Description:**  
Help developers monitor API usage by adding rate limit response headers.  
**Goal:**  
- Update FastAPI rate limit middleware to include `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers in HTTP responses.

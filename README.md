<p align="center">
  <h1 align="center">🚀 SARVA AI</h1>
  <p align="center"><strong>Enterprise AI Chat & Organization Workspace Platform</strong></p>
  <p align="center">
    <a href="https://sarva-ai-one.vercel.app/"><strong>🌐 Live Demo: https://sarva-ai-one.vercel.app/</strong></a>
  </p>
  <p align="center">
    <em>Secure • Premium • Scalable • Production-Ready Conversational AI</em>
  </p>
</p>

---

> **Made by Karan Garg during internship at IGT Solutions — 2026**
>
> 🔗 **Live Web Application:** [https://sarva-ai-one.vercel.app/](https://sarva-ai-one.vercel.app/)  
> 🔗 **Technical Case Study:** [https://sarva-ai-one.vercel.app/case-study](https://sarva-ai-one.vercel.app/case-study)  
> 🔗 **Architecture & Tech Stack:** [https://sarva-ai-one.vercel.app/technology](https://sarva-ai-one.vercel.app/technology)

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [System Architecture](#-system-architecture)
5. [Request Lifecycle](#-request-lifecycle)
6. [Authentication Flow](#-authentication-flow)
7. [Organization Approval Workflow](#-organization-approval-workflow)
8. [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
9. [API Endpoints Reference](#-api-endpoints-reference)
10. [Database Schema](#-database-schema)
11. [Frontend Component Map](#-frontend-component-map)
12. [Environment Variables](#-environment-variables)
13. [Installation & Setup](#-installation--setup)
14. [Deployment Guide](#-deployment-guide)
15. [License](#-license)

---

## ✨ Features

### AI Chat Engine
- Real-time AI streaming responses via Groq LLM API
- Full Markdown rendering with syntax-highlighted code blocks
- Copy-to-clipboard on code blocks and messages
- Like / Dislike feedback with contextual comment modals
- Multi-format file upload & analysis (PDF, DOCX, TXT, PNG, JPG, WEBP)
- Persistent chat sessions with rename, delete, and search
- Shared chat links for cross-user collaboration

### Organization Workspace
- Organization creation with automatic Head (Owner) assignment
- Join-request approval workflow (Head/HR approves, rejects, or bulk-processes)
- Invitation code system with auto-activation for pre-approved users
- Department management (create, rename, delete, assign members)
- Member directory with search, filter, sort, role updates, and archiving
- Activity logs tracking every admin action
- RBAC permissions matrix (Head → HR → Team Lead → Executive → Intern → Student)

### Premium UI/UX
- Collapsible sidebar with hover tooltips and profile card
- Glassmorphic dashboard with animated SVG spline & bar charts
- Skeleton loading states, empty states, and error boundaries
- Responsive design tested at 320px → 1920px breakpoints
- Dark/Light theme support via CSS custom properties
- Framer Motion page transitions and micro-animations

### Security
- JWT authentication with httpOnly cookies
- Password hashing via bcrypt
- IP-based rate limiting middleware (200 req/min)
- CORS origin whitelisting from environment variables
- Workspace status gate blocking pending users from protected endpoints
- File upload validation (type whitelist + 10MB size limit)
- MongoDB injection prevention via Motor parameterized queries

---

## 🛠 Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React 18, Vite, React Router v6, Framer Motion, Axios, React Icons (Feather), Vanilla CSS |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, PyJWT, Bcrypt, PyPDF, python-docx |
| **Database** | MongoDB Atlas, Motor (async driver) |
| **AI Engine** | Groq Cloud API (LLM streaming) |
| **Deployment** | Vercel / Netlify (frontend), Render / Railway / Fly.io (backend), MongoDB Atlas (database) |

---

## 📁 Project Structure

```
NovaAI/
├── backend/
│   ├── main.py                    # FastAPI app entry, middleware, CORS, startup
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Environment secrets (git-ignored)
│   ├── database/
│   │   ├── mongodb.py             # Motor client & DB connection
│   │   └── db_init.py             # Startup index initialization
│   ├── middleware/
│   │   └── auth.py                # JWT verification, user extraction, status gate
│   ├── routes/
│   │   ├── auth_routes.py         # Login, Signup, Logout, Profile, Org registration
│   │   ├── chat_routes.py         # AI streaming, conversation management
│   │   ├── session_routes.py      # CRUD for chat sessions
│   │   ├── message_routes.py      # Message retrieval
│   │   ├── file_routes.py         # File upload & text extraction
│   │   ├── feedback_routes.py     # Like/Dislike/Comment feedback
│   │   ├── user_routes.py         # User profile, statistics, avatar
│   │   ├── org_routes.py          # Organization CRUD, members, approvals, departments
│   │   ├── share_routes.py        # Shared chat links
│   │   └── health_routes.py       # Health check endpoint
│   ├── services/
│   │   ├── groq_service.py        # Groq LLM API integration & streaming
│   │   ├── session_service.py     # Session business logic
│   │   ├── message_service.py     # Message storage & retrieval
│   │   ├── file_service.py        # File validation & text extraction
│   │   └── feedback_service.py    # Feedback storage
│   ├── models/                    # Pydantic models (request/response)
│   ├── schemas/                   # Data validation schemas
│   └── utils/                     # Helpers & utilities
│
├── frontend/
│   ├── index.html                 # SPA entry
│   ├── vite.config.js             # Vite build configuration
│   ├── package.json               # NPM dependencies
│   ├── .env                       # VITE_API_URL (git-ignored)
│   └── src/
│       ├── main.jsx               # React DOM render
│       ├── App.jsx                # Router & layout wrapper
│       ├── App.css                # App-level styles
│       ├── index.css              # Global design tokens & utilities
│       ├── context/
│       │   └── AuthContext.jsx    # Authentication state provider
│       ├── services/
│       │   └── api.js             # Axios instance with base URL
│       ├── hooks/                 # Custom React hooks
│       ├── utils/                 # Helper functions
│       ├── components/
│       │   ├── Sidebar/           # Collapsible sidebar + session list
│       │   ├── Navbar/            # Top navigation bar
│       │   ├── ChatWindow/        # Main chat viewport
│       │   ├── ChatBubble/        # Individual message bubble
│       │   ├── ChatInput/         # Message input area
│       │   ├── FileUploader/      # Drag & drop file upload
│       │   ├── FeedbackModal/     # Like feedback form
│       │   ├── DislikeFeedbackModal/ # Dislike with comments
│       │   ├── ShareModal/        # Share chat dialog
│       │   ├── Settings/          # User settings panel
│       │   ├── ProfileMenu/       # Profile dropdown
│       │   ├── EmptyState/        # Empty chat placeholder
│       │   ├── Loader/            # Loading spinner
│       │   ├── SessionList/       # Session history list
│       │   └── TypingIndicator/   # AI typing animation
│       └── pages/
│           ├── Home/              # Landing page
│           ├── Auth/              # Login & Signup
│           ├── Chat/              # Main chat interface
│           ├── OrgDashboard/      # Organization management dashboard
│           ├── PendingApproval/   # Pending workspace screen
│           ├── SessionHistory/    # Full session history
│           └── NotFound/          # 404 page
└── README.md
```

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Auth    │  │  Chat    │  │  Org     │  │  Pending      │  │
│  │  Pages   │  │  Window  │  │  Dash    │  │  Approval     │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬───────┘  │
│       │              │              │                │          │
│       └──────────────┴──────────────┴────────────────┘          │
│                              │                                  │
│                     Axios HTTP Client                           │
│                     (JWT in httpOnly cookie)                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTPS
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                       FASTAPI BACKEND                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Rate Limiter (200 req/min per IP)             │  │
│  └───────────────────────────┬────────────────────────────────┘  │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │           CORS Middleware (origin whitelist)               │  │
│  └───────────────────────────┬────────────────────────────────┘  │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │       JWT Auth Guard → extracts user_id from cookie       │  │
│  └───────────────────────────┬────────────────────────────────┘  │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Active Status Gate (blocks pending users, exempts        │  │
│  │  /auth/me, /feedback, /health, /auth/logout)              │  │
│  └───────────────────────────┬────────────────────────────────┘  │
│                              ▼                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐    │
│  │ Auth │ │ Chat │ │ Sess │ │ File │ │ Feed │ │ Org      │    │
│  │Routes│ │Routes│ │Routes│ │Routes│ │back  │ │ Routes   │    │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └────┬─────┘    │
│     └────────┴────────┴────────┴────────┴──────────┘            │
│                              │                                   │
│                     Services Layer                               │
│              (groq, session, message, file)                      │
└──────────────────────────────┬───────────────────────────────────┘
                               │  Motor (async)
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     MONGODB ATLAS CLUSTER                        │
│                                                                  │
│  ┌────────┐ ┌──────────────┐ ┌───────────────────┐ ┌─────────┐ │
│  │ users  │ │organizations │ │organization_members│ │sessions │ │
│  │(unique:│ │(unique:      │ │(compound unique:   │ │(indexed)│ │
│  │ email, │ │ orgName)     │ │ orgId + userId)    │ │         │ │
│  │ uname) │ │              │ │                    │ │         │ │
│  └────────┘ └──────────────┘ └───────────────────┘ └─────────┘ │
│                                                                  │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │messages │ │ feedback │ │invitations│ │   activity_logs      │ │
│  │         │ │          │ │(unique:   │ │   (indexed by orgId) │ │
│  │         │ │          │ │ token)    │ │                      │ │
│  └─────────┘ └──────────┘ └──────────┘ └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Lifecycle

Every API request flows through this exact pipeline:

```
Browser Request
      │
      ▼
┌─────────────────┐
│  Rate Limiter   │──▶ 429 Too Many Requests (if exceeded)
└────────┬────────┘
         ▼
┌─────────────────┐
│  CORS Check     │──▶ Blocked (if origin not whitelisted)
└────────┬────────┘
         ▼
┌─────────────────┐
│  JWT Extraction  │──▶ 401 Unauthorized (if no/invalid token)
│  from Cookie     │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Status Gate     │──▶ 403 Pending Approval (if user not active)
│  (exemptions:    │    Exempted: /auth/me, /auth/logout,
│   auth, feedback)│              /feedback, /health
└────────┬────────┘
         ▼
┌─────────────────┐
│  Route Handler   │──▶ Business logic + DB operations
└────────┬────────┘
         ▼
   JSON Response
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                    SIGNUP FLOW                            │
│                                                          │
│  User fills form → POST /api/auth/signup                 │
│       │                                                  │
│       ├── Account type: "personal"                       │
│       │       └── Status: "active" → Redirect to /chat   │
│       │                                                  │
│       └── Account type: "organization"                   │
│               │                                          │
│               ├── Creating new org?                       │
│               │       └── Role: Head (auto-assigned)     │
│               │       └── Status: "active"               │
│               │       └── Redirect to /chat              │
│               │                                          │
│               ├── Has invitation code?                    │
│               │       └── Validate code                  │
│               │       └── Status: "active" (auto-approve)│
│               │       └── Redirect to /chat              │
│               │                                          │
│               └── No invitation code?                    │
│                       └── Status: "pending"              │
│                       └── Redirect to /pending-approval  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                             │
│                                                          │
│  POST /api/auth/login                                    │
│       │                                                  │
│       ├── Verify password (bcrypt compare)               │
│       ├── Generate JWT token                             │
│       ├── Set httpOnly cookie                            │
│       │                                                  │
│       ├── If user.approvalStatus == "active"             │
│       │       └── Redirect to /chat                      │
│       │                                                  │
│       └── If user.approvalStatus == "pending"            │
│               └── Redirect to /pending-approval          │
└──────────────────────────────────────────────────────────┘
```

---

## 🏢 Organization Approval Workflow

```
  New User Registration (org account, no invite code)
                    │
                    ▼
        ┌───────────────────────┐
        │  Account Created      │
        │  Status: "pending"    │
        │  Role: requested role │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Pending Approval     │  ◀── User sees this screen
        │  Workspace Page       │      Can submit feedback
        │  (restricted access)  │      Can logout
        └───────────┬───────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   ┌──────────────┐   ┌──────────────┐
   │  Head/HR     │   │  Head/HR     │
   │  APPROVES    │   │  REJECTS     │
   └──────┬───────┘   └──────┬───────┘
          │                   │
          ▼                   ▼
   Status: "active"    Status: "rejected"
   Full access granted  Access denied
   Activity log created Activity log created
```

---

## 🛡 Role-Based Access Control (RBAC)

| Permission | Head | HR | Team Lead | Executive | Intern | Student |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| Full org control | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve/reject members | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage departments | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update member roles | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Remove members | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Send invitations | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View org dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Use AI chatbot | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload files | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit feedback | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

> **Ownership Rule:** The creator of an organization is automatically and permanently assigned the **Head** role. No other user can register as Head of an existing organization.

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `POST` | `/api/auth/signup` | Register new user (personal or org) | ❌ |
| `POST` | `/api/auth/login` | Login with email/password | ❌ |
| `POST` | `/api/auth/logout` | Clear JWT cookie | ✅ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |

### Chat (`/api/chat`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `POST` | `/api/chat` | Send message & stream AI response | ✅ |

### Sessions (`/api/sessions`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `GET` | `/api/sessions` | List all user sessions | ✅ |
| `POST` | `/api/sessions` | Create new session | ✅ |
| `PATCH` | `/api/sessions/:id/rename` | Rename session | ✅ |
| `DELETE` | `/api/sessions/:id` | Delete session | ✅ |

### Messages (`/api/messages`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `GET` | `/api/messages/:sessionId` | Get messages for session | ✅ |

### File Upload (`/api/upload`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `POST` | `/api/upload` | Upload & extract file text | ✅ |

### Feedback (`/api/feedback`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `POST` | `/api/feedback` | Submit like/dislike feedback | ✅ |

### Organization (`/api/organizations`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `GET` | `/api/organizations/my` | Get user's organization | ✅ |
| `GET` | `/api/organizations/members` | List org members | ✅ |
| `POST` | `/api/organizations/members/approve` | Approve pending member | ✅ |
| `POST` | `/api/organizations/members/reject` | Reject pending member | ✅ |
| `PUT` | `/api/organizations/members/role` | Update member role | ✅ |
| `DELETE` | `/api/organizations/members/:id` | Remove member | ✅ |
| `GET` | `/api/organizations/invitations` | List invitations | ✅ |
| `POST` | `/api/organizations/invite` | Send invitations | ✅ |
| `GET` | `/api/organizations/logs` | Get activity logs | ✅ |

### Shared Chats (`/api/share`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `POST` | `/api/share` | Share a chat session | ✅ |
| `GET` | `/api/share/:id` | View shared chat | ❌ |

### User (`/api/user`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `GET` | `/api/user/stats` | Get user statistics | ✅ |
| `PUT` | `/api/user/profile` | Update profile | ✅ |

---

## 🗄 Database Schema

### `users` Collection
```json
{
  "_id": "ObjectId",
  "username": "string (unique)",
  "email": "string (unique)",
  "password": "string (bcrypt hash)",
  "accountType": "personal | organization",
  "organizationId": "string | null",
  "organizationName": "string | null",
  "role": "Head | HR | Team Lead | Executive | Intern | Student",
  "department": "string",
  "approvalStatus": "active | pending | rejected",
  "avatar": "string (URL)",
  "createdAt": "ISO datetime"
}
```

### `organizations` Collection
```json
{
  "_id": "ObjectId",
  "organizationName": "string (unique)",
  "organizationId": "string",
  "ownerUserId": "string",
  "ownerRole": "Head",
  "departments": ["General", "Engineering", ...],
  "website": "string",
  "logo": "string (URL)",
  "createdAt": "ISO datetime"
}
```

### `organization_members` Collection
```json
{
  "_id": "ObjectId",
  "organizationId": "string",
  "userId": "string (compound unique with orgId)",
  "name": "string",
  "email": "string",
  "role": "string",
  "department": "string",
  "status": "active | pending | archived",
  "joinedAt": "ISO datetime"
}
```

### `invitations` Collection
```json
{
  "_id": "ObjectId",
  "organizationId": "string",
  "invitedEmail": "string",
  "inviteToken": "string (unique)",
  "role": "string",
  "department": "string",
  "createdBy": "string",
  "createdAt": "ISO datetime"
}
```

### `sessions` Collection
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "organizationId": "string | null",
  "title": "string",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

### `messages` Collection
```json
{
  "_id": "ObjectId",
  "sessionId": "string",
  "role": "user | assistant",
  "content": "string (markdown)",
  "feedback": "like | dislike | null",
  "timestamp": "ISO datetime"
}
```

---

## 🖥 Frontend Component Map

```
App.jsx
├── AuthProvider (context)
├── Router
│   ├── / ─────────────────── Home (landing page)
│   ├── /login ────────────── Auth (login form)
│   ├── /signup ───────────── Auth (signup form)
│   ├── /chat ─────────────── Chat
│   │   ├── Sidebar
│   │   │   ├── SessionList
│   │   │   └── ProfileMenu
│   │   ├── Navbar
│   │   ├── ChatWindow
│   │   │   ├── ChatBubble (per message)
│   │   │   ├── TypingIndicator
│   │   │   └── EmptyState
│   │   ├── ChatInput
│   │   │   └── FileUploader
│   │   ├── FeedbackModal
│   │   ├── DislikeFeedbackModal
│   │   ├── ShareModal
│   │   └── Settings
│   ├── /org-dashboard ────── OrgDashboard
│   │   ├── Overview tab (charts, stats, notifications)
│   │   ├── Members tab (directory, search, bulk actions)
│   │   ├── Departments tab (grid, member lists)
│   │   ├── Roles tab (RBAC permissions matrix)
│   │   ├── Approvals tab (pending queue)
│   │   ├── Invitations tab (generate codes)
│   │   └── Settings tab (org branding)
│   ├── /pending-approval ─── PendingApproval
│   ├── /history ──────────── SessionHistory
│   └── * ─────────────────── NotFound (404)
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
|:---|:---|:---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `DATABASE_NAME` | MongoDB database name | `NovaAI` |
| `SECRET_KEY` | JWT signing secret (use a strong random key) | `a1b2c3d4e5f6...` |
| `GROQ_API_KEY` | Groq Cloud API key for LLM | `gsk_...` |
| `FRONTEND_URL` | Deployed frontend URL (for CORS) | `https://sarva-ai.vercel.app` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|:---|:---|:---|
| `VITE_API_URL` | Backend API base URL | `https://api.sarva-ai.com/api` |

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18+
- **Python** v3.10+
- **MongoDB Atlas** cluster (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sarva-ai.git
cd sarva-ai
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # macOS/Linux
# venv\Scripts\activate           # Windows

pip install -r requirements.txt

# Create .env file with your credentials (see Environment Variables section)

uvicorn main:app --reload --port 8000
```
The API will start at `http://localhost:8000`. Database indexes are created automatically on startup.

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env with: VITE_API_URL=http://localhost:8000/api

npm run dev
```
The app will open at `http://localhost:5173`.

---

## 🌐 Deployment Guide

### Frontend (Vercel / Netlify)
1. Push `frontend/` to GitHub
2. Connect repo to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL` → your backend URL

### Backend (Render / Railway / Fly.io)
1. Push `backend/` to GitHub
2. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Add all environment variables from the table above
4. Ensure `FRONTEND_URL` matches your deployed frontend domain

### Database (MongoDB Atlas)
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist your backend server's IP address
3. Copy the connection string to `MONGO_URI`

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  <strong>© 2026 SARVA AI • Made by Karan Garg (Intern at IGT Solutions)</strong>
</p>

import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home/Home";
import Chat from "./pages/Chat/Chat";
import Auth from "./pages/Auth/Auth";
import OrgDashboard from "./pages/OrgDashboard/OrgDashboard";
import PendingApproval from "./pages/PendingApproval/PendingApproval";
import NotFound from "./pages/NotFound/NotFound";
import About from "./pages/SeoPages/About";
import Features from "./pages/SeoPages/Features";
import AiChatbot from "./pages/SeoPages/AiChatbot";
import EnterpriseAi from "./pages/SeoPages/EnterpriseAi";
import FileAnalysis from "./pages/SeoPages/FileAnalysis";
import Security from "./pages/SeoPages/Security";
import Technology from "./pages/SeoPages/Technology";
import Contact from "./pages/SeoPages/Contact";
import CaseStudy from "./pages/SeoPages/CaseStudy";

import BlogHub from "./pages/Blog/BlogHub";
import ArticleFastApiGroq from "./pages/Blog/ArticleFastApiGroq";
import ArticleDocumentAnalysis from "./pages/Blog/ArticleDocumentAnalysis";
import ArticleMongodbMemory from "./pages/Blog/ArticleMongodbMemory";
import ArticleJwtSecurity from "./pages/Blog/ArticleJwtSecurity";
import ArticleArchitectureDeployment from "./pages/Blog/ArticleArchitectureDeployment";

import { useAuth } from "./context/AuthContext";
import Loader from "./components/Loader/Loader";
import FeedbackModal from "./components/FeedbackModal/FeedbackModal";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkingAuth, user } = useAuth();

  if (checkingAuth) {
    return <Loader fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user && user.accountType === "organization" && user.approvalStatus !== "active") {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
};

const RootLayout = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            fontSize: "0.9rem"
          }
        }}
      />
      <Outlet />
      <FeedbackModal />
    </>
  );
};


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "features",
        element: <Features />,
      },
      {
        path: "ai-chatbot",
        element: <AiChatbot />,
      },
      {
        path: "enterprise-ai",
        element: <EnterpriseAi />,
      },
      {
        path: "file-analysis",
        element: <FileAnalysis />,
      },
      {
        path: "security",
        element: <Security />,
      },
      {
        path: "technology",
        element: <Technology />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "case-study",
        element: <CaseStudy />,
      },
      {
        path: "blog",
        element: <BlogHub />,
      },
      {
        path: "blog/fastapi-groq-ai-chatbot",
        element: <ArticleFastApiGroq />,
      },
      {
        path: "blog/ai-document-analysis",
        element: <ArticleDocumentAnalysis />,
      },
      {
        path: "blog/mongodb-chat-memory",
        element: <ArticleMongodbMemory />,
      },
      {
        path: "blog/jwt-ai-chatbot-security",
        element: <ArticleJwtSecurity />,
      },
      {
        path: "blog/full-stack-ai-architecture",
        element: <ArticleArchitectureDeployment />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "pending-approval",
        element: <PendingApproval />,
      },
      {
        path: "chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
      {
        path: "org-dashboard",
        element: (
          <ProtectedRoute>
            <OrgDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
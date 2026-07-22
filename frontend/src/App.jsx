import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home/Home";
import Chat from "./pages/Chat/Chat";
import Auth from "./pages/Auth/Auth";
import OrgDashboard from "./pages/OrgDashboard/OrgDashboard";
import PendingApproval from "./pages/PendingApproval/PendingApproval";
import NotFound from "./pages/NotFound/NotFound";
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
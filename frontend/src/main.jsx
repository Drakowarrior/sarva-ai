import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SessionProvider } from "./context/SessionContext.jsx";
import { ChatProvider } from "./context/ChatContext";

if (window.location.search.includes("mock_confirm")) {
  window.confirm = () => true;
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SessionProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

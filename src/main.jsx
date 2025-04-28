import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { PostProvider } from "./contexts/PostContext.jsx";
import { ScrollProvider } from "./contexts/ScrollContext.jsx";
import { ToastProvider } from "./contexts/NotificationContext.jsx";
import { SocketProvider } from "./contexts/SocketContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <PostProvider>
          <AuthProvider>
            <ScrollProvider>
              <ToastProvider>
                <SocketProvider>
                  <App />
                </SocketProvider>
              </ToastProvider>
            </ScrollProvider>
          </AuthProvider>
        </PostProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: "#4748D4", // Slate 800 dark theme background
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "12px",
              padding: "10px 16px",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            },
            // Custom styles for success toasts
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#34d399", // Emerald 400
                secondary: "#1e293b",
              },
            },
            // Custom styles for error toasts
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#f87171", // Rose 400
                secondary: "#1e293b",
              },
            },
          }}
        />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

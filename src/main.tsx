import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/auth/AuthProvider.tsx";
import { MembersProvider } from "./context/members/MembersProvider.tsx";
import { ExpenseProvider } from "./context/expense/ExpenseProvider.tsx";
import { ThemeProvider } from "./context/theme/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MembersProvider>
          <ExpenseProvider>
            <App />
          </ExpenseProvider>
        </MembersProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);

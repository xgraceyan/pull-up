import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" duration={1200} />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

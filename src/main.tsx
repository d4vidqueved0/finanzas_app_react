import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import dayjs from "dayjs";
import "dayjs/locale/es.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";

dayjs.locale("es");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);

import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Vendors from "./pages/Vendors";
import LinkFlow from "./pages/LinkFlow";
import VendorRedirectManager from "./pages/VendorRedirectManager";
import Redirects from "./pages/Redirects";
import Responses from "./pages/Responses";
import Quotas from "./pages/Quotas";
import Fraud from "./pages/Fraud";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { PanelProvider } from "./contexts/PanelContext";
import { CompletePage, TerminatePage, QuotaFullPage, StudyClosedPage } from "./pages/RedirectPage";
import StartSurvey from "./pages/StartSurvey";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PanelProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/linkflow" element={<LinkFlow />} />
            <Route path="/vendor-redirects" element={<VendorRedirectManager />} />
            <Route path="/redirects" element={<Redirects />} />
            <Route path="/responses" element={<Responses />} />
            <Route path="/quotas" element={<Quotas />} />
            <Route path="/fraud" element={<Fraud />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            {/* Vendor Start Links */}
            <Route path="/start/:projectId/:vendorId" element={<StartSurvey />} />
            {/* Redirect Pages for Survey Respondents */}
            <Route path="/redirect/complete" element={<CompletePage />} />
            <Route path="/redirect/terminate" element={<TerminatePage />} />
            <Route path="/redirect/quota-full" element={<QuotaFullPage />} />
            <Route path="/redirect/study-closed" element={<StudyClosedPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PanelProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

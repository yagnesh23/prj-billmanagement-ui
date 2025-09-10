import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import CreateInvoice from "./pages/CreateInvoice";
import Inventory from "./pages/Inventory";
import Parties from "./pages/Parties";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Customization from "./pages/Customization";
import MultiPlatform from "./pages/MultiPlatform";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="create-invoice" element={<CreateInvoice />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="parties" element={<Parties />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="customization" element={<Customization />} />
            <Route path="multi-platform" element={<MultiPlatform />} />
            <Route path="subscription" element={<Subscription />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

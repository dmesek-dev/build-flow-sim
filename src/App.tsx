import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import LayoutWithSidebar from "./components/Layout/LayoutWithSidebar";
import SingleAppView from "./pages/SingleAppView";
import MultipleAppsView from "./pages/MultipleAppsView";
import BuildHistory from "./pages/BuildHistory";
import PharmacyConfig from "./pages/PharmacyConfig";
import DummyAndroid from "./pages/DummyAndroid";
import CheckIOS from "./pages/CheckIOS";
import NormalizeIcon from "./pages/NormalizeIcon";
import VersionViewer from "./pages/VersionViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <LayoutWithSidebar>
                <SingleAppView />
              </LayoutWithSidebar>
            } 
          />
          <Route 
            path="/multiple-apps" 
            element={
              <LayoutWithSidebar>
                <MultipleAppsView />
              </LayoutWithSidebar>
            } 
          />
          <Route 
            path="/build-history" 
            element={
              <LayoutWithSidebar>
                <BuildHistory />
              </LayoutWithSidebar>
            } 
          />
          <Route 
            path="/pharmacy-config" 
            element={
              <LayoutWithSidebar>
                <PharmacyConfig />
              </LayoutWithSidebar>
            } 
          />
          <Route 
            path="/dummy-android" 
            element={
              <LayoutWithSidebar>
                <DummyAndroid />
              </LayoutWithSidebar>
            } 
          />
          <Route 
            path="/check-ios" 
            element={
              <LayoutWithSidebar>
                <CheckIOS />
              </LayoutWithSidebar>
            } 
          />
          <Route 
            path="/normalize-icon" 
            element={
              <LayoutWithSidebar>
                <NormalizeIcon />
              </LayoutWithSidebar>
            } 
          />
          <Route 
            path="/version-viewer" 
            element={
              <LayoutWithSidebar>
                <VersionViewer />
              </LayoutWithSidebar>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

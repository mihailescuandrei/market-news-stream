import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewsFeedPage from "./pages/NewsFeedPage";
import FinnhubNewsFeedPage from "./pages/FinnhubNewsFeedPage";
import NewsDataFeedPage from "./pages/NewsDataFeedPage";
import AIConfigPage from "./pages/AIConfigPage";
import AIAgentsLogsPage from "./pages/AIAgentsLogsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/newsfeed" element={<NewsFeedPage />} />
          <Route path="/newsfeed-finnhub" element={<FinnhubNewsFeedPage />} />
          <Route path="/newsfeed-newsdata" element={<NewsDataFeedPage />} />
          <Route path="/ai-config" element={<AIConfigPage />} />
          <Route path="/ai-logs" element={<AIAgentsLogsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

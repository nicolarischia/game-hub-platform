import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CounterGame from "./pages/CounterGame";
import WhatIfGame from "./pages/WhatIfGame";
import TimelineGame from "./pages/TimelineGame";
import MemoryGame from "./pages/MemoryGame";
import GuessNumberGame from "./pages/GuessNumberGame";
import ColorMatchGame from "./pages/ColorMatchGame";
import ReactionTimeGame from "./pages/ReactionTimeGame";
import PasswordGame from "./pages/PasswordGame";
import InfiniteCraft from "./pages/InfiniteCraft";
import AuctionGame from "./pages/AuctionGame";
import PlayerStats from "./pages/PlayerStats";
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
          <Route path="/counter" element={<CounterGame />} />
          <Route path="/memory" element={<MemoryGame />} />
          <Route path="/guess-number" element={<GuessNumberGame />} />
          <Route path="/color-match" element={<ColorMatchGame />} />
          <Route path="/reaction-time" element={<ReactionTimeGame />} />
          <Route path="/password-game" element={<PasswordGame />} />
          <Route path="/infinite-craft" element={<InfiniteCraft />} />
          <Route path="/auction-game" element={<AuctionGame />} />
          <Route path="/stats" element={<PlayerStats />} />
          <Route path="/whatif" element={<WhatIfGame />} />
          <Route path="/timeline" element={<TimelineGame />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

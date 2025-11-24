import { TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const DashboardHeader = ({ title, description }: { title?: string; description?: string }) => {
  return (
    <header className="border-b-2 border-terminal-border bg-terminal-panel">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className="hover:bg-terminal-border/20 text-terminal-accent"
          >
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center justify-center w-10 h-10 border-2 border-terminal-accent bg-terminal">
            <TrendingUp className="w-6 h-6 text-terminal-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-terminal-accent font-mono uppercase tracking-wider">
              {title || "MARKET INTELLIGENCE"}
            </h1>
            <p className="text-xs text-terminal-text font-mono uppercase tracking-wide">
              {description || "REAL-TIME STOCK MARKET NEWS FEED"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

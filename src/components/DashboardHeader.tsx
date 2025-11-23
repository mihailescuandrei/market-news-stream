import { TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const DashboardHeader = ({ title, description }: { title?: string; description?: string }) => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title || "Market Intelligence"}</h1>
            <p className="text-sm text-muted-foreground">{description || "Real-time stock market news feed"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

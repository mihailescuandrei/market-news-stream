import { TrendingUp } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Market Intelligence</h1>
            <p className="text-sm text-muted-foreground">Real-time stock market news feed</p>
          </div>
        </div>
      </div>
    </header>
  );
};

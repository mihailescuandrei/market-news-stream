import { TrendingUp } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary">
              <TrendingUp className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Market Intelligence</h1>
              <p className="text-sm text-muted-foreground">Automated trading platform dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Your Trading Platform</h2>
          <p className="text-muted-foreground">
            Access real-time market data, news analysis, and trading tools all in one place
          </p>
        </div>

        <DashboardNav />
      </main>
    </div>
  );
};

export default Index;

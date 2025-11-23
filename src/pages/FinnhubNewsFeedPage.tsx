import { DashboardHeader } from "@/components/DashboardHeader";
import { FinnhubNewsFeed } from "@/components/FinnhubNewsFeed";

const FinnhubNewsFeedPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Finnhub Market News</h2>
          <p className="text-muted-foreground">
            Stay updated with the latest financial news from Finnhub
          </p>
        </div>

        <FinnhubNewsFeed />
      </main>
    </div>
  );
};

export default FinnhubNewsFeedPage;

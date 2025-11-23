import { DashboardHeader } from "@/components/DashboardHeader";
import { NewsDataFeed } from "@/components/NewsDataFeed";

const NewsDataFeedPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="USA Tech News"
        description="Latest technology news from the United States powered by NewsData.io"
      />
      <main className="container mx-auto px-4 py-8">
        <NewsDataFeed />
      </main>
    </div>
  );
};

export default NewsDataFeedPage;

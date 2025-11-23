import { DashboardHeader } from "@/components/DashboardHeader";
import { NewsFeed } from "@/components/NewsFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <NewsFeed />
      </main>
    </div>
  );
};

export default Index;

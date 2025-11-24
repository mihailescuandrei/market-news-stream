import { DashboardHeader } from "@/components/DashboardHeader";
import { NewsFeed } from "@/components/NewsFeed";

const NewsFeedPage = () => {
  return (
    <div className="min-h-screen bg-terminal">
      <DashboardHeader />
      <main className="container mx-auto px-2 py-2">
        <NewsFeed />
      </main>
    </div>
  );
};

export default NewsFeedPage;

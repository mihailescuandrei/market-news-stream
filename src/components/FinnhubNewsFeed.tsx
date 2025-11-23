import { useEffect, useState } from "react";
import { FinnhubNewsCard } from "./FinnhubNewsCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface FinnhubNewsArticle {
  id: string | number;
  headline: string;
  summary: string;
  url: string;
  source: string;
  image: string;
  datetime: number;
  category: string;
  related: string;
}

export const FinnhubNewsFeed = () => {
  const [articles, setArticles] = useState<FinnhubNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const { data, error } = await supabase.functions.invoke('fetch-finnhub-news', {
        body: { category: 'general' }
      });

      if (error) {
        console.error('Error fetching Finnhub news:', error);
        toast({
          title: "Error fetching news",
          description: error.message || "Failed to load news articles. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (data?.articles) {
        setArticles(data.articles);
        if (isRefresh) {
          toast({
            title: "News refreshed",
            description: `Loaded ${data.articles.length} latest articles`,
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching news.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Auto-refresh every 5 minutes to avoid rate limits
    const interval = setInterval(() => {
      fetchNews(true);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {articles.length > 0 ? `Showing ${articles.length} articles • Auto-refreshes every 5 minutes` : 'Loading news...'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchNews(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {articles.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No news articles available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <FinnhubNewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

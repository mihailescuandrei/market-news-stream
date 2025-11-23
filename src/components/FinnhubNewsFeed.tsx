import { useEffect, useState } from "react";
import { FinnhubNewsCard } from "./FinnhubNewsCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
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
      }
    };

    fetchNews();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No news articles available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <FinnhubNewsCard key={article.id} article={article} />
      ))}
    </div>
  );
};

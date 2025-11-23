import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsDataCard } from "./NewsDataCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { NewsDataResponse } from "@/types/newsdata";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const NewsDataFeed = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchNews = async () => {
    console.log("Fetching news from NewsData.io...");
    
    const { data, error } = await supabase.functions.invoke<NewsDataResponse>(
      'fetch-newsdata-news'
    );

    if (error) {
      console.error("Error fetching news:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from NewsData.io");
    }

    console.log("NewsData.io fetch successful:", data.totalResults, "articles");
    return data;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['newsdata-news'],
    queryFn: fetchNews,
    refetchInterval: 300000, // 5 minutes
  });

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast({
        title: "News refreshed",
        description: `Loaded ${data?.results?.length || 0} articles`,
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load news: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.totalResults || 0} articles • Auto-refresh every 5 minutes
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          disabled={refreshing || isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : data?.results && data.results.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {data.results.map((article) => (
            <NewsDataCard key={article.article_id} article={article} />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No articles found</AlertTitle>
          <AlertDescription>
            No USA tech news articles are currently available. Please try again later.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

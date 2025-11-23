import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "./NewsCard";
import { NewsResponse } from "@/types/news";
import { Loader2, RefreshCw, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Get your free API key at: https://www.alphavantage.co/support/#api-key
const ALPHA_VANTAGE_API_KEY = "demo";

const fetchNews = async (tickers?: string): Promise<NewsResponse> => {
  const tickerParam = tickers ? `&tickers=${tickers}` : "";
  const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT${tickerParam}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  console.log("Fetching news from:", url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }
  
  const data = await response.json();
  console.log("API Response:", data);
  
  if (data.Note) {
    throw new Error("API rate limit reached. Please try again later or use your own API key.");
  }
  
  if (data.Information) {
    throw new Error(data.Information);
  }
  
  return data;
};

export const NewsFeed = () => {
  const [tickerFilter, setTickerFilter] = useState("");
  const [searchTicker, setSearchTicker] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["news", searchTicker],
    queryFn: () => fetchNews(searchTicker),
    refetchInterval: autoRefresh ? 60000 : false, // Refresh every 60 seconds if enabled
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch news", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, [error]);

  const handleSearch = () => {
    setSearchTicker(tickerFilter.toUpperCase());
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Refreshing news feed...");
  };

  return (
    <div className="space-y-6">
      <Alert className="border-primary/50 bg-card">
        <Info className="h-4 w-4" />
        <AlertTitle>Using Demo API Key</AlertTitle>
        <AlertDescription>
          This app uses Alpha Vantage's demo API key which has rate limits. 
          Get your free API key at{" "}
          <a 
            href="https://www.alphavantage.co/support/#api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            alphavantage.co
          </a>
          {" "}and replace it in the code for unlimited access.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Filter by ticker (e.g., AAPL, TSLA)"
            value={tickerFilter}
            onChange={(e) => setTickerFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-card border-border"
          />
          <Button onClick={handleSearch} variant="secondary">
            Search
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="min-w-[100px]"
          >
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </Button>
        </div>
      </div>

      {searchTicker && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtering by:</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchTicker("");
              setTickerFilter("");
            }}
          >
            {searchTicker} ✕
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading market news...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div>
              <p className="text-lg font-semibold mb-2">Failed to load news</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "An error occurred while fetching news"}
              </p>
            </div>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {data?.feed && data.feed.length > 0 ? (
            data.feed.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No news articles found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

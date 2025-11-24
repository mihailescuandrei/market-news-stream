import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "./NewsCard";
import { NewsResponse } from "@/types/news";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const fetchNews = async (tickers?: string): Promise<NewsResponse> => {
  console.log("Fetching news via edge function...");
  
  const params = tickers ? { tickers } : {};
  
  try {
    const { data, error } = await supabase.functions.invoke('fetch-news', {
      body: params,
    });
    
    console.log("Edge function response:", { data, error });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Failed to fetch news");
    }
    
    if (data.error) {
      console.error("Data contains error:", data.error);
      throw new Error(data.error);
    }
    
    if (!data.feed || data.feed.length === 0) {
      console.warn("No feed data in response");
      throw new Error("No news articles available");
    }
    
    console.log("Successfully fetched news:", data.feed?.length || 0, "articles");
    
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};

export const NewsFeed = () => {
  const [tickerFilter, setTickerFilter] = useState("");
  const [searchTicker, setSearchTicker] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["news", searchTicker],
    queryFn: () => fetchNews(searchTicker),
    refetchInterval: autoRefresh ? 300000 : false, // 5 minutes to avoid rate limits
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
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
    <div className="space-y-2">
      <div className="bg-terminal-panel border-2 border-terminal-border p-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="FILTER BY TICKER (E.G., AAPL, TSLA)"
              value={tickerFilter}
              onChange={(e) => setTickerFilter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-terminal border-terminal-border text-terminal-accent placeholder:text-terminal-text/50 font-mono uppercase text-sm"
            />
            <Button 
              onClick={handleSearch} 
              className="bg-terminal-accent text-terminal hover:bg-terminal-accent/80 font-mono uppercase text-xs px-6"
            >
              Search
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="icon"
              onClick={handleRefresh}
              disabled={isFetching}
              className="bg-terminal-panel border-2 border-terminal-border text-terminal-accent hover:bg-terminal-border/20"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
            
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`font-mono uppercase text-xs min-w-[140px] ${
                autoRefresh 
                  ? "bg-terminal-accent text-terminal hover:bg-terminal-accent/80" 
                  : "bg-terminal-panel border-2 border-terminal-border text-terminal-accent hover:bg-terminal-border/20"
              }`}
            >
              AUTO-REFRESH {autoRefresh ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        {searchTicker && (
          <div className="flex items-center gap-2 bg-terminal-panel border-2 border-terminal-border p-2 px-4">
            <span className="text-xs text-terminal-text font-mono uppercase">ACTIVE FILTER:</span>
            <Button
              size="sm"
              onClick={() => {
                setSearchTicker("");
                setTickerFilter("");
              }}
              className="bg-terminal-danger text-white hover:bg-terminal-danger/80 font-mono uppercase text-xs h-7"
            >
              {searchTicker} ✕
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-terminal-panel border-2 border-terminal-border">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-terminal-accent" />
            <p className="text-sm text-terminal-text font-mono uppercase">Loading market data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 bg-terminal-panel border-2 border-terminal-border">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-terminal-danger" />
            <div>
              <p className="text-lg font-semibold mb-2 text-terminal-accent font-mono uppercase">SYSTEM ERROR</p>
              <p className="text-sm text-terminal-text font-mono">
                {error instanceof Error ? error.message : "An error occurred while fetching news"}
              </p>
            </div>
            <Button 
              onClick={handleRefresh} 
              className="bg-terminal-accent text-terminal hover:bg-terminal-accent/80 font-mono uppercase"
            >
              Retry Connection
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          {data?.feed && data.feed.length > 0 ? (
            data.feed.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))
          ) : (
            <div className="text-center py-20 bg-terminal-panel border-2 border-terminal-border">
              <p className="text-lg text-terminal-text font-mono uppercase">NO DATA AVAILABLE</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

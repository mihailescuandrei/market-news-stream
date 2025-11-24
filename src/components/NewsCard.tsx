import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsArticle } from "@/types/news";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = ({ article }: NewsCardProps) => {
  const getSentimentColor = (score: number) => {
    if (score > 0.15) return "text-terminal-success";
    if (score < -0.15) return "text-terminal-danger";
    return "text-terminal-text";
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.15) return <TrendingUp className="w-3 h-3" />;
    if (score < -0.15) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getSentimentBadge = (label: string) => {
    const isBullish = label.toLowerCase().includes("bullish");
    const isBearish = label.toLowerCase().includes("bearish");
    
    return (
      <div className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider border ${
        isBullish 
          ? "border-terminal-success text-terminal-success bg-terminal-success/10" 
          : isBearish 
          ? "border-terminal-danger text-terminal-danger bg-terminal-danger/10" 
          : "border-terminal-border text-terminal-text bg-terminal-panel"
      }`}>
        {label}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(9, 11);
      const minute = dateString.substring(11, 13);
      
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-terminal-panel border-2 border-terminal-border hover:border-terminal-accent transition-colors duration-200">
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Metadata */}
          <div className="lg:col-span-2 space-y-2 border-r border-terminal-border/50 pr-4">
            <div className="space-y-1">
              <div className="text-[10px] text-terminal-text/60 font-mono uppercase tracking-wider">Source</div>
              <div className="text-xs text-terminal-accent font-mono">{article.source}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-[10px] text-terminal-text/60 font-mono uppercase tracking-wider">Published</div>
              <div className="text-xs text-terminal-text font-mono">{formatDate(article.time_published)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-[10px] text-terminal-text/60 font-mono uppercase tracking-wider">Sentiment</div>
              <div className={`flex items-center gap-1 ${getSentimentColor(article.overall_sentiment_score)}`}>
                {getSentimentIcon(article.overall_sentiment_score)}
                <span className="text-xs font-mono font-bold">
                  {article.overall_sentiment_score.toFixed(3)}
                </span>
              </div>
              <div className="mt-1">
                {getSentimentBadge(article.overall_sentiment_label)}
              </div>
            </div>
          </div>
          
          {/* Middle Column - Content */}
          <div className="lg:col-span-7 space-y-3">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <h3 className="text-base font-bold text-terminal-accent hover:text-terminal-accent/80 transition-colors leading-tight font-mono uppercase tracking-wide flex items-start gap-2">
                {article.title}
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
              </h3>
            </a>
            
            <p className="text-sm text-terminal-text leading-relaxed font-mono">
              {article.summary}
            </p>
          </div>
          
          {/* Right Column - Tickers */}
          <div className="lg:col-span-3 border-l border-terminal-border/50 pl-4">
            <div className="space-y-2">
              <div className="text-[10px] text-terminal-text/60 font-mono uppercase tracking-wider">Related Tickers</div>
              {article.ticker_sentiment && article.ticker_sentiment.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {article.ticker_sentiment.slice(0, 8).map((ticker, idx) => (
                    <div 
                      key={idx} 
                      className="bg-terminal border border-terminal-border px-2 py-1 text-terminal-accent font-mono text-xs font-bold hover:border-terminal-accent transition-colors"
                    >
                      {ticker.ticker}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-terminal-text/50 font-mono">N/A</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

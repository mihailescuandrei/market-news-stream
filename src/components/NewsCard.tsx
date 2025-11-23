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
    if (score > 0.15) return "text-positive";
    if (score < -0.15) return "text-negative";
    return "text-muted-foreground";
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.15) return <TrendingUp className="w-4 h-4" />;
    if (score < -0.15) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getSentimentBadge = (label: string) => {
    const variant = label.toLowerCase().includes("bullish") 
      ? "default" 
      : label.toLowerCase().includes("bearish") 
      ? "destructive" 
      : "secondary";
    return <Badge variant={variant} className="text-xs">{label}</Badge>;
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
    <Card className="hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground font-medium">{article.source}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{formatDate(article.time_published)}</span>
            </div>
            <CardTitle className="text-lg leading-tight mb-2">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                {article.title}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </CardTitle>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          {getSentimentBadge(article.overall_sentiment_label)}
          <div className={`flex items-center gap-1 ${getSentimentColor(article.overall_sentiment_score)}`}>
            {getSentimentIcon(article.overall_sentiment_score)}
            <span className="text-xs font-medium">
              {article.overall_sentiment_score.toFixed(3)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          {article.summary}
        </CardDescription>
        
        {article.ticker_sentiment && article.ticker_sentiment.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.ticker_sentiment.slice(0, 5).map((ticker, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {ticker.ticker}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

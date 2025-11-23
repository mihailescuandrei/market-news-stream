import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";

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

interface FinnhubNewsCardProps {
  article: FinnhubNewsArticle;
}

export const FinnhubNewsCard = ({ article }: FinnhubNewsCardProps) => {
  const formattedDate = format(new Date(article.datetime * 1000), "MMM dd, yyyy HH:mm");

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      {article.image && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <img 
            src={article.image} 
            alt={article.headline}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {article.source}
          </Badge>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <CardTitle className="text-xl line-clamp-2">
          {article.headline}
        </CardTitle>
        {article.summary && (
          <CardDescription className="line-clamp-3">
            {article.summary}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {article.related && (
            <Badge variant="outline" className="text-xs">
              {article.related}
            </Badge>
          )}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Read more <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

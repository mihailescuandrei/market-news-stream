import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { NewsDataArticle } from "@/types/newsdata";
import { formatDistanceToNow } from "date-fns";

interface NewsDataCardProps {
  article: NewsDataArticle;
}

export const NewsDataCard = ({ article }: NewsDataCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">
            <a 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {article.title}
            </a>
          </CardTitle>
          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
        <CardDescription className="text-xs">
          {article.source_name} • {formatDate(article.pubDate)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {article.image_url && (
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.description}
        </p>
        {article.category && article.category.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.category.map((cat, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

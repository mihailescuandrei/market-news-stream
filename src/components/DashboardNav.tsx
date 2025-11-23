import { TrendingUp, BarChart3, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardNav = () => {
  const features = [
    {
      title: "News Feed - Alphavantage",
      description: "Real-time stock market news with sentiment analysis from Alpha Vantage",
      icon: Newspaper,
      href: "/newsfeed",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "News Feed - Finnhub",
      description: "Market news and updates from Finnhub financial data provider",
      icon: Newspaper,
      href: "/newsfeed-finnhub",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "News Feed - NewsData.io",
      description: "Latest USA technology news from NewsData.io",
      icon: Newspaper,
      href: "/newsfeed-newsdata",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Price Charts",
      description: "Coming soon - Interactive price charts and technical analysis",
      icon: BarChart3,
      href: "#",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      disabled: true,
    },
    {
      title: "Portfolio",
      description: "Coming soon - Track your holdings and get personalized insights",
      icon: TrendingUp,
      href: "#",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      disabled: true,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => {
        const content = (
          <Card 
            className={`transition-all duration-200 ${
              feature.disabled 
                ? "opacity-60 cursor-not-allowed" 
                : "hover:border-primary/50 hover:shadow-lg cursor-pointer"
            }`}
          >
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!feature.disabled && (
                <div className="text-sm text-primary font-medium">
                  Open →
                </div>
              )}
              {feature.disabled && (
                <div className="text-sm text-muted-foreground">
                  Under development
                </div>
              )}
            </CardContent>
          </Card>
        );

        if (feature.disabled) {
          return <div key={feature.title}>{content}</div>;
        }

        return (
          <Link key={feature.title} to={feature.href}>
            {content}
          </Link>
        );
      })}
    </div>
  );
};

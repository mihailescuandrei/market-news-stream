export interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image_url?: string;
  source_id: string;
  source_name: string;
  source_url: string;
  source_icon?: string;
  category: string[];
  country: string[];
  language: string;
}

export interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
}

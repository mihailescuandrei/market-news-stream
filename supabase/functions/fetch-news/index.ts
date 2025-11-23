import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse body for POST requests, or use query params for GET
    let tickers = '';
    
    if (req.method === 'POST') {
      const body = await req.json();
      tickers = body.tickers || '';
    } else {
      const url = new URL(req.url);
      tickers = url.searchParams.get('tickers') || '';
    }
    
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    
    if (!apiKey) {
      throw new Error('Alpha Vantage API key not configured');
    }

    const tickerParam = tickers ? `&tickers=${tickers}` : "";
    const alphaVantageUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT${tickerParam}&apikey=${apiKey}`;
    
    console.log('Fetching news from Alpha Vantage...');
    
    const response = await fetch(alphaVantageUrl);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API errors
    if (data.Note) {
      throw new Error('API rate limit reached. Please try again later.');
    }
    
    if (data.Information) {
      throw new Error(data.Information);
    }
    
    console.log('Successfully fetched news articles:', data.feed?.length || 0);
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch news';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

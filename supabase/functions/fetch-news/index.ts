import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: { 
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      } 
    });
  }

  try {
    // Parse body for POST requests
    let tickers = '';
    
    if (req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const body = await req.json();
          tickers = body?.tickers || '';
        }
      } catch (parseError) {
        console.warn('Failed to parse request body:', parseError);
        // Continue with empty tickers
      }
    } else {
      const url = new URL(req.url);
      tickers = url.searchParams.get('tickers') || '';
    }
    
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    
    if (!apiKey) {
      console.error('No API key found');
      return new Response(
        JSON.stringify({ error: 'Alpha Vantage API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const tickerParam = tickers ? `&tickers=${tickers}` : "";
    const alphaVantageUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT${tickerParam}&apikey=${apiKey}`;
    
    console.log('Fetching news from Alpha Vantage...', { tickers });
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    try {
      const response = await fetch(alphaVantageUrl, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('Alpha Vantage response keys:', Object.keys(data));
      
      // Check for API errors - but only if there's no feed data
      if (data.Note && !data.feed) {
        console.error('Alpha Vantage rate limit:', data.Note);
        throw new Error('API rate limit reached. Please wait a moment and try again.');
      }
      
      if (data.Information && !data.feed) {
        console.error('Alpha Vantage info message:', data.Information);
        throw new Error(data.Information);
      }
      
      // Log any warnings but continue if we have data
      if (data.Note) {
        console.warn('Alpha Vantage warning:', data.Note);
      }
      
      console.log('Successfully fetched news articles:', data.feed?.length || 0);
      
      // Return error if no feed data
      if (!data.feed || data.feed.length === 0) {
        throw new Error('No news articles returned from Alpha Vantage');
      }
      
      return new Response(
        JSON.stringify(data),
        { 
          status: 200,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Request to Alpha Vantage timed out');
      }
      throw fetchError;
    }
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

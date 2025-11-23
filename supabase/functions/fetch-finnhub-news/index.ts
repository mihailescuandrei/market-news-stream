import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');
    
    if (!finnhubApiKey) {
      console.error('FINNHUB_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Finnhub API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let category = 'general';
    
    // Parse request body if present
    try {
      const body = await req.text();
      if (body) {
        const parsed = JSON.parse(body);
        category = parsed.category || 'general';
      }
    } catch (e) {
      console.log('No body or invalid JSON, using default category');
    }

    console.log(`Fetching news from Finnhub... { category: "${category}" }`);

    // Create AbortController with 25 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    let response;
    try {
      response = await fetch(
        `https://finnhub.io/api/v1/news?category=${category}&token=${finnhubApiKey}`,
        { signal: controller.signal }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Finnhub API request timed out after 25 seconds');
        return new Response(
          JSON.stringify({ error: 'Request timeout. Please try again.' }),
          { 
            status: 504, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      throw fetchError;
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Finnhub API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Finnhub API error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      console.log('No news articles returned from Finnhub');
      return new Response(
        JSON.stringify({ articles: [] }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Successfully fetched news articles: ${data.length}`);

    // Transform Finnhub response to match our frontend expectations
    const articles = data.map((article: any) => ({
      id: article.id || `${article.headline}-${article.datetime}`,
      headline: article.headline,
      summary: article.summary || '',
      url: article.url,
      source: article.source,
      image: article.image || '',
      datetime: article.datetime,
      category: article.category || category,
      related: article.related || '',
    }));

    return new Response(
      JSON.stringify({ articles }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-finnhub-news function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

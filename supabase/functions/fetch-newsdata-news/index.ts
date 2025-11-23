import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('NewsData.io fetch function started');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('NEWSDATA_API_KEY');
    
    if (!apiKey) {
      console.error('NewsData.io API key not found');
      return new Response(
        JSON.stringify({ error: 'NewsData.io API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Build URL for latest USA tech news
    const url = new URL('https://newsdata.io/api/1/news');
    url.searchParams.append('apikey', apiKey);
    url.searchParams.append('country', 'us');
    url.searchParams.append('category', 'technology');
    url.searchParams.append('language', 'en');

    console.log('Fetching news from NewsData.io:', url.toString().replace(apiKey, 'API_KEY_HIDDEN'));

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('NewsData.io API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `NewsData.io API error: ${response.status} ${response.statusText}`,
          details: errorText 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const data = await response.json();
    
    console.log('NewsData.io response status:', data.status);
    console.log('Total results:', data.totalResults);
    console.log('Articles count:', data.results?.length || 0);

    // Handle rate limiting gracefully
    if (data.status === 'error') {
      console.error('NewsData.io error:', data.results?.message || 'Unknown error');
      
      if (data.results?.message?.includes('rate limit')) {
        return new Response(
          JSON.stringify({
            error: 'API rate limit reached. Please wait a moment and try again.',
            code: 'RATE_LIMITED',
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }
      
      return new Response(
        JSON.stringify({ error: data.results?.message || 'Unknown error' }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Return empty feed if no articles
    if (!data.results || data.results.length === 0) {
      console.warn('No news articles returned from NewsData.io');
      return new Response(
        JSON.stringify({
          status: 'success',
          totalResults: 0,
          results: [],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error in fetch-newsdata-news function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

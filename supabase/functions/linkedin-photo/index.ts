const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || !url.includes('linkedin.com/in/')) {
      return new Response(JSON.stringify({ error: 'Invalid LinkedIn URL' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch the LinkedIn public profile page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.log('LinkedIn fetch failed:', response.status, body.substring(0, 200));
      return new Response(JSON.stringify({ error: 'Could not fetch LinkedIn profile', photoUrl: null }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await response.text();

    // Try multiple patterns to extract profile photo URL from public LinkedIn page
    let photoUrl: string | null = null;

    // Pattern 1: og:image meta tag (most reliable for public profiles)
    const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
      || html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);
    if (ogMatch?.[1]) {
      const candidate = ogMatch[1];
      // Filter out generic LinkedIn logos/placeholders
      if (!candidate.includes('static.licdn.com/sc/h/') && !candidate.includes('aero-v1')) {
        photoUrl = candidate;
      }
    }

    // Pattern 2: profile photo in JSON-LD
    if (!photoUrl) {
      const jsonLdMatch = html.match(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
      if (jsonLdMatch?.[1]) {
        try {
          const jsonLd = JSON.parse(jsonLdMatch[1]);
          if (jsonLd.image?.contentUrl) {
            photoUrl = jsonLd.image.contentUrl;
          } else if (typeof jsonLd.image === 'string') {
            photoUrl = jsonLd.image;
          }
        } catch {
          // JSON parse failed, skip
        }
      }
    }

    // Pattern 3: img tag with profile photo class patterns
    if (!photoUrl) {
      const imgMatch = html.match(/img[^>]+(?:profile-photo|pv-top-card-profile-picture|evi-image)[^>]+src="([^"]+)"/i);
      if (imgMatch?.[1]) {
        photoUrl = imgMatch[1];
      }
    }

    return new Response(JSON.stringify({ photoUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal error', photoUrl: null }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

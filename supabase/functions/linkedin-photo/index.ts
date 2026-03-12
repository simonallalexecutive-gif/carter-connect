const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function extractUsername(url: string): string | null {
  const match = url.match(/linkedin\.com\/in\/([^/?#]+)/);
  return match?.[1] || null;
}

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

    const username = extractUsername(url);
    if (!username) {
      return new Response(JSON.stringify({ error: 'Could not extract username', photoUrl: null }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Strategy 1: Try unavatar.io (aggregates multiple sources, very reliable)
    const unavatarUrl = `https://unavatar.io/linkedin/${username}`;
    try {
      const checkRes = await fetch(unavatarUrl, { method: 'HEAD', redirect: 'follow' });
      if (checkRes.ok) {
        const contentType = checkRes.headers.get('content-type') || '';
        // unavatar returns an image if found, or a fallback/error
        if (contentType.startsWith('image/')) {
          console.log('Found photo via unavatar.io for', username);
          return new Response(JSON.stringify({ photoUrl: unavatarUrl }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    } catch (e) {
      console.log('unavatar.io failed:', e);
    }

    // Strategy 2: Scrape LinkedIn public page (og:image)
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    try {
      const parsed = new URL(normalizedUrl);
      normalizedUrl = `${parsed.origin}${parsed.pathname}`;
    } catch { /* proceed as-is */ }

    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.log('LinkedIn fetch failed:', response.status);
      return new Response(JSON.stringify({ error: 'Could not fetch profile', photoUrl: null }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await response.text();
    let photoUrl: string | null = null;

    // og:image
    const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
      || html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);
    if (ogMatch?.[1]) {
      const candidate = ogMatch[1];
      if (!candidate.includes('static.licdn.com/sc/h/') && !candidate.includes('aero-v1')) {
        photoUrl = candidate;
      }
    }

    // JSON-LD
    if (!photoUrl) {
      const jsonLdMatch = html.match(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
      if (jsonLdMatch?.[1]) {
        try {
          const jsonLd = JSON.parse(jsonLdMatch[1]);
          if (jsonLd.image?.contentUrl) photoUrl = jsonLd.image.contentUrl;
          else if (typeof jsonLd.image === 'string') photoUrl = jsonLd.image;
        } catch { /* skip */ }
      }
    }

    console.log('LinkedIn scrape result for', username, ':', photoUrl ? 'found' : 'not found');
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

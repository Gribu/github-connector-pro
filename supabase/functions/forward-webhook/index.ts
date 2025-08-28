import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { country, ref_id, url, timestamp } = await req.json();

    if (!country || typeof country !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'country is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ref_id can be null, but if present should be string
    if (ref_id !== null && ref_id !== undefined && typeof ref_id !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'ref_id must be a string or null' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = { country, ref_id, url, timestamp };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    let webhookRes: Response | null = null;
    let errorText: string | null = null;

    try {
      webhookRes = await fetch(
        'https://optimussync.app.n8n.cloud/webhook/1a6b7306-9d4c-4968-bbbc-3c5a5d86cbe4',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );
    } catch (err) {
      errorText = (err as Error)?.message || 'Fetch error';
    } finally {
      clearTimeout(timeout);
    }

    if (!webhookRes || !webhookRes.ok) {
      const status = webhookRes?.status ?? 500;
      const statusText = webhookRes?.statusText ?? 'Unknown error';
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Webhook request failed',
          details: errorText || statusText,
          status,
        }),
        { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let responseBody: any = null;
    try {
      // n8n webhooks often return empty body, so guard parsing
      const text = await webhookRes.text();
      responseBody = text ? JSON.parse(text) : null;
    } catch (_) {
      responseBody = null;
    }

    return new Response(
      JSON.stringify({ success: true, forwarded: true, response: responseBody }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('forward-webhook error:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message || 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
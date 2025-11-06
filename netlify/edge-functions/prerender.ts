import { Context } from "https://edge.netlify.com";

// List of crawler substrings to match in User-Agent header
const CRAWLER_UA_SUBSTRINGS = [
  "googlebot",
  "bingbot",
  "yandex",
  "duckduckbot",
  "baiduspider",
  "facebookexternalhit",
  "twitterbot",
  "rogerbot",
  "linkedinbot",
  "embedly",
  "quora link preview",
  "showyoubot",
  "outbrain",
  "pinterest",
  "slackbot",
  "vkshare",
  "w3c_validator"
];

// Your Prerender.io configuration
auth const PRERENDER_TOKEN = "V85u5WS8kbxdXKCF5KuR";
const PRERENDER_SERVICE_URL = "https://service.prerender.io";
const SITE_ORIGIN = "https://designs4u.com";

/**
 * Check if the given User-Agent string belongs to a known crawler.
 */
function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_UA_SUBSTRINGS.some((sub) => ua.includes(sub));
}

export default async function handler(request: Request, context: Context) {
  const userAgent = request.headers.get("user-agent");

  // Skip if not a crawler or missing UA
  if (!isCrawler(userAgent)) {
    // Continue to the next handler (static file, functions, or SPA)
    return await context.next();
  }

  // Build the target URL for Prerender.io (keep path + query)
  const url = new URL(request.url);
  const targetUrl = `${PRERENDER_SERVICE_URL}/${SITE_ORIGIN}${url.pathname}${url.search}`;

  // Forward request to Prerender.io with required token and UA headers
  const prerenderResponse = await fetch(targetUrl, {
    headers: {
      "X-Prerender-Token": PRERENDER_TOKEN,
      "User-Agent": userAgent || "crawler"
    },
    // Propagate the original request method (GET/HEAD etc.) and body if needed
    method: request.method,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
  });

  // If Prerender fails, fallback to normal response
  if (!prerenderResponse.ok) {
    return await context.next();
  }

  // Return Prerender.io's response to the crawler
  return new Response(prerenderResponse.body, {
    status: prerenderResponse.status,
    headers: prerenderResponse.headers,
  });
}
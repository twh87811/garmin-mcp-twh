import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { authHandler } from "./auth";
import type { Env } from "./env";
import { mcpHandler } from "./mcp";

// The provider needs the Worker's public URL, which comes from the PUBLIC_URL variable,
// so it is built on the first request and reused afterwards.
let provider: OAuthProvider<Env> | undefined;

function getProvider(env: Env): OAuthProvider<Env> {
  if (!provider) {
    const origin = new URL(env.PUBLIC_URL).origin;
    // /mcp requires a valid OAuth access token; everything else (login pages, OAuth endpoints) is public.
    provider = new OAuthProvider<Env>({
      apiRoute: "/mcp",
      apiHandler: mcpHandler as never,
      defaultHandler: authHandler as never,
      authorizeEndpoint: "/authorize",
      tokenEndpoint: "/token",
      clientRegistrationEndpoint: "/register",
      accessTokenTTL: 60 * 60,
      resourceMetadata: {
        resource: `${origin}/mcp`,
        authorization_servers: [origin],
        resource_name: "Garmin MCP",
      },
    });
  }
  return provider;
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (!env.PUBLIC_URL) return Promise.resolve(new Response("PUBLIC_URL is not set", { status: 500 }));
    return getProvider(env).fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;

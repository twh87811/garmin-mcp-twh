import type { OAuthHelpers } from "@cloudflare/workers-oauth-provider";

export interface Env {
  OAUTH_KV: KVNamespace;
  OAUTH_PROVIDER: OAuthHelpers;
  ALLOWED_GITHUB_LOGIN: string;
  PUBLIC_URL: string;
  GARMIN_API_KEY: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

/** What the OAuth provider stores in each grant and hands to the MCP handler. */
export interface Props extends Record<string, unknown> {
  login: string;
}

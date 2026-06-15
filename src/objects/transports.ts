import type { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

/**
 * Live registry of active MCP sessions, keyed by session ID.
 * Mutable shared state — one instance across all importers (ES modules are singletons).
 * Added to in the POST `initialize` branch; removed from in transport.onclose.
 */
export const transports: Record<string, StreamableHTTPServerTransport> = {};

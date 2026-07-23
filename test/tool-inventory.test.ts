import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createApp, createMcpServer, ENTRYWAY_URL, MCP_ALLOWED_HOSTS, TOOL_NAMES, redact } from "../src/server.js";

async function rpc(baseUrl: string, method: string, id: number) {
  const response = await fetch(`${baseUrl}/mcp`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", host: "localhost:9113" },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params: method === "initialize" ? {
      protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "1.0.0" },
    } : {} }),
  });
  assert.equal(response.status, 200);
  return response.json() as Promise<{ result: Record<string, any> }>;
}

test("serves the reviewed finite read-only tool inventory", () => {
  assert.deepEqual(TOOL_NAMES, [
    "get_profile", "search_profiles", "search_posts", "get_author_feed", "get_posts",
    "get_post_thread", "list_followers", "list_follows", "get_home_timeline",
    "list_notifications", "get_kai_liked_posts",
  ]);
  for (const name of TOOL_NAMES) assert.doesNotMatch(name, /(?:create|update|delete|follow$|unfollow|like$|unlike|repost|mute|block|report|moderation|chat|account|login|refresh|http|xrpc|url)/i);
  assert.ok(createMcpServer());
});

test("uses the fixed entryway, bounded local hosts, and redacts credentials", () => {
  assert.equal(ENTRYWAY_URL, "https://bsky.social");
  assert.deepEqual(MCP_ALLOWED_HOSTS, ["localhost:9113", "127.0.0.1:9113"]);
  assert.deepEqual(redact({ text: "safe", accessJwt: "hidden", appPassword: "hidden", nested: { sessionToken: "hidden", uri: "at://safe" } }), { text: "safe", nested: { uri: "at://safe" } });
});

test("MCP initialize identifies the service and tools/list is exactly reviewed", async (t) => {
  const listener = await new Promise<import("node:net").Server>((resolve) => {
    const server = createApp().listen(9113, "127.0.0.1", () => resolve(server));
  });
  t.after(() => listener.close());
  const initialize = await rpc("http://127.0.0.1:9113", "initialize", 1);
  assert.equal(initialize.result.serverInfo.name, "bluesky-mcp");
  const tools = await rpc("http://127.0.0.1:9113", "tools/list", 2);
  assert.deepEqual((tools.result.tools as Array<{ name: string }>).map((tool) => tool.name), TOOL_NAMES);
});

test("source has no mutation or generic network escape hatch", async () => {
  const source = await readFile(new URL("../../src/server.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /(?:createRecord|deleteRecord|putRecord|com\.atproto\.repo\.(?:create|delete|put)|fetch\s*\(|axios|arbitrary)/i);
});

# Feature inventory

## bluesky-mcp

Authenticated, strictly read-only Bluesky MCP over streamable HTTP. It serves
`/healthz` plus `/mcp`, creates and refreshes its internal AT Protocol session
with an app password, and exposes exactly these 11 bounded read tools:

- `get_profile`, `search_profiles`, `search_posts`, `get_author_feed`
- `get_posts`, `get_post_thread`, `list_followers`, `list_follows`
- `get_home_timeline`, `list_notifications`, `get_kai_liked_posts`

The service excludes write actions, generic network/XRPC access, record tools,
and session tools. Credential-shaped values are removed from all tool results.
The source repository publishes its non-root image; deployment policy and
secret mapping are owned separately.

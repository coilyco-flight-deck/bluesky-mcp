# The service icon

`src/icon.ts` exports `SERVICE_ICON`, the Bluesky butterfly mark, wired into
the server's `initialize` response as `serverInfo.icons`. Clients that render
server icons, such as the claude.ai and ChatGPT connector tiles, show the brand
mark instead of a generic placeholder.

## Why it is inline base64

The mark rides inside the module as a data URI rather than being served over
HTTP or read from a file beside the build output. That buys two things:

- **No external dependency.** Nothing has to be reachable at initialize time,
  so the icon cannot fail separately from the server.
- **No dist-relative asset path.** A path relative to the build output breaks
  the moment packaging changes, and this module moves with its own contents.

The source is the official butterfly from the bsky.app touch icon,
palette-compressed to stay under the 10KB ChatGPT icon cap. `steam-ops` carries
the same shape in its `_steam_icon`.

## See also

- [FEATURES.md](FEATURES.md) - inventory of what ships today.
- [README.md](../README.md) - human-facing intro.
- [AGENTS.md](../AGENTS.md) - agent operating rules.

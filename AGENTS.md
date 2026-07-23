# Agent instructions

## Scope

`bluesky-mcp` is one TypeScript process that exposes Kai's authenticated
Bluesky reads over streamable HTTP. It is intentionally a finite, read-only
adapter. There is no frontend, database, generic network proxy, or mutation
surface.

## Repo boundaries

This repository owns source, tests, image construction, and image publishing.
Deployment manifests, secret mappings, external access policy, and rollout
automation belong only in `coilyco-bridge/deploy`.

## Commands

Run development commands through `ward` using the verbs in `.ward/ward.yaml`.
Do not put credentials, session values, deployment hostnames, or infrastructure
details in tracked files or logs.

## Safety

- Keep the reviewed 11-tool inventory exact and read-only.
- Do not add arbitrary XRPC, URL, raw HTTP, login, session, or record tools.
- The app password and SDK session tokens must remain process-local and be
  redacted from all returned values and errors.
- Preserve bounded page sizes, post batch size, and thread depth.

## Validation

Run `ward lint`, `ward typecheck`, `ward test`, `ward audit`, and `ward
precommit` before landing source changes.

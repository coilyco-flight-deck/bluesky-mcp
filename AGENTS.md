---
ward:
  workflow: merge-remote-main
---
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

## Release

After validation, main CI publishes the private image
`forgejo.coilysiren.me/coilyco-flight-deck/bluesky-mcp:<full-source-sha>`
through the trusted deploy lane. The runner supplies `REGISTRY_TOKEN` for
package writes. `coilyco-bridge/deploy` owns the separate read-only
`forgejo-registry` pull credential and rollout.

## Checkout residency

This repo is not in Agent Compose's `repository-plan.yaml`, so it has no
resident checkout under `~/projects/<owner>/`. That is intentional. Work it
from a task-scoped temporary clone, and remove that clone once the work lands.

A temporary root can be purged at any time, so commit and push before pausing,
switching tasks, or ending a session. The remote is the only durable artifact.

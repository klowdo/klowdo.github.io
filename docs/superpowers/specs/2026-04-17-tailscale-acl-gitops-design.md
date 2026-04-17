# Tailscale ACL GitOps

## Overview

Move Tailscale ACL management from the admin console to a private GitHub repo with CI/CD. PRs validate ACL changes via dry-run; merges to `main` deploy to the tailnet automatically.

## Repo

- **Name**: `klowdo/tailscale-acl`
- **Visibility**: Private
- **Created via**: `gh repo create klowdo/tailscale-acl --private`

## Structure

```
klowdo/tailscale-acl
├── policy.hujson
├── .github/
│   └── workflows/
│       ├── validate.yml
│       └── deploy.yml
└── README.md
```

## Tool

[`gitops-pusher`](https://github.com/tailscale/gitops-pusher) — Tailscale's official GitOps tool. Invoked via `go run tailscale.com/cmd/gitops-pusher@latest`.

## Workflows

### `validate.yml` — PR validation

- **Trigger**: `pull_request` on `main`
- **Steps**:
  1. Checkout repo
  2. Setup Go
  3. Run `go run tailscale.com/cmd/gitops-pusher@latest --dry-run`
- **Environment variables**: `TS_OAUTH_CLIENT_ID`, `TS_OAUTH_CLIENT_SECRET`, `TS_TAILNET` from repo secrets

### `deploy.yml` — deploy on merge

- **Trigger**: `push` to `main`, paths filter on `policy.hujson`
- **Concurrency**: group `acl-deploy`, cancel-in-progress `false`
- **Steps**:
  1. Checkout repo
  2. Setup Go
  3. Run `go run tailscale.com/cmd/gitops-pusher@latest`
- **Environment variables**: same secrets as validate

## Secrets

Set in GitHub repo settings (`Settings > Secrets and variables > Actions`):

| Secret | Source |
|--------|--------|
| `TS_OAUTH_CLIENT_ID` | Tailscale admin > Settings > OAuth clients (scope: `acl`) |
| `TS_OAUTH_CLIENT_SECRET` | Paired with OAuth client ID |
| `TS_TAILNET` | Your tailnet name (e.g., `example.github`) |

## Manual Steps (not automated)

1. Create Tailscale OAuth client with `acl` scope in admin console
2. Add three secrets to `klowdo/tailscale-acl` repo settings
3. Export current ACL from Tailscale admin console
4. Save as `policy.hujson` in repo root, commit, push

## Out of Scope

- Terraform/IaC for other Tailscale resources
- ACL testing beyond `gitops-pusher` dry-run
- Automated initial ACL export from Tailscale API

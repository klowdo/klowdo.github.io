# Tailscale ACL GitOps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a private GitHub repo that manages Tailscale ACLs via GitOps — PR validation with dry-run, auto-deploy on merge.

**Architecture:** Private repo `klowdo/tailscale-acl` with `policy.hujson` at root. Two GitHub Actions workflows: `validate.yml` (PR dry-run) and `deploy.yml` (push to main). Both use Tailscale's `gitops-pusher` via `go run`. OAuth client credentials stored as repo secrets.

**Tech Stack:** GitHub Actions, Go (for gitops-pusher), HuJSON, gh CLI

---

## File Map

| File | Responsibility |
|------|---------------|
| `policy.hujson` | Tailscale ACL policy (placeholder — user replaces with real export) |
| `.github/workflows/validate.yml` | PR check: dry-run ACL validation |
| `.github/workflows/deploy.yml` | Deploy ACL on merge to main |
| `README.md` | Setup instructions for secrets and OAuth client |

---

### Task 1: Create private GitHub repo

**Files:**
- Create: repo `klowdo/tailscale-acl` on GitHub

- [ ] **Step 1: Create repo with gh CLI**

```bash
cd /home/klowdo/dev/github/klowdo-tailscale-acl
gh repo create klowdo/tailscale-acl --private --clone --description "Tailscale ACL GitOps"
```

Note: `--clone` will clone into current directory. If the directory already has contents, use:
```bash
gh repo create klowdo/tailscale-acl --private --description "Tailscale ACL GitOps"
cd /home/klowdo/dev/github/klowdo-tailscale-acl
git init
git remote add origin git@github.com:klowdo/tailscale-acl.git
```

- [ ] **Step 2: Verify remote**

```bash
git remote -v
```

Expected: `origin git@github.com:klowdo/tailscale-acl.git`

---

### Task 2: Add placeholder policy.hujson

**Files:**
- Create: `policy.hujson`

- [ ] **Step 1: Create placeholder policy file**

```hujson
// This is a placeholder. Replace with your actual Tailscale ACL policy
// exported from the admin console.
//
// See: https://tailscale.com/kb/1018/acls
{
  "acls": [
    {
      "action": "accept",
      "src":    ["*"],
      "dst":    ["*:*"],
    },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add policy.hujson
git commit -m "feat: add placeholder ACL policy"
```

---

### Task 3: Add validate workflow

**Files:**
- Create: `.github/workflows/validate.yml`

- [ ] **Step 1: Create workflow file**

```yaml
name: Validate ACL

on:
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-go@v5
        with:
          go-version: stable
          cache: false

      - name: Validate ACL (dry-run)
        env:
          TS_OAUTH_CLIENT_ID: ${{ secrets.TS_OAUTH_CLIENT_ID }}
          TS_OAUTH_CLIENT_SECRET: ${{ secrets.TS_OAUTH_CLIENT_SECRET }}
          TS_TAILNET: ${{ secrets.TS_TAILNET }}
        run: go run tailscale.com/cmd/gitops-pusher@latest --policy-file policy.hujson --dry-run
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/validate.yml
git commit -m "feat: add PR validation workflow with gitops-pusher dry-run"
```

---

### Task 4: Add deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create workflow file**

```yaml
name: Deploy ACL

on:
  push:
    branches: [main]
    paths:
      - policy.hujson

concurrency:
  group: acl-deploy
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-go@v5
        with:
          go-version: stable
          cache: false

      - name: Deploy ACL to Tailscale
        env:
          TS_OAUTH_CLIENT_ID: ${{ secrets.TS_OAUTH_CLIENT_ID }}
          TS_OAUTH_CLIENT_SECRET: ${{ secrets.TS_OAUTH_CLIENT_SECRET }}
          TS_TAILNET: ${{ secrets.TS_TAILNET }}
        run: go run tailscale.com/cmd/gitops-pusher@latest --policy-file policy.hujson
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add deploy workflow for ACL push on merge"
```

---

### Task 5: Add README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README**

```markdown
# tailscale-acl

Tailscale ACL policy managed via GitOps.

## How it works

- Edit `policy.hujson` and open a PR
- CI validates the ACL with a dry-run against the Tailscale API
- Merge to `main` deploys the ACL to the tailnet

## Setup

### 1. Create Tailscale OAuth client

1. Go to [Tailscale admin console](https://login.tailscale.com/admin/settings/oauth)
2. Create new OAuth client
3. Grant `acl` scope (read + write)
4. Save the client ID and secret

### 2. Add GitHub repo secrets

Go to repo Settings > Secrets and variables > Actions, add:

| Secret | Value |
|--------|-------|
| `TS_OAUTH_CLIENT_ID` | OAuth client ID from step 1 |
| `TS_OAUTH_CLIENT_SECRET` | OAuth client secret from step 1 |
| `TS_TAILNET` | Your tailnet name (e.g., `example.github`) |

### 3. Export your ACL

1. Go to [Tailscale ACL editor](https://login.tailscale.com/admin/acls/file)
2. Copy the policy JSON
3. Replace `policy.hujson` contents with your actual policy
4. Commit and push
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add setup instructions"
```

---

### Task 6: Push to remote

- [ ] **Step 1: Push main branch**

```bash
git push -u origin main
```

- [ ] **Step 2: Verify on GitHub**

```bash
gh repo view klowdo/tailscale-acl --web
```

---

## Post-Implementation (Manual)

These steps require user action outside the repo:

1. Create Tailscale OAuth client with `acl` scope
2. Add `TS_OAUTH_CLIENT_ID`, `TS_OAUTH_CLIENT_SECRET`, `TS_TAILNET` as repo secrets
3. Export real ACL from Tailscale admin, replace `policy.hujson`, commit, push

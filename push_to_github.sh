#!/bin/bash
# ================================================================
# CapabilityOS — GitHub Repository Setup & Push Script
# Digilytics Co.
#
# USAGE:
#   chmod +x push_to_github.sh
#   ./push_to_github.sh
#
# PREREQUISITES:
#   - Git installed
#   - GitHub account
#   - GitHub Personal Access Token (PAT) with repo scope
#     Create at: https://github.com/settings/tokens/new
#     Scopes needed: repo (full control)
# ================================================================

set -e

# ── CONFIGURATION ─────────────────────────────────────────────────────────────
REPO_NAME="capabilityos"
GITHUB_USERNAME=""    # ← Set your GitHub username
GITHUB_TOKEN=""       # ← Set your GitHub PAT (or use env var)
REPO_VISIBILITY="private"   # "private" or "public"
DEFAULT_BRANCH="main"

# Allow env var override
GITHUB_USERNAME="${GITHUB_USERNAME:-$GH_USERNAME}"
GITHUB_TOKEN="${GITHUB_TOKEN:-$GH_TOKEN}"

# ── VALIDATION ────────────────────────────────────────────────────────────────
echo ""
echo "  CapabilityOS — GitHub Setup"
echo "  by Digilytics Co."
echo ""

if [ -z "$GITHUB_USERNAME" ]; then
  read -p "Enter your GitHub username: " GITHUB_USERNAME
fi

if [ -z "$GITHUB_TOKEN" ]; then
  read -s -p "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
  echo ""
fi

if [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_TOKEN" ]; then
  echo "✗ GitHub username and token are required."
  exit 1
fi

echo "  Username: $GITHUB_USERNAME"
echo "  Repo:     $REPO_NAME ($REPO_VISIBILITY)"
echo ""

# ── STEP 1: Create GitHub repository ─────────────────────────────────────────
echo "Creating GitHub repository..."

HTTP_STATUS=$(curl -s -o /tmp/gh_create_response.json -w "%{http_code}" \
  -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\":        \"$REPO_NAME\",
    \"description\": \"CapabilityOS — Enterprise Workforce Intelligence Platform by Digilytics Co.\",
    \"private\":     $([ \"$REPO_VISIBILITY\" = \"private\" ] && echo true || echo false),
    \"auto_init\":   false,
    \"has_issues\":  true,
    \"has_projects\":false,
    \"has_wiki\":    false
  }")

if [ "$HTTP_STATUS" = "201" ]; then
  echo "✓ Repository created: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
elif [ "$HTTP_STATUS" = "422" ]; then
  echo "  Repository may already exist — continuing with push..."
else
  echo "✗ GitHub API returned HTTP $HTTP_STATUS"
  cat /tmp/gh_create_response.json
  exit 1
fi

# ── STEP 2: Add GitHub Secrets (Vercel) ──────────────────────────────────────
echo ""
echo "Note: Add these secrets to GitHub after Vercel setup:"
echo "  Settings → Secrets → Actions"
echo "  VERCEL_TOKEN    — from vercel.com/account/tokens"
echo "  VERCEL_ORG_ID   — from .vercel/project.json (after vercel link)"
echo "  VERCEL_PROJECT_ID — from .vercel/project.json (after vercel link)"
echo ""

# ── STEP 3: Configure git and push ───────────────────────────────────────────
REMOTE_URL="https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Init git if needed
if [ ! -d ".git" ]; then
  git init
  echo "✓ Git initialised"
fi

# Set identity
git config user.email "hello@digilyticsco.com"
git config user.name  "Digilytics Co."

# Stage all files
git add -A

# Commit
COMMIT_MSG="feat: CapabilityOS v1.0.0 — Enterprise Workforce Intelligence Platform

- 57 modules · 50 use cases · 24 prompt templates
- 13 admin tabs including Platform Analyst (self-healing)
- Role Disruption Forecast · Skills Gap Analysis · Intervention Planner
- Vite build · ESLint + Prettier · Jest unit tests · Cypress E2E
- GitHub Actions CI/CD · Vercel deployment config
- Architecture docs · Runbook · Changelog

Co-built with Claude AI (Anthropic) · Digilytics Co."

git commit -m "$COMMIT_MSG" 2>/dev/null || git commit --allow-empty -m "$COMMIT_MSG"
echo "✓ Initial commit created"

# Set branch
git branch -M $DEFAULT_BRANCH

# Add remote
if git remote get-url origin &>/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi
echo "✓ Remote configured"

# Push
echo "Pushing to GitHub..."
git push -u origin $DEFAULT_BRANCH --force

echo ""
echo "========================================================"
echo "  Repository ready!"
echo "  https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "========================================================"
echo ""
echo "  NEXT: Deploy to Vercel"
echo ""
echo "  Option A — Vercel CLI:"
echo "    npm install -g vercel"
echo "    vercel login"
echo "    vercel link"
echo "    vercel --prod"
echo ""
echo "  Option B — Vercel Dashboard:"
echo "    1. Go to vercel.com/new"
echo "    2. Import: github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "    3. Framework: Vite"
echo "    4. Build: npm run build"
echo "    5. Output: dist"
echo "    6. Click Deploy"
echo ""
echo "  THEN: Add GitHub Secrets for auto-deploy on push"
echo "    Settings → Secrets → Actions:"
echo "    VERCEL_TOKEN · VERCEL_ORG_ID · VERCEL_PROJECT_ID"
echo ""

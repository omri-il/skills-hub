#!/usr/bin/env bash
# Runs on the VPS every 5 minutes (skills-hub-deploy.timer). If main on GitHub moved,
# pull, build, and only if the build passes copy dist/ into /var/www/skills.
# A failing build leaves the live site exactly as it was.
set -euo pipefail
REPO=/root/Projects/skills-hub
WEB=/var/www/skills
STAMP=/var/lib/skills-hub/deployed-commit

cd "$REPO"
git fetch -q origin main
NEW=$(git rev-parse origin/main)
OLD=$(cat "$STAMP" 2>/dev/null || true)
if [[ "$NEW" == "$OLD" && "${1:-}" != "--force" ]]; then exit 0; fi

git merge -q --ff-only origin/main
npm ci --no-audit --no-fund --silent
npm test --silent
npm run build --silent

mkdir -p "$WEB" "$(dirname "$STAMP")"
rsync -a --delete --exclude '.well-known/' dist/ "$WEB/"
echo "$NEW" > "$STAMP"
# The admin screen runs from this clone: restart it only when its own code changed (an admin action
# itself changes only skills/ and bundles.yaml, so it never restarts the service under its own request).
if [[ -n "$OLD" ]] && ! git diff --quiet "$OLD" "$NEW" -- admin lib package.json package-lock.json; then
  systemctl try-restart skills-hub-admin || true
fi
echo "skills-hub: deployed $(git log -1 --format='%h %s')"

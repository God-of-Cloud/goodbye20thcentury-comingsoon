#!/bin/zsh
set -e
cd "${0:A:h}"

# Prefer the user's Node installation. Fall back to existing app-bundled runtimes.
portfolio_node="$(command -v node || true)"
if [[ -z "$portfolio_node" ]]; then
  for candidate in "/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node" "/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node"; do
    if [[ -x "$candidate" ]]; then
      portfolio_node="$candidate"
      break
    fi
  done
fi
if [[ -z "$portfolio_node" ]]; then
  print "Node.js 22.13 or newer is required. Install Node.js, then run this launcher again."
  read -k 1
  exit 1
fi
export PATH="${portfolio_node:h}:$PATH"
if [[ ! -d node_modules ]]; then
  print "Dependencies are missing. Run npm ci in this folder first."
  read -k 1
  exit 1
fi
if /usr/bin/curl --silent --fail http://127.0.0.1:5173/ >/dev/null; then
  /usr/bin/open http://localhost:5173
  exit 0
fi
(
  for attempt in {1..40}; do
    if /usr/bin/curl --silent --fail http://127.0.0.1:5173/ >/dev/null; then
      /usr/bin/open http://localhost:5173
      break
    fi
    sleep 1
  done
) &
exec "$portfolio_node" node_modules/vite/bin/vite.js --config vite.pages.config.ts

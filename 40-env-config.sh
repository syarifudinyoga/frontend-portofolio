#!/bin/sh
set -e

# Generate runtime configuration file for React/Vite SPA from container environment
cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-}",
  VITE_API_ENCRYPTION_SECRET: "${VITE_API_ENCRYPTION_SECRET:-}"
};
EOF

#!/bin/sh
set -e

# Dynamically configure Nginx listen port if PORT is provided
if [ -n "$PORT" ] && [ -f /etc/nginx/conf.d/default.conf ]; then
  sed -i "s/listen [0-9]*;/listen ${PORT};/g" /etc/nginx/conf.d/default.conf
fi

# Ensure upstream proxy_pass uses 127.0.0.1 for host network compatibility
if [ -f /etc/nginx/conf.d/default.conf ]; then
  sed -i "s|proxy_pass http://api:3004|proxy_pass http://127.0.0.1:3004|g" /etc/nginx/conf.d/default.conf
fi

# Generate runtime configuration file for React/Vite SPA from container environment
cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-}",
  VITE_API_ENCRYPTION_SECRET: "${VITE_API_ENCRYPTION_SECRET:-}"
};
EOF

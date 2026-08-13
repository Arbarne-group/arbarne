# Frontend is static HTML/JS served by FastAPI in the pilot.
# This Dockerfile exists for symmetry and for use in Week 4+ when the
# frontend grows to need a build step.

FROM nginx:1.27-alpine

# Replace the default nginx config with one that serves the SPA
# and lets the FastAPI backend handle /api/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

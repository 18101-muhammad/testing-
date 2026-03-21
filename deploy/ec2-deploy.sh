#!/usr/bin/env bash

set -euo pipefail

APP_NAME="${APP_NAME:-antique-shop}"
APP_SLUG="${APP_SLUG:-antique-shop}"
DEPLOY_USER="${DEPLOY_USER:-ec2-user}"
DEPLOY_ROOT="${DEPLOY_ROOT:-/home/${DEPLOY_USER}/apps/${APP_SLUG}}"
SHARED_DIR="${SHARED_DIR:-${DEPLOY_ROOT}/shared}"
RELEASES_DIR="${RELEASES_DIR:-${DEPLOY_ROOT}/releases}"
CURRENT_LINK="${CURRENT_LINK:-${DEPLOY_ROOT}/current}"
ARCHIVE_PATH="${1:?Usage: ec2-deploy.sh <release-archive>}"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="${RELEASES_DIR}/${TIMESTAMP}"
SERVER_ENV_FILE="${SERVER_ENV_FILE:-${SHARED_DIR}/server.env}"
CLIENT_ENV_FILE="${CLIENT_ENV_FILE:-${SHARED_DIR}/client.env.production}"
NGINX_ROOT="${NGINX_ROOT:-/usr/share/nginx/html}"
NGINX_CONF_PATH="${NGINX_CONF_PATH:-/etc/nginx/conf.d/antique-shop.conf}"
PM2_APP_NAME="${PM2_APP_NAME:-${APP_NAME}-api}"

mkdir -p "${SHARED_DIR}" "${RELEASES_DIR}"

if [[ ! -f "${ARCHIVE_PATH}" ]]; then
  echo "Release archive not found: ${ARCHIVE_PATH}" >&2
  exit 1
fi

if [[ ! -f "${SERVER_ENV_FILE}" ]]; then
  echo "Missing server env file: ${SERVER_ENV_FILE}" >&2
  exit 1
fi

mkdir -p "${RELEASE_DIR}"
tar -xzf "${ARCHIVE_PATH}" -C "${RELEASE_DIR}"

if [[ -f "${CLIENT_ENV_FILE}" ]]; then
  cp "${CLIENT_ENV_FILE}" "${RELEASE_DIR}/client/.env.production"
fi

pushd "${RELEASE_DIR}/server" > /dev/null
rm -rf node_modules
if [[ -f package-lock.json ]]; then
  npm ci --omit=dev --no-audit --no-fund
else
  npm install --omit=dev --no-audit --no-fund
fi
npm run bootstrap
popd > /dev/null

pushd "${RELEASE_DIR}/client" > /dev/null
rm -rf node_modules
if [[ -f package-lock.json ]]; then
  npm ci --no-audit --no-fund
else
  npm install --no-audit --no-fund
fi
npm run build
popd > /dev/null

sudo mkdir -p "${NGINX_ROOT}"
sudo find "${NGINX_ROOT}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
sudo cp -R "${RELEASE_DIR}/client/build/." "${NGINX_ROOT}/"
sudo cp "${RELEASE_DIR}/deploy/nginx-antique-shop.conf" "${NGINX_CONF_PATH}"

if ! command -v pm2 > /dev/null 2>&1; then
  sudo npm install -g pm2
fi

set -a
# shellcheck disable=SC1090
source "${SERVER_ENV_FILE}"
set +a

ln -sfn "${RELEASE_DIR}" "${CURRENT_LINK}"

pushd "${CURRENT_LINK}/server" > /dev/null
if pm2 describe "${PM2_APP_NAME}" > /dev/null 2>&1; then
  pm2 delete "${PM2_APP_NAME}"
fi
pm2 start server.js --name "${PM2_APP_NAME}" --update-env
pm2 save
popd > /dev/null
echo "PM2 service is running with app name: ${PM2_APP_NAME}"

if command -v systemctl > /dev/null 2>&1; then
  sudo systemctl enable nginx
  sudo nginx -t
  sudo systemctl restart nginx
  echo "Nginx service restarted on EC2"
fi

find "${RELEASES_DIR}" -mindepth 1 -maxdepth 1 -type d | sort | head -n -3 | xargs -r rm -rf
rm -f "${ARCHIVE_PATH}"

echo "Deployment finished. GitHub push deployed to EC2 and restarted PM2/Nginx. Current release: ${RELEASE_DIR}"

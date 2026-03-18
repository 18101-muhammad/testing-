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
if [[ -f package-lock.json ]]; then
  npm ci --omit=dev
else
  npm install --omit=dev
fi
npm run bootstrap
popd > /dev/null

pushd "${RELEASE_DIR}/client" > /dev/null
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi
npm run build
popd > /dev/null

sudo mkdir -p "${NGINX_ROOT}"
sudo find "${NGINX_ROOT}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
sudo cp -R "${RELEASE_DIR}/client/build/." "${NGINX_ROOT}/"

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
  pm2 restart "${PM2_APP_NAME}" --update-env
else
  pm2 start server.js --name "${PM2_APP_NAME}"
fi
pm2 save
popd > /dev/null

if command -v systemctl > /dev/null 2>&1; then
  sudo systemctl enable nginx
  sudo systemctl restart nginx
fi

find "${RELEASES_DIR}" -mindepth 1 -maxdepth 1 -type d | sort | head -n -3 | xargs -r rm -rf
rm -f "${ARCHIVE_PATH}"

echo "Deployment finished. Current release: ${RELEASE_DIR}"

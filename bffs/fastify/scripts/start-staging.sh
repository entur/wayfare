#!/usr/bin/env bash
# Run the local BFF against the deployed reisefrihet staging API.
# Credentials are read from GCP Secret Manager unless CLIENT_ID and
# CLIENT_SECRET are already set.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

GCP_PROJECT="${GCP_PROJECT:-ent-reisfri-tst}"
REISEFRIHET_BASE_URL="${REISEFRIHET_BASE_URL:-https://api.staging.entur.io/reisefrihet}"
OAUTH_TOKEN_URL="${OAUTH_TOKEN_URL:-https://partner.staging.entur.org/oauth/token}"
OAUTH_AUDIENCE="${OAUTH_AUDIENCE:-https://api.staging.entur.io}"
FARE_FRAME_ID="${FARE_FRAME_ID:-KOL:FareFrame:FareData}"

for command in gcloud curl jq pnpm; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "ERROR: $command is required" >&2
    exit 1
  }
done

fetch_secret() {
  gcloud secrets versions access latest \
    --secret="$1" \
    --project="$GCP_PROJECT"
}

echo "Fetching staging credentials from GCP project $GCP_PROJECT"
CLIENT_ID="${CLIENT_ID:-$(fetch_secret KOLUMBUS_PARTNER_CLIENT_ID)}"
CLIENT_SECRET="${CLIENT_SECRET:-$(fetch_secret KOLUMBUS_PARTNER_CLIENT_SECRET)}"

if [[ -z "${SIMULATOR_MAIN_USER_PROFILE:-}" ]]; then
  echo "Checking staging access and resolving the main adult profile"
  ACCESS_TOKEN="$(
    curl -fsS "$OAUTH_TOKEN_URL" \
      --data-urlencode "grant_type=client_credentials" \
      --data-urlencode "client_id=$CLIENT_ID" \
      --data-urlencode "client_secret=$CLIENT_SECRET" \
      --data-urlencode "audience=$OAUTH_AUDIENCE" |
      jq -er '.access_token'
  )"
  SIMULATOR_MAIN_USER_PROFILE="$(
    curl -fsS \
      "$REISEFRIHET_BASE_URL/available-products/user-profiles?fareFrameId=$FARE_FRAME_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN" |
      jq -er '([.[] | select(.userType == "ADULT")][0] // .[0]).code'
  )"
fi

export NODE_ENV="${NODE_ENV:-development}"
export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-3001}"
export REISEFRIHET_BASE_URL OAUTH_TOKEN_URL OAUTH_AUDIENCE
export CLIENT_ID CLIENT_SECRET
export ENTUR_DISTRIBUTION_CHANNEL="${ENTUR_DISTRIBUTION_CHANNEL:-KOL:DistributionChannel:App}"
export ET_CLIENT_NAME="${ET_CLIENT_NAME:-Wayfare-Mobile-BFF}"
export ENTUR_POS="${ENTUR_POS:-Wayfare}"
export CHECKOUT_SIMULATOR_ENABLED="${CHECKOUT_SIMULATOR_ENABLED:-true}"
export SIMULATOR_FROM_ZONE="${SIMULATOR_FROM_ZONE:-KOL:FareZone:4}"
export SIMULATOR_TO_ZONE="${SIMULATOR_TO_ZONE:-KOL:FareZone:4}"
export SIMULATOR_MAIN_USER_PROFILE

echo "Starting local BFF on http://localhost:$PORT"
echo "Downstream: $REISEFRIHET_BASE_URL"
echo "Fare frame: $FARE_FRAME_ID"
echo "Simulator profile: $SIMULATOR_MAIN_USER_PROFILE"

cd "$PROJECT_ROOT"
exec pnpm exec tsx watch src/index.ts

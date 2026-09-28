#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
API_SPEC="${REISEFRIHET_SPEC_URL:-https://api.staging.entur.io/reisefrihet/v3/api-docs}"

cd "$PROJECT_ROOT"
pnpm exec openapi-typescript "$API_SPEC" -o src/generated/reisefrihet.ts

#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$DIR/.."
API_SPEC="${OMSA_SPEC_URL:-https://beta.developer.entur.no/apis/omsa/latest/openapi.json}"
OUTPUT_DIR="$PROJECT_ROOT/packages/omsa_api"

echo "Generating Dart OMSA package from $API_SPEC..."

mkdir -p "$OUTPUT_DIR"

# Generate Dart package
npx -y @openapitools/openapi-generator-cli generate \
  -i "$API_SPEC" \
  -g dart \
  -o "$OUTPUT_DIR" \
  --additional-properties=pubName=omsa_api,pubVersion=1.0.0,pubDescription=OMSA_Dart_Client \
  --enable-post-process-file

echo "Running pub get in generated package..."
cd "$OUTPUT_DIR"
flutter pub get

echo "Applying manual fixes to generated models..."
python3 "$DIR/fix_generated_models.py"

flutter format . || true 
cd "$DIR"

echo "Done generating Dart OMSA package at $OUTPUT_DIR"

#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$DIR/.."
API_SPEC="${OMSA_SPEC_URL:-https://beta.developer.entur.no/apis/omsa/latest/openapi.json}"
OUTPUT_DIR="$PROJECT_ROOT/app/models"
OUTPUT_FILE="$OUTPUT_DIR/omsa.py"

echo "Generating OMSA models from $API_SPEC..."

mkdir -p "$OUTPUT_DIR"

uvx --from 'datamodel-code-generator[http]' datamodel-codegen \
  --url "$API_SPEC" \
  --output "$OUTPUT_FILE" \
  --input-file-type openapi \
  --output-model-type pydantic_v2.BaseModel \
  --target-python-version 3.10 \
  --use-standard-collections \
  --use-union-operator \
  --base-class pydantic.BaseModel \
  --enum-field-as-literal all

echo "Done generating $OUTPUT_FILE"

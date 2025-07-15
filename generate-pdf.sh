#!/bin/bash
# Usage: ./generate-pdf.sh
# This script will generate a PDF for each gen-tags value in the array below.

# Define the array of gen-tags values
GEN_TAGS_ARRAY=(
  "full"
  "short,USA"
  "USA"
  "USA,AICloud"
  "table,USA"
)

RESUME_JSON="resume.json"  # Change this to your resume file if needed

for GEN_TAGS in "${GEN_TAGS_ARRAY[@]}"; do
  TAG_SAFE_NAME=$(echo "$GEN_TAGS" | tr ',' '_')
  OUTPUT_FILE="Yongjun-${TAG_SAFE_NAME}.pdf"
  echo "Generating PDF for gen-tags: $GEN_TAGS -> $OUTPUT_FILE"
  if [[ "$GEN_TAGS" == *"table"* ]]; then
    node cli.js export "$RESUME_JSON" --gen-tags "$GEN_TAGS" --template templates/table.tpl --output "$OUTPUT_FILE"
  elif [[ "$GEN_TAGS" == *"short"* ]]; then
    node cli.js export "$RESUME_JSON" --gen-tags "$GEN_TAGS" --output "$OUTPUT_FILE" --remove-leaderships
  else
    node cli.js export "$RESUME_JSON" --gen-tags "$GEN_TAGS" --output "$OUTPUT_FILE"
  fi
done

node cli.js export "$RESUME_JSON" --output "YongjunRong.pdf"
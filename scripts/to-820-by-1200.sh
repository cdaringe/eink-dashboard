#!/usr/bin/env bash
set -exo pipefail

input_path=$(realpath "$1")
output_path=$(realpath "${2:-$1}")

convert "$input_path" -gravity center -crop 41:60 +repage  -resize 820x1200\! "$output_path"

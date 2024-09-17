#!/usr/bin/env bash
set -exo pipefail

input_path=$(realpath "$1")
output_path=$(realpath "${2:-$1}")

convert "$input_path" -colorspace Gray "$output_path"
# convert input.jpg -gravity center -crop 41:60 +repage output.jpg

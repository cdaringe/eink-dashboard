#!/bin/bash
set -exo pipefail

# Save the SVG template to a file
battery_width=170
cat > battery_template.svg << EOL
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100" viewBox="0 0 400 100">
  <!-- Text area (150px width) -->
  <text x="95" y="75" font-family="Arial, sans-serif" font-size="72" fill="#333333" text-anchor="middle">SWAPME%</text>

  <!-- Battery area (200px width) -->
  <g transform="translate(200, 0)">
    <!-- Battery outline -->
    <rect x="5" y="5" width="180" height="90" rx="5" ry="5" fill="none" stroke="#333333" stroke-width="5"/>
    <!-- Battery terminal -->
    <rect x="185" y="35" width="10" height="30" rx="2" ry="2" fill="#333333"/>
    <!-- Battery fill (to be adjusted) -->
    <rect x="10" y="10" width="battery_width" height="80" fill="#666666"/>
  </g>
</svg>
EOL

function write_image() {
  percent=$1
  filename_prefix=${2:-$percent}
  battery_text=${3:-$percent}
  filename_svg="${filename_prefix}_battery.svg"
  filename_png="${filename_prefix}_battery.png"

  # Calculate the width of the battery fill
  fill_width=$(echo "$percent * $battery_width / 100" | bc)

  # Create a copy of the template and add the percentage
  sed "s/width=\"battery_width\"/width=\"$fill_width\"/" battery_template.svg > temp.svg

  cp temp.svg "${percent}_battery.svg"
  sed "s/SWAPME/$battery_text/" temp.svg > "${filename_svg}"
  # Convert SVG to PNG
  convert -depth 8 -colors 256 "${filename_svg}" "${filename_png}"
  rm "${filename_svg}"
  echo "Generated ${filename_png}"
}

# Generate images for percentages 5 to 100 in increments of 5
# create an error image
write_image 0 "unknown" "?"
for percent in $(seq 0 5 100); do
  write_image $percent
done

# Clean up temporary files
# rm battery_template.svg temp.svg

echo "All battery images have been generated!"

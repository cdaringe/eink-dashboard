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

# Generate images for percentages 5 to 100 in increments of 5
for percent in $(seq 5 5 100); do
  # Calculate the width of the battery fill
  fill_width=$(echo "$percent * $battery_width / 100" | bc)

  # Create a copy of the template and add the percentage
  sed "s/width=\"battery_width\"/width=\"$fill_width\"/" battery_template.svg > temp.svg

  cp temp.svg "${percent}_battery.svg"
  sed "s/SWAPME/$percent/" temp.svg > "${percent}_battery.svg"
  # Convert SVG to PNG
  convert "${percent}_battery.svg" "${percent}_battery.png"
  rm "${percent}_battery.svg"
  echo "Generated ${percent}_battery.png"
done

# Clean up temporary files
# rm battery_template.svg temp.svg

echo "All battery images have been generated!"

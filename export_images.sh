#!/usr/bin/env bash
set -e

inkscape_bin="/Applications/Inkscape.app/Contents/MacOS/inkscape"

"${inkscape_bin}" "src/opengraph.svg" --export-type png --export-filename "src/opengraph.png" --export-width 1200

"${inkscape_bin}" "src/favicon.svg" --export-type png --export-filename "src/favicon.png" --export-width 256
"${inkscape_bin}" "src/favicon.svg" --export-type png --export-filename "icon.png" --export-width 256
"${inkscape_bin}" "src/favicon.svg" --export-type png --export-filename "src/apple-touch-icon-180.png" --export-width 180
"${inkscape_bin}" "src/favicon.svg" --export-type png --export-filename "src/apple-touch-icon.png" --export-width 256

# Don't use imagemagick to downscale the images because they are more crisp when exporting from Inkscape.
"${inkscape_bin}" "src/favicon.svg" --export-type png --export-filename "src/favicon-16.png" --export-width 16
"${inkscape_bin}" "src/favicon.svg" --export-type png --export-filename "src/favicon-24.png" --export-width 24
"${inkscape_bin}" "src/favicon.svg" --export-type png --export-filename "src/favicon-32.png" --export-width 32
"${inkscape_bin}" "src/favicon.svg" --export-type png --export-filename "src/favicon-48.png" --export-width 48
"${inkscape_bin}" "src/favicon.svg" --export-type png --export-filename "src/favicon-64.png" --export-width 64

optipng -quiet src/*.png
optipng -quiet "icon.png"

convert -background transparent "src/favicon-16.png" "src/favicon-24.png" "src/favicon-32.png" "src/favicon-48.png" "src/favicon-64.png" "src/favicon.ico"

rm "src/favicon-16.png"
rm "src/favicon-24.png"
rm "src/favicon-32.png"
rm "src/favicon-48.png"
rm "src/favicon-64.png"

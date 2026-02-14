#!/usr/bin/env bash
set -e

npx esbuild node_modules/shufflejs/dist/shuffle.mjs --bundle --outfile=src/js/shuffle.min.js --format=iife --global-name=Shuffle --minify

node ./build-scripts/add-github-metadata.js
node ./build-scripts/add-local-metadata.js
npx @11ty/eleventy

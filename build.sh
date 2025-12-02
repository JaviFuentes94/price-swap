#!/bin/bash

# Price Swap Extension Build Script
# Creates a distribution ZIP file ready for Chrome Web Store publishing

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔨 Building Price Swap Extension...${NC}"

# Remove existing bundle if it exists
if [ -f "price-swap.zip" ]; then
    echo -e "${YELLOW}Removing existing bundle...${NC}"
    rm price-swap.zip
fi

# Create the ZIP file
# Exclude:
# - Git files and directories
# - Development/test files
# - Build script itself
# - Documentation files
# - System files
echo -e "${YELLOW}Creating ZIP bundle...${NC}"

zip -r price-swap.zip \
    manifest.json \
    background.js \
    content.js \
    content.css \
    popup.html \
    popup.js \
    popup.css \
    options.html \
    options.js \
    options.css \
    LICENSE \
    PRIVACY.md \
    icons/*.png \
    screenshots/resized/*.png \
    -x "*.git*" \
    -x "*.DS_Store" \
    -x "*node_modules*" \
    -x "tests.html" \
    -x "test-runner.js" \
    -x "icons/generate-icons.html" \
    -x "icons/README.md" \
    -x "screenshots/promo/*" \
    -x "PUBLISHING.md" \
    -x "README.md" \
    -x "build.sh"

# Check if ZIP was created successfully
if [ -f "price-swap.zip" ]; then
    SIZE=$(du -h price-swap.zip | cut -f1)
    echo -e "${GREEN}✅ Bundle created successfully!${NC}"
    echo -e "${GREEN}📦 File: price-swap.zip (${SIZE})${NC}"
    echo ""
    echo -e "${YELLOW}Contents:${NC}"
    unzip -l price-swap.zip
    echo ""
    echo -e "${GREEN}Ready for Chrome Web Store upload!${NC}"
else
    echo -e "${RED}❌ Failed to create bundle${NC}"
    exit 1
fi

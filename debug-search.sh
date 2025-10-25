#!/bin/bash

# Debug Commands for Typesense Search

echo "🔍 Testing Typesense Search Implementation"
echo "=========================================="
echo ""

# 1. First, re-setup Typesense collections with proper schema
echo "📦 Step 1: Re-creating Typesense collections..."
node ace setup:typesense --force

echo ""
echo "✅ Collections created"
echo ""

# 2. Re-index all events
echo "📊 Step 2: Re-indexing events..."
node ace index:events

echo ""
echo "✅ Events indexed"
echo ""

# 3. Test search queries
echo "🧪 Step 3: Testing search queries..."
echo ""
echo "Try these searches in your browser:"
echo "  1. Search for 'costntin' (typo for Constantine)"
echo "     URL: http://localhost:3333/events?search=costntin"
echo ""
echo "  2. Search for 'Constantine'"
echo "     URL: http://localhost:3333/events?search=Constantine"
echo ""
echo "  3. Search for 'const' (partial match)"
echo "     URL: http://localhost:3333/events?search=const"
echo ""
echo "  4. Search with province filter"
echo "     URL: http://localhost:3333/events?province=Constantine"
echo ""

echo "✨ Setup complete! Test the searches above."
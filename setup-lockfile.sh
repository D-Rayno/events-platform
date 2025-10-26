#!/bin/bash
# setup-lockfile.sh - Generate package-lock.json if missing

set -e

echo "🔍 Checking for package-lock.json..."

if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json exists"
else
    echo "⚠️  package-lock.json not found"
    echo "📦 Generating package-lock.json..."
    
    # Generate lockfile
    npm install --package-lock-only
    
    echo "✅ package-lock.json generated"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Review the generated package-lock.json"
    echo "   2. Commit it to git: git add package-lock.json"
    echo "   3. Then rebuild Docker: make build"
fi

echo ""
echo "📊 NPM Package Info:"
npm list --depth=0 2>/dev/null || echo "Dependencies will be installed during Docker build"
#!/bin/bash

echo "🚀 Starting production build process..."

# Validate environment variables
echo "📋 Validating environment variables..."
node scripts/validate-env.js

if [ $? -ne 0 ]; then
  echo "❌ Environment validation failed. Please check your .env file."
  exit 1
fi

# Run type checking
echo "🔍 Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
  echo "❌ Type checking failed"
  exit 1
fi

# Run linting
echo "🧹 Running linter..."
npm run lint

if [ $? -ne 0 ]; then
  echo "❌ Linting failed"
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test -- --run

if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# Build for production
echo "📦 Building for production..."
npm run build:prod

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Check bundle size
echo "📊 Bundle analysis saved to dist/stats.html"

echo "✅ Production build completed successfully!"
echo "📁 Output directory: dist/"
echo ""
echo "To preview the production build locally:"
echo "  npm run preview"
#!/bin/bash

echo "🔧 Fixing Android Build Issues..."
echo ""

# Step 1: Clean Gradle cache
echo "1️⃣ Cleaning Gradle cache..."
cd android
./gradlew clean --no-daemon
rm -rf .gradle
rm -rf build
rm -rf app/build

# Step 2: Clean node modules and reinstall
echo ""
echo "2️⃣ Cleaning node modules..."
cd ..
rm -rf node_modules
rm -rf package-lock.json

echo ""
echo "3️⃣ Reinstalling dependencies..."
npm install

# Step 3: Clear Metro bundler cache
echo ""
echo "4️⃣ Clearing Metro bundler cache..."
npx expo start --clear

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Now run: npx expo run:android"

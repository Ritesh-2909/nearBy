#!/bin/bash

# Setup script for USB debugging on Android
# This script sets up ADB port forwarding for Metro bundler and backend API

echo "🔧 Setting up USB debugging for Android device..."

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device found. Please:"
    echo "   1. Connect your phone via USB"
    echo "   2. Enable USB debugging on your phone"
    echo "   3. Accept the debugging prompt on your phone"
    exit 1
fi

echo "✅ Android device detected"

# Forward Metro bundler port (8081)
echo "📡 Forwarding Metro bundler port (8081)..."
adb reverse tcp:8081 tcp:8081

# Forward backend API port (5005)
echo "📡 Forwarding backend API port (5005)..."
adb reverse tcp:5005 tcp:5005

echo ""
echo "✅ Port forwarding configured!"
echo ""
echo "📱 Your device can now access:"
echo "   - Metro bundler: localhost:8081"
echo "   - Backend API: localhost:5005"
echo ""
echo "💡 To start the app:"
echo "   1. Start backend: cd backend && npm start"
echo "   2. Start Expo: cd frontend && npm start"
echo "   3. Press 'a' in Expo terminal to launch on Android"
echo ""



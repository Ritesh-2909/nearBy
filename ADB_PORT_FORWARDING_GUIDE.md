# ADB Port Forwarding Guide for Metro Bundler

## Overview

When developing React Native/Expo apps, you need your phone to connect to:
1. **Metro Bundler** (port 8081) - Serves JavaScript bundle
2. **Backend API** (port 5005) - Your Node.js server

ADB port forwarding allows your phone (connected via USB) to access services running on your Mac (on LAN/WiFi) by forwarding ports through the USB connection.

---

## How ADB Port Forwarding Works

### The Problem
- **Mac**: Running Metro bundler on `localhost:8081` and backend on `localhost:5005`
- **Phone**: Connected via WiFi, but `localhost` on phone refers to the phone itself, not your Mac
- **Solution**: Use USB connection + ADB to forward ports from Mac to phone

### The Solution: `adb reverse`

```
┌─────────────┐         USB Cable         ┌─────────────┐
│    Mac      │◄─────────────────────────►│   Phone     │
│             │                            │             │
│ localhost:  │                            │ localhost:  │
│  8081       │                            │  8081       │
│  5005       │                            │  5005       │
│             │                            │             │
│  Metro      │                            │  React      │
│  Backend    │                            │  Native App │
└─────────────┘                            └─────────────┘
     ▲                                           │
     │                                           │
     └─────────── ADB Reverse ───────────────────┘
     (Forwards phone's localhost → Mac's localhost)
```

**`adb reverse tcp:8081 tcp:8081`** means:
- When phone accesses `localhost:8081`, forward it to Mac's `localhost:8081`
- Same for port 5005

---

## Step-by-Step Setup Process

### 1. Enable USB Debugging on Your Phone

**Android:**
1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times (enables Developer Options)
3. Go to **Settings** → **Developer Options**
4. Enable **USB Debugging**
5. Connect phone to Mac via USB
6. Accept the "Allow USB Debugging" prompt on phone

**Check connection:**
```bash
adb devices
# Should show: List of devices attached
#              <device-id>    device
```

### 2. Set Up Port Forwarding

**Option A: Using the setup script (Recommended)**
```bash
cd frontend
./setup-usb.sh
```

**Option B: Manual commands**
```bash
# Forward Metro bundler port
adb reverse tcp:8081 tcp:8081

# Forward backend API port
adb reverse tcp:5005 tcp:5005

# Verify forwarding is active
adb reverse --list
```

**Expected output:**
```
8081
5005
```

### 3. Start Your Development Servers

**Terminal 1: Backend Server**
```bash
cd backend
npm start
# Server running on port 5005
```

**Terminal 2: Metro Bundler**
```bash
cd frontend
npm start
# Metro bundler running on port 8081
```

### 4. Launch App on Phone

In the Metro bundler terminal, press:
- `a` - Launch on Android device
- The app will connect to `localhost:8081` (forwarded to Mac via USB)

---

## How It Works Technically

### Network Flow

1. **Phone App** requests: `http://localhost:8081/index.bundle`
2. **ADB** intercepts: Sees request to `localhost:8081` on phone
3. **ADB forwards** to: Mac's `localhost:8081`
4. **Metro Bundler** responds: Sends JavaScript bundle
5. **ADB forwards** back: Response goes to phone
6. **Phone App** receives: JavaScript bundle

### For Backend API Calls

1. **Phone App** requests: `http://localhost:5005/api/vendors/nearby`
2. **ADB** intercepts: Sees request to `localhost:5005` on phone
3. **ADB forwards** to: Mac's `localhost:5005`
4. **Backend Server** responds: Sends JSON data
5. **ADB forwards** back: Response goes to phone
6. **Phone App** receives: API response

---

## Configuration in Your App

### Frontend API Configuration (`frontend/services/api.ts`)

```typescript
const USE_ADB_FORWARDING = true; // Set to true when using USB + ADB

const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      if (USE_ADB_FORWARDING) {
        // After adb reverse, localhost works on device
        return 'http://localhost:5005/api';
      } else {
        // For WiFi-only connection, use Mac's IP address
        return `http://172.16.7.155:5005/api`; // Your Mac's IP
      }
    }
    return 'http://localhost:5005/api'; // iOS simulator
  }
  return 'https://your-production-api.com/api';
};
```

### Metro Bundler Configuration

Your `package.json` already uses `--lan` mode:
```json
{
  "scripts": {
    "start": "expo start --lan"
  }
}
```

This makes Metro accessible on your Mac's LAN IP, but with ADB reverse, you can use `localhost` on the phone.

---

## Troubleshooting

### Issue: "Unable to connect to Metro"

**Solution:**
```bash
# 1. Check if device is connected
adb devices

# 2. Verify port forwarding
adb reverse --list

# 3. Re-setup port forwarding
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5005 tcp:5005

# 4. Restart Metro bundler
cd frontend
npm start -- --clear
```

### Issue: "Network request failed" for API calls

**Solution:**
1. Verify backend is running: `curl http://localhost:5005/api/health`
2. Check port forwarding: `adb reverse --list`
3. Ensure `USE_ADB_FORWARDING = true` in `api.ts`
4. Restart the app on phone

### Issue: Port forwarding lost after phone disconnect

**Solution:**
- Port forwarding is lost when USB disconnects
- Re-run setup script: `./setup-usb.sh`
- Or manually: `adb reverse tcp:8081 tcp:8081 && adb reverse tcp:5005 tcp:5005`

### Issue: Multiple devices connected

**Solution:**
```bash
# List all devices
adb devices

# Forward to specific device
adb -s <device-id> reverse tcp:8081 tcp:8081
```

---

## Alternative: WiFi-Only Connection (No USB)

If you want to use WiFi without USB:

1. **Find your Mac's IP address:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example: 172.16.7.155
```

2. **Update `api.ts`:**
```typescript
const USE_ADB_FORWARDING = false;
const DEVICE_IP = '172.16.7.155'; // Your Mac's IP
```

3. **Start Metro with LAN mode:**
```bash
npm start -- --lan
```

4. **Connect phone to same WiFi network**
5. **Use Mac's IP in app** (already configured)

**Note:** WiFi-only is less reliable than USB + ADB for development.

---

## Quick Reference Commands

```bash
# Check connected devices
adb devices

# Set up port forwarding
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5005 tcp:5005

# List active port forwards
adb reverse --list

# Remove all port forwards
adb reverse --remove-all

# Remove specific port forward
adb reverse --remove tcp:8081

# Restart ADB server (if issues)
adb kill-server
adb start-server
```

---

## Best Practices

1. **Always use USB + ADB for development** - More reliable than WiFi
2. **Run setup script after each USB reconnect** - Port forwarding resets
3. **Keep both ports forwarded** - Metro (8081) and Backend (5005)
4. **Use `--lan` mode for Metro** - Allows both USB and WiFi access
5. **Check `adb devices` regularly** - Ensure connection is active

---

## Summary

**ADB Port Forwarding Process:**
1. Connect phone via USB
2. Enable USB debugging
3. Run `adb reverse tcp:8081 tcp:8081` (Metro)
4. Run `adb reverse tcp:5005 tcp:5005` (Backend)
5. Start Metro and Backend servers
6. Phone app uses `localhost:8081` and `localhost:5005`
7. ADB automatically forwards to Mac's localhost

**Result:** Your phone (on WiFi) can access services on your Mac (on LAN) through the USB connection!


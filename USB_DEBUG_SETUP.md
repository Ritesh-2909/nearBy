# USB Debugging Setup Guide

## Quick Start for USB Debugging

### Step 1: Setup ADB Port Forwarding
Run the setup script (recommended):
```bash
cd frontend
./setup-usb.sh
```

Or manually:
```bash
adb reverse tcp:8081 tcp:8081  # Forward Metro bundler
adb reverse tcp:5005 tcp:5005  # Forward backend API
```

### Step 2: Start Backend Server
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5005`

### Step 3: Start Expo with LAN Mode
```bash
cd frontend
npm start
```
This starts Expo in LAN mode, accessible via USB.

### Step 4: Launch on Device
Press `a` in the Expo terminal to launch on Android device.

## Configuration

The app is configured to use ADB port forwarding by default:
- Metro bundler: `localhost:8081` (forwarded via ADB)
- Backend API: `localhost:5005` (forwarded via ADB)

### If ADB Forwarding Doesn't Work

1. **Check device connection:**
   ```bash
   adb devices
   ```
   Should show your device listed.

2. **Verify port forwarding:**
   ```bash
   adb reverse --list
   ```
   Should show both ports forwarded.

3. **Alternative: Use WiFi Network**
   - Make sure phone and computer are on same WiFi
   - Update `frontend/services/api.ts`:
     ```typescript
     const USE_ADB_FORWARDING = false;
     ```
   - Update `DEVICE_IP` to your computer's IP
   - Start Expo with: `npm start` (LAN mode)

### Finding Your Computer's IP Address
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## Troubleshooting

### Metro Bundler Connection Issues
- Make sure ADB port forwarding is active: `adb reverse --list`
- Try restarting ADB: `adb kill-server && adb start-server`
- Check firewall isn't blocking port 8081

### Dev Tools Not Opening
- Shake your device to open dev menu
- Or run: `adb shell input keyevent 82` (menu key)
- Make sure you're using Expo Dev Client (not Expo Go)

### API Connection Issues
- Verify backend is running: `curl http://localhost:5005/api/health`
- Check ADB forwarding: `adb reverse --list`
- Try accessing from device browser: `http://localhost:5005/api/health`


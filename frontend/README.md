# Frontend Mobile App

React Native Expo application for Nearby Vendors.

## Setup

1. Install dependencies: `npm install`
2. Update API URL in `config.js` if needed
3. Start Expo: `npm start` or `expo start`
4. Run on iOS: Press `i`
5. Run on Android: Press `a`

## Configuration

Update `config.js` with your backend API URL:
- iOS Simulator: `http://localhost:5000/api`
- Android Emulator: `http://10.0.2.2:5000/api`
- Physical Device: `http://<your-computer-ip>:5000/api`

## Screens

- **OnboardingScreen**: First-time user experience
- **LoginScreen**: User login
- **RegisterScreen**: User registration
- **HomeScreen**: Main screen with map/list view and search
- **VendorDetailScreen**: Vendor details and actions
- **AddVendorScreen**: Submit new vendor
- **MySubmissionsScreen**: View user's submissions
- **AdminDashboardScreen**: Admin analytics dashboard
- **AdminModerationScreen**: Review and moderate submissions

## Features

- Location-based vendor discovery
- Map and list views
- Search and category filtering
- Add vendor functionality
- Favorites management
- Admin moderation interface


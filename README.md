# Nearby Vendors - Phase 1

A React Native mobile application for discovering nearby small vendors with crowdsourcing capabilities. Users can find vendors within 1-3km and contribute new vendors through a moderated submission flow.

## Features

### Core Features
- **Location-based Discovery**: Find vendors within 1-3km radius
- **Map & List Views**: Toggle between map and list views
- **Search & Filter**: Search vendors by name and filter by category
- **Vendor Details**: View comprehensive vendor information including location, contact, hours
- **Favorites**: Save favorite vendors for quick access
- **Navigation**: Direct navigation to vendor locations
- **Call Integration**: Call vendors directly from the app

### Crowdsourcing Features
- **Add Vendor**: Users can submit new vendors through:
  - Empty state CTA when no results found
  - Long-press on map to add vendor at specific location
- **Moderation Workflow**: All user submissions require admin approval
- **Status Tracking**: Users can see their submission status (pending/approved/rejected)
- **Duplicate Detection**: Warns users if similar vendor exists nearby
- **Rate Limiting**: Max 5 vendor submissions per day per user

### Admin Features
- **Moderation Dashboard**: Review and manage vendor submissions
- **Approve/Reject**: Approve or reject submissions with optional reason
- **Analytics**: View submission statistics and usage metrics
- **Vendor Management**: Create vendors directly (admin)

## Tech Stack

### Frontend
- React Native with Expo
- React Navigation
- React Native Maps
- Expo Location
- Expo Image Picker
- AsyncStorage

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Express Validator

## Project Structure

```
nearBy/
├── frontend/          # React Native Expo app
│   ├── screens/      # App screens
│   ├── navigation/   # Navigation setup
│   ├── services/     # API and storage services
│   ├── context/      # React context (Auth)
│   └── config.js     # Configuration
├── backend/          # Node.js/Express API
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   └── server.js     # Entry point
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nearby
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

5. Start MongoDB (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or use MongoDB Atlas cloud service
```

6. Start the backend server:
```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API configuration in `config.js`:
```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';
```

**Note**: For iOS Simulator, use `http://localhost:5000/api`
For Android Emulator, use `http://10.0.2.2:5000/api`
For physical device, use your computer's local IP (e.g., `http://192.168.1.100:5000/api`)

4. Start Expo development server:
```bash
npm start
# or
expo start
```

5. Run on device/simulator:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

### Creating Admin User

Use the provided script to create an admin user:

```bash
cd backend
npm run create-admin [email] [password] [name]
```

Example:
```bash
npm run create-admin admin@example.com admin123 "Admin User"
```

If no arguments are provided, it will use defaults:
- Email: admin@example.com
- Password: admin123
- Name: Admin User

**Important**: Change the default password after first login!

Alternatively, you can register a user through the app and then manually update the role in MongoDB:
```javascript
// In MongoDB shell
use nearby
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/anonymous` - Create anonymous session
- `GET /api/auth/me` - Get current user (requires auth)

### Vendors
- `GET /api/vendors/nearby` - Get nearby vendors (query: lat, lng, radius, category, search)
- `GET /api/vendors/:id` - Get vendor details
- `POST /api/vendors/user-submissions` - Submit new vendor (requires auth)
- `GET /api/vendors/my-submissions` - Get user's submissions (requires auth)
- `GET /api/vendors/categories/list` - Get all categories
- `POST /api/vendors/:id/click` - Increment click count

### Admin
- `GET /api/admin/submissions` - Get submissions for moderation (requires admin)
- `POST /api/admin/submissions/:id/approve` - Approve submission (requires admin)
- `POST /api/admin/submissions/:id/reject` - Reject submission (requires admin)
- `PUT /api/admin/submissions/:id` - Edit and approve (requires admin)
- `POST /api/admin/vendors` - Create vendor (requires admin)
- `GET /api/admin/analytics` - Get analytics (requires admin)

## User Journeys

### Find Vendor Journey
1. Open app → Allow location permission
2. See nearby vendors on map/list
3. Search or filter by category
4. Tap vendor → View details
5. Navigate or call vendor

### Add Missing Vendor Journey
1. Search for vendor → No results found
2. Tap "Can't find? Add nearby vendor" at bottom
3. Map opens with current location
4. Drag pin to adjust location if needed
5. Fill form (name, category required)
6. Submit → See "Pending approval" message

### Map Quick-Add Journey
1. User standing near vendor
2. Long-press on map at vendor location
3. "Add vendor here" dialog appears
4. Fill minimal form
5. Submit → See "Pending approval"

## Phase 1 Success Metrics

### Discovery Metrics
- % of users who perform a search
- % of users who open a vendor detail page
- % of users who navigate or call a vendor

### Crowdsourcing Metrics
- % of active users who submit at least 1 vendor
- Number of valid approved user-added vendors per week
- Usage of crowdsourced vendors (views, clicks) vs seeded vendors

## Development Notes

### Location Permissions
The app requires location permissions for:
- Finding nearby vendors
- Adding vendors at specific locations
- Displaying user location on map

### Image Upload
Currently, image uploads store local file paths. For production, you'll need to:
- Implement cloud storage (AWS S3, Cloudinary, etc.)
- Update the photo field to store URLs instead of local paths

### Authentication
- Users can use the app anonymously (creates anonymous session)
- Full features require registration/login
- Admin features require admin role

## Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Ensure MongoDB is running and connection string is correct
- **Port Already in Use**: Change PORT in `.env` file
- **CORS Errors**: Check CORS configuration in `server.js`

### Frontend Issues
- **Cannot Connect to API**: 
  - Check API_BASE_URL in `config.js`
  - Ensure backend is running
  - For physical device, use computer's local IP address
- **Location Not Working**: 
  - Check location permissions in app settings
  - Ensure location services are enabled on device
- **Map Not Showing**: 
  - Check Google Maps API key (if required for production)
  - Ensure react-native-maps is properly installed

## Next Steps (Future Phases)

- Push notifications for submission status updates
- Advanced search filters
- Vendor reviews and ratings
- Social sharing
- Offline mode
- Advanced analytics dashboard
- Multi-language support

## License

MIT


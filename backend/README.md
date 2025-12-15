# Backend API Documentation

## Setup

1. Install dependencies: `npm install`
2. Create `.env` file with MongoDB connection string
3. Start server: `npm run dev` or `npm start`

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)

## Database Models

### Vendor
- name (required)
- category (required)
- description
- tags (array)
- location (GeoJSON Point, required)
- address
- phone
- openingHours (Map)
- photo
- source (admin/user)
- status (approved/pending/rejected)
- createdByUserId
- moderatedBy
- moderatedAt
- rejectionReason
- viewCount
- clickCount

### User
- email (required, unique)
- password (required, hashed)
- name (required)
- role (user/admin)
- anonymousId (for anonymous users)
- favorites (array of vendor IDs)
- submissionCount
- lastSubmissionDate

## API Authentication

Most endpoints require authentication via JWT token in Authorization header:
```
Authorization: Bearer <token>
```

Admin endpoints require admin role.


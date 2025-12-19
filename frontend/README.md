# Nearby Vendors - Frontend

React Native Expo app for discovering nearby vendors with crowdsourcing capabilities.

## Project Structure

This project follows a **feature-based folder structure** where each screen has its own folder containing:

```
app/
  [screen-name]/
    components/     # Screen-specific components
    page.tsx       # Main screen component
    types.ts       # TypeScript type definitions
    utils.ts       # API calls, data fetching, and utility functions
```

### Example: Home Screen

```
app/home/
  ├── components/
  │   ├── HomeHeader.tsx
  │   ├── SearchBar.tsx
  │   ├── CategoryFilter.tsx
  │   ├── VendorList.tsx
  │   └── FloatingActions.tsx
  ├── page.tsx
  ├── types.ts
  └── utils.ts
```

## Screen Structure

### Home (`app/home/`)
- **Components**: UI components specific to the home screen
- **Types**: Vendor, VendorFilters, Category types
- **Utils**: API calls for fetching nearby vendors, filtering, sorting

### Auth Login (`app/auth/login/`)
- **Components**: LoginForm, AuthHeader, AuthLink
- **Types**: LoginFormData, LoginResponse, LoginError
- **Utils**: Validation, login API calls

### Auth Register (`app/auth/register/`)
- **Components**: RegisterForm, AuthHeader, AuthLink
- **Types**: RegisterFormData, RegisterResponse
- **Utils**: Validation, registration API calls

### Onboarding (`app/onboarding/`)
- **Components**: OnboardingHeader, FeatureList, ActionButtons
- **Types**: LocationPermissionStatus
- **Utils**: Location permission handling

### Add Vendor (`app/vendors/add/`)
- **Components**: AddVendorHeader, VendorForm, SubmitButton
- **Types**: VendorFormData, VendorSubmissionResponse, Category
- **Utils**: Form validation, vendor submission API calls

### Submissions (`app/submissions/`)
- **Components**: SubmissionsHeader, SubmissionCard
- **Types**: Submission, SubmissionsResponse
- **Utils**: Fetching submissions, status formatting, date formatting

## Shared Services

### `services/api.ts`
Centralized API client with:
- Auth API (login, register, anonymous)
- Vendors API (nearby, details, submissions)
- Admin API (moderation, analytics)

### `services/storage.ts`
AsyncStorage utilities for:
- Token management
- User data
- Favorites

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Clear cache if styles don't work:
```bash
npx expo start --clear
```

## Tech Stack

- **React Native** with Expo
- **Expo Router** for file-based routing
- **NativeWind v4** for styling (using `className` prop)
- **TypeScript** for type safety
- **Axios** for API calls

## Code Organization Principles

1. **Co-location**: Each screen's components, types, and utils are in the same folder
2. **Separation of Concerns**: 
   - `page.tsx` - UI and state management
   - `types.ts` - Type definitions
   - `utils.ts` - Business logic and API calls
   - `components/` - Reusable UI components for that screen
3. **Type Safety**: All API responses and form data are typed
4. **Reusability**: Shared utilities in `services/` folder

## Development Guidelines

- Use `className` prop for styling (NativeWind v4)
- Import types from local `types.ts` files
- Use utility functions from local `utils.ts` files
- Keep components focused and single-purpose
- Add console logs for debugging (already implemented)




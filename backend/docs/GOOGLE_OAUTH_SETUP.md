# Google OAuth Setup

## Overview
Google OAuth authentication is implemented using Passport.js with the Google OAuth 2.0 strategy.

## Setup Steps

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (or **Google Identity API**)
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
7. Copy the **Client ID** and **Client Secret**

### 2. Environment Variables

Add to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

**Note**: `GOOGLE_CALLBACK_URL` should be a relative path. The full URL will be constructed from your server URL.

### 3. Frontend Integration

The OAuth flow works as follows:

1. User clicks "Sign in with Google" button
2. Redirect to: `GET /api/auth/google`
3. User authenticates with Google
4. Google redirects to: `GET /api/auth/google/callback`
5. Backend generates JWT token and redirects to frontend: `{FRONTEND_URL}/auth/callback?token={jwt_token}`

**Frontend Implementation Example**:

```javascript
// Redirect to Google OAuth
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:3000/api/auth/google';
};

// Handle callback (on your frontend callback page)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
if (token) {
  // Store token and redirect to dashboard
  localStorage.setItem('token', token);
  // ... handle authentication
}
```

### 4. Routes

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback (handles authentication)
- `GET /api/auth/google/error` - Error handler for failed authentication

### 5. User Model Updates

Users created via Google OAuth will have:
- `googleId` field set
- `isEmailVerified` set to `true` (Google emails are verified)
- `password` field is optional (not required for OAuth users)
- Avatar from Google profile (if available)

### 6. Testing

1. Start your server
2. Navigate to `http://localhost:3000/api/auth/google`
3. Complete Google authentication
4. You'll be redirected to your frontend with a token

## Security Notes

- Always use HTTPS in production
- Keep `GOOGLE_CLIENT_SECRET` secure and never commit it to version control
- The callback URL must match exactly what's configured in Google Cloud Console
- JWT tokens are generated the same way as regular login

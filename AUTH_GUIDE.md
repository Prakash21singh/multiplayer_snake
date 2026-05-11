# Authentication Setup Guide

## Overview
This project uses **Better Auth** for authentication with email/password and GitHub OAuth support.

## Features
- ✅ Email & Password Authentication
- ✅ GitHub OAuth Integration
- ✅ Automatic Route Protection (Middleware-based)
- ✅ Session Management
- ✅ PostgreSQL Database Integration
- ✅ Secure Cookies & Token Management

## Authentication Flow

### 1. **Login Page** (`/auth`)
- Located at: `app/auth/page.tsx`
- Supports both Sign In and Sign Up modes
- Email/password authentication
- GitHub OAuth button
- Form validation and error handling

### 2. **API Routes** (`/api/auth/[...all]`)
- Located at: `app/api/auth/[[...all]]/route.ts`
- Handles all authentication endpoints (sign in, sign up, sign out, etc.)
- Powered by Better Auth

### 3. **Route Protection** (Middleware)
- Located at: `middleware.ts`
- Automatically protects all routes except public ones
- Public routes: `/auth`, `/api/auth`
- Redirects unauthenticated users to `/auth`

### 4. **Auth Context & Hooks**
- **Context**: `contexts/auth-context.tsx` - Provides session globally
- **Hook**: `hooks/use-auth.ts` - Access session and auth functions
- **Client**: `lib/auth-client.ts` - Better Auth client configuration

## Usage

### Get Current User Session
```typescript
import { useAuth } from '@/hooks/use-auth';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.name}</p>}
    </div>
  );
}
```

### Sign In User
```typescript
import { signIn } from '@/lib/auth-client';

const handleSignIn = async () => {
  await signIn.email({
    email: 'user@example.com',
    password: 'password123',
    callbackURL: '/',
  });
};
```

### Sign Up New User
```typescript
import { signUp } from '@/lib/auth-client';

const handleSignUp = async () => {
  await signUp.email({
    email: 'user@example.com',
    password: 'password123',
    name: 'User Name',
    callbackURL: '/',
  });
};
```

### Log Out User
```typescript
import { useAuth } from '@/hooks/use-auth';

export function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

## Environment Variables

Make sure these are set in your `.env` or `.env.local`:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"

# Better Auth
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SECRET_KEY="your-secure-secret-key"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Protected Routes

All routes are protected by default except:
- `/auth` - Authentication page
- `/api/auth/*` - Auth API endpoints
- Public assets (images, etc.)

To access protected pages, users must be authenticated.

## Database Schema

Better Auth automatically manages user tables:
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts
- `verification` - Email verification tokens

## Security Features

✅ HTTP-only cookies for token storage
✅ CSRF protection
✅ Secure password hashing
✅ Token expiration (1 hour access, 7 days refresh)
✅ Session-based authentication
✅ Automatic redirect to login for unauthenticated users

## Testing Authentication

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:3000`
   - You'll be redirected to `/auth`

3. **Create an account:**
   - Enter email, password, and name
   - Click "Create Account"

4. **Sign in:**
   - Use your credentials
   - You'll be redirected to home page

5. **Test logout:**
   - Click the "Logout" button
   - You'll be redirected to `/auth`

## Files Overview

```
├── app/
│   ├── auth/page.tsx                 # Login/Sign Up page
│   ├── api/auth/[[...all]]/route.ts  # Auth API endpoints
│   ├── layout.tsx                    # Root layout with AuthProvider
│   └── page.tsx                      # Protected home page
├── lib/
│   ├── auth.ts                       # Better Auth server config
│   └── auth-client.ts                # Better Auth client config
├── contexts/
│   └── auth-context.tsx              # Auth context provider
├── hooks/
│   ├── use-auth.ts                   # Auth hook
│   └── use-user.ts                   # User hook (if needed)
├── components/
│   ├── protected-route.tsx           # Protected route wrapper
│   ├── user-profile.tsx              # User profile display
│   └── ...
├── middleware.ts                      # Route protection middleware
└── prisma/
    └── schema.prisma                 # Database schema
```

## Troubleshooting

### Not redirecting to auth page?
- Check if middleware.ts exists
- Verify matcher config in middleware
- Restart the dev server

### Sessions not persisting?
- Check DATABASE_URL in .env
- Run migrations: `npx prisma migrate dev`
- Check browser cookies

### GitHub OAuth not working?
- Verify GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
- Check OAuth redirect URI in GitHub settings

### Cookies not being set?
- Ensure NEXTAUTH_URL matches your domain
- Check secure cookie settings (must be HTTPS in production)

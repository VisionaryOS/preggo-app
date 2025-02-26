# Secure Supabase Authentication Guide

This guide explains how to properly set up Supabase authentication in your Next.js application while keeping your API keys secure.

## Environment Variables

### Local Development

Create a `.env.local` file in the root of your project with the following variables:

```
# Supabase credentials - these are only accessible on the server
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Public URL for client-side redirects (no sensitive data)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Deployment

When deploying to Vercel or another hosting provider, add these same environment variables in their dashboard:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

## Security Architecture

This project uses a secure architecture for authentication:

1. **Server-side API Routes**: All authentication operations (login, signup, signout) are performed through server-side API routes that keep your Supabase keys secure.

2. **Cookie-based Auth**: We use the Next.js Auth Helpers from Supabase to manage authentication via cookies, which is more secure than storing tokens in localStorage.

3. **Middleware Protection**: The middleware automatically protects routes that require authentication.

4. **No Client-side Keys**: The client never has access to your Supabase API keys.

## How It Works

1. When a user logs in or signs up, the client sends credentials to a server-side API route.

2. The server-side route uses the secure environment variables to authenticate with Supabase.

3. Supabase sets secure cookies that are used for subsequent authenticated requests.

4. The middleware checks these cookies to protect routes that require authentication.

## File Structure

- `/src/app/api/auth/*` - Server-side API routes for authentication
- `/src/lib/supabase/server.ts` - Server-side Supabase client
- `/src/lib/supabase/client.ts` - Client-side Supabase client (no keys)
- `/src/hooks/useAuth.ts` - Authentication hook that uses the API routes

## Important Notes

- Never use `NEXT_PUBLIC_` prefix for sensitive keys as they will be exposed to the client.
- Always use server-side API routes for operations that require API keys.
- Add `.env.local` to your `.gitignore` file to prevent accidentally committing your keys.
- Regularly rotate your Supabase keys for additional security. 
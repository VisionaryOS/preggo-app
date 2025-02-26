# Supabase Integration Guide for Preggo App

This guide will help you set up and test Supabase integration with your Next.js application.

## 1. Setting Up Supabase

### Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create an account if you don't have one.
2. Click "New Project" and follow these steps:
   - Name your project (e.g., "preggo-app").
   - Set a secure database password.
   - Select a region close to your target users.
   - Wait for your project to be provisioned (this may take a few minutes).

### Connect Your Project

1. Once your project is ready, navigate to the project dashboard.
2. Go to Project Settings > API to find your project URL and anon key.
3. These keys are already set in your `.env.local` file, but you should update them with your own values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 2. Setting Up the Database

### Option 1: Using the SQL Editor

1. In your Supabase dashboard, go to the SQL Editor.
2. Create a new query.
3. Copy the contents of the `supabase/migrations/20230301000000_init.sql` file.
4. Paste the SQL into the query editor and click "Run".

### Option 2: Using the Table Editor

If you prefer a visual approach, you can create the tables manually:

1. Go to the Table Editor in your Supabase dashboard.
2. Create a new table named `users` with the following columns:
   - `id` (uuid, primary key, references auth.users.id)
   - `email` (text, not null, unique)
   - `full_name` (text, nullable)
   - `due_date` (date, nullable)
   - `created_at` (timestamp with time zone, not null, default: now())
   - `last_updated` (timestamp with time zone, not null, default: now())

3. Create a new table named `pregnancy_logs` with the following columns:
   - `id` (uuid, primary key, default: gen_random_uuid())
   - `user_id` (uuid, not null, references users.id)
   - `symptoms` (text array, default: empty array)
   - `mood` (text, nullable)
   - `weight` (numeric, nullable)
   - `notes` (text, nullable)
   - `created_at` (timestamp with time zone, not null, default: now())

4. Configure Row Level Security (RLS) for both tables:
   - Go to Authentication > Policies.
   - For each table, enable RLS and create policies that allow users to only access their own data.

5. Create the trigger function for user creation:
   - Go to the SQL Editor.
   - Create a new query and paste the function and trigger from the migration file.

## 3. Configuring Authentication

1. In your Supabase dashboard, go to Authentication > Settings.
2. Under "Site URL", enter your application's URL (e.g., http://localhost:3000 for local development).
3. Under "Redirect URLs", add:
   - http://localhost:3000/api/auth/callback
   - http://localhost:3000/login
   - http://localhost:3000/signup

4. Review other authentication settings:
   - Minimum password length (recommended: 8)
   - Enable/disable email confirmations
   - Configure password recovery settings

## 4. Testing the Integration

### Start Your Application

```bash
npm run dev
```

### Test User Registration

1. Navigate to `/signup`.
2. Create a new account with valid information.
3. Verify in the Supabase dashboard that:
   - A new user was created in the Authentication section.
   - A corresponding row was added to the `users` table.

### Test Login

1. Navigate to `/login`.
2. Log in with the credentials you created.
3. You should be redirected to the dashboard.

### Test Authentication State

1. While logged in, try accessing `/login` or `/signup`.
2. You should be automatically redirected to the dashboard.
3. Try accessing a protected route like `/dashboard` or `/profile` in a new private window.
4. You should be redirected to the login page.

### Test Profile Management

1. Navigate to `/profile`.
2. Update your profile information and save.
3. Verify that the changes are persisted.

## 5. Common Issues and Troubleshooting

### User Registration Issues

- **Error: "A user with this email address already exists"**
  - Solution: Use a different email address or reset the existing account.

- **No email confirmation received**
  - Solution: Check your spam folder or configure Supabase to skip email confirmation.

### Authentication Flow Issues

- **Redirect loops**
  - Solution: Check your middleware configuration and ensure that the protected routes list is correct.

- **Session not persisting**
  - Solution: Ensure cookies are being properly set and that the Supabase client is correctly configured.

### Database Access Issues

- **"Permission denied" errors**
  - Solution: Check your RLS policies and make sure they are properly configured.

- **Missing user profile data**
  - Solution: Verify that the trigger function for user creation is working correctly.

## 6. Next Steps

### Enhancing Your Application

- Implement password reset functionality.
- Add social login providers (Google, GitHub, etc.).
- Create more complex database queries and relationships.
- Implement real-time features using Supabase's real-time capabilities.

### Deployment Considerations

- Set up proper environment variables in your production environment.
- Configure production URLs in Supabase's authentication settings.
- Consider using the Supabase CLI for migrations in a CI/CD pipeline.

## 7. Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/reference/cli/introduction) 
# Supabase Setup for Preggo App

This directory contains the database schema and migrations for the Preggo App.

## Setting Up Your Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project.
2. Name your project (e.g., "preggo-app-[your-name]").
3. Choose a strong database password and make sure to save it.
4. Select a region closest to your target users.
5. Click "Create new project" and wait for the setup to complete.

## Configuration

1. Once your project is ready, navigate to the project dashboard.
2. Go to Project Settings > API to find your project URL and anon key.
3. Update the `.env.local` file in the root of this project with your Supabase URL and anon key:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Setting Up Database Schema

### Option 1: Using the SQL Editor (Recommended for development)

1. In your Supabase dashboard, go to the SQL Editor.
2. Create a new query.
3. Copy the contents of the `migrations/20230301000000_init.sql` file and paste it into the query editor.
4. Run the query to create the tables and set up the Row Level Security policies.

### Option 2: Using Migrations (Recommended for production)

If you have the Supabase CLI installed:

1. Configure your Supabase project: `supabase init`
2. Link to your remote project: `supabase link --project-ref your-project-ref`
3. Push the migrations: `supabase db push`

## Configuring Authentication

1. In your Supabase dashboard, go to Authentication > Settings.
2. Under "Email Auth", make sure "Enable Email Signup" is enabled.
3. Configure other authentication settings as needed:
   - Minimum password length (recommended: 8)
   - Enable/disable email confirmations
   - Set custom redirect URLs for email confirmation

## Testing

1. Start your Next.js application: `npm run dev`
2. Navigate to `/signup` to create a new account.
3. Check your Supabase dashboard to confirm that the user was created in both the `auth.users` and `public.users` tables.
4. Try logging in with the new account.
5. Test the protected routes to ensure proper authentication redirection.

## Row Level Security Explained

This project uses Row Level Security (RLS) to ensure that users can only access their own data:

- **Users Table**: Users can only read and update their own profile information.
- **Pregnancy Logs Table**: Users can only read, create, update, and delete their own logs.

The RLS policies ensure that even if someone obtains your anon key, they cannot access other users' data.

## Automatic User Profile Creation

A database trigger automatically creates a user profile in the `public.users` table whenever a new user signs up through Supabase authentication. The trigger extracts user metadata such as full name and due date. 
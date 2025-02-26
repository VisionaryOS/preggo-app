# Preggo App

A Next.js application built with Supabase for pregnant women to track their journey, manage symptoms, and access personalized resources.

## Features

- **User Authentication**: Secure email/password and social login
- **Personalized Dashboard**: Week-by-week pregnancy tracking
- **Symptom Logging**: Track mood, symptoms, and notes
- **Onboarding Experience**: Guided setup for new users
- **Profile Management**: Update personal details and preferences
- **Responsive Design**: Mobile-first experience

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and Zustand
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository
```bash
git clone https://github.com/VisionaryOS/preggo-app.git
cd preggo-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

5. Start the development server
```bash
npm run dev
```

## Project Structure

The project follows a clean and well-organized structure:

- `/src/app`: Next.js app router pages and layouts
- `/src/components`: Reusable UI components
  - `/components/ui`: shadcn/ui components
  - `/components/layout`: Layout components like headers and footers
  - `/components/auth`: Authentication-related components
  - `/components/dashboard`: Dashboard-specific components
  - `/components/features`: Feature-specific components
  - `/components/onboarding`: Onboarding flow components
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and services
  - `/lib/supabase`: Supabase client and service functions
  - `/lib/config`: Application configuration
  - `/lib/providers`: React context providers
  - `/lib/utils`: Utility functions
- `/public`: Static assets
- `/supabase`: Supabase configuration files

## Authentication

### Flow

1. Users sign up via email/password or social providers
2. New users are directed to onboarding to set up their profile
3. Authentication state is maintained via secure cookies
4. Protected routes automatically redirect to login when needed
5. Routes that require completed onboarding will redirect accordingly

### Implementation

- Client-side auth: `createClientComponentClient`
- Server-side auth: `createServerComponentClient` and `createRouteHandlerClient`
- Route protection: Next.js middleware

## Database Schema

### Users Table

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  due_date TEXT,
  pregnancy_week INT,
  health_conditions TEXT[],
  interests TEXT[],
  ai_personalization JSONB,
  preferences JSONB,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Pregnancy Logs Table

```sql
CREATE TABLE public.pregnancy_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  symptoms TEXT[],
  mood TEXT[],
  weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Performance Optimizations

### Server-Side Rendering

- Use React Server Components for better performance
- Pre-render static content where possible
- Use Incremental Static Regeneration for semi-dynamic content

### Client-Side Optimizations

- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Memoize expensive computations with useMemo and useCallback
- Use TanStack Query for data fetching with caching

### Database Optimizations

- Use appropriate indexes on commonly queried fields
- Implement efficient pagination for large datasets
- Cache frequently accessed data

## Development Guidelines

### Code Style

- Follow ESLint and Prettier configurations
- Run linting before commits: `npm run lint`
- Use TypeScript for all new code

### Component Guidelines

- Create small, reusable components
- Use composition over inheritance
- Implement proper prop typing
- Handle loading states and errors gracefully

### Best Practices

- Follow Next.js App Router patterns
- Keep authentication state consistent
- Handle form validation with Zod
- Use optimistic UI updates for better UX

## Deployment

The application is configured for deployment on Vercel:

```bash
npm run build
```

For local development:

```bash
# Standard development server
npm run dev

# Alternative port (3001)
npm run dev:alt

# Clean start (kills existing processes on port 3000)
npm run dev:clean
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

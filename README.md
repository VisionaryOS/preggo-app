# Preggo App

A Next.js application built with Supabase for pregnant women to track their journey, manage symptoms, and access personalized resources.

## Features

- **Authentication**: Secure user signup, login, and session management
- **Responsive Dashboard**: Personalized user dashboard optimized for all devices
- **Profile Management**: Comprehensive user profile customization
- **Health Tracking**: Record and monitor pregnancy-related health metrics and symptoms
- **Content Library**: Educational resources tailored to pregnancy stages
- **Journey Timeline**: Visual week-by-week pregnancy journey tracking
- **Dark Mode**: Elegant toggle between light and dark themes
- **Mobile Optimization**: Fully responsive design for all screen sizes

## Tech Stack

- **Framework**: Next.js 15.1.7 with App Router
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for efficient data management

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

```
preggo-app/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable UI components
│   │   ├── auth/       # Authentication components
│   │   ├── dashboard/  # Dashboard-specific components
│   │   ├── ui/         # Shadcn UI components
│   │   └── layout/     # Layout components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and shared logic
│   │   ├── supabase/   # Supabase client utilities
│   │   └── utils.ts    # General utility functions
│   └── types/          # TypeScript type definitions
├── supabase/           # Supabase migrations and seed data
└── middleware.ts       # NextJS middleware for auth & routing
```

## User Flow

1. New users sign up with email and password
2. Users are directed to their dashboard
3. Users can view and update their profile
4. Dashboard provides health tracking and informational content

## Authentication

The application uses Supabase Authentication with:

- Email/password authentication
- Secure session management
- Protected routes via middleware

## Application Flow

The application uses Next.js middleware (`middleware.ts`) to manage authentication and route protection:

- Public routes: `/`, `/login`, `/signup`, etc.
- Protected routes: `/dashboard`, `/profile`, `/logs`, etc. (require authentication)
- Route protection: Unauthenticated users are redirected to login

## Database Schema

### Main Tables

```sql
-- Authentication information handled by Supabase Auth

-- User profiles
CREATE TABLE users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Other tables as needed for health logs, etc.
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

## Pregnancy Tracker App

A comprehensive pregnancy tracking dashboard application built with Next.js.

### Features

- **Three-Column Layout**:
  - Left sidebar for navigation
  - Main pregnancy tracker content in the center
  - AI chat assistant on the right side
  - Responsive design that adapts to different screen sizes

- **Pregnancy Tracker**:
  - Visual timeline of all 40 weeks
  - Current week highlight with baby size comparison
  - Weekly development highlights for baby and mother
  - Progress indicators

- **AI Chat Assistant**:
  - Contextual help based on current pregnancy week
  - Persistent chat history using local storage
  - Simple conversational interface

### Technologies Used

- Next.js App Router
- React with TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion animations
- Supabase authentication

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   Copy .env.example to .env.local and fill in required values
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Project Structure

- `/src/app/dashboard` - Dashboard page
- `/src/components/dashboard` - Dashboard-specific components:
  - `PregnancyTracker.tsx` - Main pregnancy tracking UI
  - `AIChat.tsx` - Chat interface for pregnancy assistant
  - `SideNav.tsx` - Left sidebar navigation

### Implementation Details

#### Pregnancy Tracker
- Uses a week-by-week data structure to display pregnancy information
- Shows baby size comparisons with fruit/vegetable emojis
- Provides developmental milestones and tips for each week
- Interactive week selector to view different weeks

#### AI Chat
- Simulated AI responses based on context
- Implements local storage for message persistence
- Collapsible interface for mobile responsiveness

#### Navigation
- Collapsible sidebar with profile summary
- Simple navigation between main app sections
- Responsive design for mobile use

### Future Enhancements

- Connect AI chat to a real AI model API
- Implement user account settings and personalization
- Add symptom tracking and appointment scheduling
- Expand weekly content with more detailed information
- Add community features for connecting with other expecting parents

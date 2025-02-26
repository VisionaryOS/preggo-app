# PregnancyPal - Pregnancy Tracking Web App

A comprehensive pregnancy tracking web application built with Next.js, featuring AI-powered assistance, week-by-week tracking, symptom monitoring, and personalized guidance.

## Features

- **User Authentication**: Secure login, registration, and profile management
- **Pregnancy Dashboard**: Visual tracking of pregnancy progress and milestones
- **Week-by-Week Content**: Detailed information on baby development and maternal changes
- **Symptom Tracker**: Log and monitor pregnancy symptoms over time
- **AI Assistant**: Personalized guidance and answers to pregnancy questions
- **Educational Content**: Comprehensive pregnancy information and resources

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase Postgres
- **AI Integration**: OpenAI API
- **Form Handling**: React Hook Form + Zod
- **Date Utilities**: date-fns
- **UI Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pregnancy-app.git
   cd pregnancy-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenAI
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=PregnancyPal
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js App Router pages and layout
- `components/`: Reusable React components
- `lib/`: Utility functions and services
- `types/`: TypeScript type definitions

## Features in Development

- Google Calendar integration for appointments
- Email notifications for milestones
- Mobile app version
- Community forums and sharing features
- Integration with healthcare provider systems

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
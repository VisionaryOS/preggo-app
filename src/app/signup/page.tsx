import SignupForm from '@/components/auth/SignupForm';

export const metadata = {
  title: 'Sign Up | Preggo App',
  description: 'Create your account on Preggo App to start tracking your pregnancy journey',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
} 
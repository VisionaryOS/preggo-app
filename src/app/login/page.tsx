import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login | Preggo App',
  description: 'Login to your Preggo App account to track your pregnancy journey',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
} 
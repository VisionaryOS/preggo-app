'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth();
  const [userName, setUserName] = useState<string>('');
  const [dueDate, setDueDate] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata?.full_name || user.email || '');
      setDueDate(user.user_metadata?.due_date || null);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-medium text-gray-800">Welcome, {userName}!</h2>
          {dueDate && (
            <p className="text-gray-600 mt-1">
              Your expected due date: <span className="font-medium">{new Date(dueDate).toLocaleDateString()}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/profile" className="text-blue-600 hover:underline">Edit Profile</a>
              </li>
              <li>
                <a href="/logs" className="text-blue-600 hover:underline">Pregnancy Logs</a>
              </li>
              <li>
                <a href="/resources" className="text-blue-600 hover:underline">Pregnancy Resources</a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Your Account</h3>
            <p className="text-gray-600">Email: {user?.email}</p>
            <p className="text-gray-600 mt-1">Account created: {user?.created_at && new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
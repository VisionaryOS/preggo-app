import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sign Up | Preggo App',
  description: 'Create a new account to track your pregnancy journey',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
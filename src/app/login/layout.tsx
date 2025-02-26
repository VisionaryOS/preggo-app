import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Login | Preggo App',
  description: 'Login to your Preggo App account to track your pregnancy journey',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
"use client";

import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mb-8 text-center"
      >
        <Link href="/" className="inline-flex items-center justify-center">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            Preggo
          </span>
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Join Preggo
        </h1>
        <p className="mt-2 text-gray-600">
          Create your account to start your pregnancy journey
        </p>
      </motion.div>

      <div className="w-full max-w-md">
        <SignupForm />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <Button variant="link" asChild>
            <Link href="/" className="text-sm text-muted-foreground">
              ← Back to home
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

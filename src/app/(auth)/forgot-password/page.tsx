import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export default function ForgotPasswordPage() {
  const handleResetPassword = async (values: { email: string }) => {
    // This is just a mock implementation for now
    console.log('Reset password for:', values.email)
    // In a real app, we would have something like:
    // const { error } = await supabase.auth.resetPasswordForEmail(values.email)
    // if (error) throw error
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <Heart className="h-10 w-10 text-primary" />
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow-sm sm:rounded-lg sm:px-10">
            <ForgotPasswordForm onSubmit={handleResetPassword} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ForgotPasswordFormProps {
  onSubmit: (values: { email: string }) => Promise<void>
  isLoading?: boolean
}

function ForgotPasswordForm({ onSubmit, isLoading = false }: ForgotPasswordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await onSubmit(values)
      form.reset()
      // Show success message
    } catch (error) {
      // Show error message
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send reset instructions'}
        </Button>
        <div className="text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  )
} 
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function CTASection() {
  return (
    <section className="py-12 text-center">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Ready to begin your journey?</CardTitle>
          <CardDescription>Join thousands of expectant mothers who trust PregnancyPlus</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
} 
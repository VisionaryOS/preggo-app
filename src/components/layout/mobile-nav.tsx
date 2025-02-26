import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  onClose: () => void
}

const MobileNav = ({ onClose }: MobileNavProps) => {
  return (
    <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
      <div className="relative z-20 rounded-md bg-background p-4">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          <Link
            href="/dashboard"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
            )}
            onClick={onClose}
          >
            Dashboard
          </Link>
          <Link
            href="/chat"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
            )}
            onClick={onClose}
          >
            AI Assistant
          </Link>
          <Link
            href="/symptoms"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
            )}
            onClick={onClose}
          >
            Symptoms
          </Link>
          <Link
            href="/profile"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
            )}
            onClick={onClose}
          >
            Profile
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
            )}
            onClick={onClose}
          >
            Settings
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default MobileNav 
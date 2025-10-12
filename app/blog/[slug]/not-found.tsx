import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-mono">
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <div className="flex justify-end mb-8">
            <ThemeToggle />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-medium">404</h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-400">
              Blog post not found
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              The blog post you're looking for doesn't exist or has been moved.
            </p>
            <Link 
              href="/" 
              className="inline-block mt-8 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-sm font-mono transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


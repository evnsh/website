import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getBlogPost, getAllBlogPosts, formatDate } from '@/lib/mdx'
import { useMDXComponents } from '@/components/mdx-components'
import { ThemeToggle } from '@/components/theme-toggle'
import { SubtlePatternBackground } from '@/components/subtle-pattern-background'
import { CopyLinkButton } from '@/components/copy-link-button'
import Link from 'next/link'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: `${post.title} - evan.sh`,
    description: post.summary,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const components = useMDXComponents({})

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-mono relative">
      <SubtlePatternBackground />
      
      <div className="py-16 relative z-10">
        <div className="max-w-4xl mx-auto px-8">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <Link 
                href="/" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to home
              </Link>
              <ThemeToggle />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-medium leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {post.summary}
              </p>
            </div>
          </header>

          {/* Content */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote 
              source={post.content} 
              components={components}
            />
          </article>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to home
              </Link>
              <CopyLinkButton />
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

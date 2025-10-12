import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'

const blogsDirectory = path.join(process.cwd(), 'blogs')

export interface BlogPost {
  slug: string
  title: string
  publishedAt: string
  summary: string
  content: string
}

export interface BlogMetadata {
  title: string
  publishedAt: string
  summary: string
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      title: data.title,
      publishedAt: data.publishedAt,
      summary: data.summary,
      content,
    }
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const fileNames = fs.readdirSync(blogsDirectory)
    const allPostsData = await Promise.all(
      fileNames
        .filter((name) => name.endsWith('.mdx'))
        .map(async (name) => {
          const slug = name.replace(/\.mdx$/, '')
          return getBlogPost(slug)
        })
    )
    
    return allPostsData
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}


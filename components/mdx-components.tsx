import type { MDXComponents } from 'mdx/types'
import { Table } from './table'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-medium mb-6 text-gray-900 dark:text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-medium mb-4 mt-8 text-gray-900 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium mb-3 mt-6 text-gray-900 dark:text-white">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-medium mb-2 mt-4 text-gray-900 dark:text-white">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 my-6 italic text-gray-600 dark:text-gray-400">
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => {
      // rehype-pretty-code adds data-theme to code blocks; skip styling those
      if ('data-theme' in props) {
        return <code {...props}>{children}</code>
      }
      return (
        <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }) => (
      <pre
        className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg overflow-x-auto mb-6 text-sm font-mono border border-neutral-200 dark:border-neutral-700 w-full whitespace-pre"
        {...props}
      >
        {children}
      </pre>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-gray-900 dark:text-white underline underline-offset-4 decoration-2 hover:decoration-neutral-400 dark:hover:decoration-neutral-500 transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-700 dark:text-gray-300">{children}</em>
    ),
    hr: () => (
      <hr className="my-8 border-neutral-300 dark:border-neutral-600" />
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border border-neutral-300 dark:border-neutral-600">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-gray-700 dark:text-gray-300">
        {children}
      </td>
    ),
    Table,
    ...components,
  }
}

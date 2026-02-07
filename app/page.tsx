import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimationToggle } from "@/components/animation-toggle"
import { AnimationResume } from "@/components/animation-effect"
import { CopyEmailButton } from "@/components/copy-email-button"
import { getAllBlogPosts } from "@/lib/mdx"

export default async function Portfolio() {
  const posts = await getAllBlogPosts()
  return (
    <div className="min-h-screen bg-white/40 dark:bg-black/40 text-gray-900 dark:text-white font-mono relative">
      <AnimationResume />
      <div className="py-16 relative z-10">
        <div className="max-w-2xl mx-auto px-8 space-y-12">
          <header className="space-y-6">
            <div className="flex items-start gap-6">
              <img
                src="https://avatars.githubusercontent.com/u/56516450?v=4"
                alt="Evan Morvan avatar"
                className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-medium">Evan MORVAN</h1>
                  <div className="flex items-center gap-2">
                    <AnimationToggle />
                    <ThemeToggle />
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Nice, France
                    </div>
                    <CopyEmailButton email="me@evan.sh" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* About Section */}
          <section id="about">
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-medium mb-4">
                  <span className="text-neutral-400 dark:text-neutral-500"># </span>About
                </h1>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    22-year-old engineer building Qomro, a global developer platform, while apprenticing at Amadeus, which powers 40% of the world’s airline reservations. Passionate about backend architecture and real-time systems.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Work Section */}
          <section id="work">
            <div className="space-y-8">
              <h1 className="text-2xl font-medium">
                <span className="text-neutral-400 dark:text-neutral-500"># </span>Work
              </h1>

              <div className="space-y-8">
                <div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center flex-shrink-0 p-2">
                      <img src="/companies/amadeus-a.svg" alt="Amadeus" className="w-full h-full object-contain filter brightness-0 dark:invert" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <a
                          href="https://amadeus.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline underline-offset-4 decoration-2 transition-all duration-200"
                        >
                          Amadeus
                        </a>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">Sep 2025 – Present</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Software Engineering Apprentice</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Enhancing CI/CD pipelines with GitHub Actions, building cloud deployment workflows, and
                        implementing AI-driven monitoring systems.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center flex-shrink-0 p-2">
                      <img src="/companies/qomro.svg" alt="Qomro" className="w-full h-full object-contain filter brightness-0 dark:invert" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <a
                          href="https://qomro.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline underline-offset-4 decoration-2 transition-all duration-200"
                        >
                          Qomro
                        </a>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">Jan 2023 – Present</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Founding Software Engineer</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Building a global platform for securely deploying code at the edge.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center flex-shrink-0 p-2">
                      <img src="/companies/discord.svg" alt="Discord" className="w-full h-full object-contain filter brightness-0 dark:invert" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <a
                          href="https://discord.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline underline-offset-4 decoration-2 transition-all duration-200"
                        >
                          Discord
                        </a>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">May 2021 – Oct 2023</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Software Engineering Contractor</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Developed automated moderation systems for business partners and VIP communities, improving user
                        safety and reducing manual workload.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects">
            <div className="space-y-8">
              <h1 className="text-2xl font-medium">
                <span className="text-neutral-400 dark:text-neutral-500"># </span>Projects
              </h1>

              <div className="space-y-6">
                <div>
                  <a
                    href="https://qomro.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <h3 className="font-medium mb-2 group-hover:underline underline-offset-4 decoration-2 transition-all duration-200">
                      Qomro Platform
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Global developer platform with edge computing, Firecracker microVMs, and Kubernetes orchestration
                      for secure global code deployment.
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Section */}
          <section id="blog">
            <div className="space-y-8">
              <h1 className="text-2xl font-medium">
                <span className="text-neutral-400 dark:text-neutral-500"># </span>Blog
              </h1>

              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.slug}>
                    <div className="flex justify-between items-start gap-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-medium hover:underline underline-offset-4 decoration-2 transition-all duration-200 flex-1"
                      >
                        {post.title}
                      </Link>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono flex-shrink-0">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Socials Section */}
          <section id="socials">
            <div className="space-y-8">
              <h1 className="text-2xl font-medium">
                <span className="text-neutral-400 dark:text-neutral-500"># </span>Socials
              </h1>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://x.com/evandotsh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-sm font-mono transition-colors"
                >
                  x.com/evandotsh
                </a>
                <a
                  href="https://github.com/evnsh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-sm font-mono transition-colors"
                >
                  github.com/evnsh
                </a>
                <a
                  href="https://linkedin.com/in/evansh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-sm font-mono transition-colors"
                >
                  in/evansh
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

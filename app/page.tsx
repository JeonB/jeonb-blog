import LikeButton from '../components/LikeButton'
import { getAllPosts } from '../lib/post'
import ClientHeader from '../components/ClientHeader'
import Link from 'next/link'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div className="bg-navy-50 dark:bg-navy-900 flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)] text-black dark:text-white">
      <ClientHeader />

      {/* 메인 콘텐츠 */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-primary dark:text-navy-100 mb-8 text-3xl font-bold">
          최신 포스트
        </h1>
        <div className="grid gap-6">
          {posts.length === 0 && (
            <div className="text-navy-400">아직 포스트가 없습니다.</div>
          )}
          {posts.map(post => (
            <article
              key={post.slug}
              className="border-navy-100 dark:border-navy-800 dark:bg-navy-800 flex flex-col gap-2 rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md">
              <Link
                href={`/blog/${post.slug}`}
                className="text-primary dark:text-navy-100 mb-1 text-xl font-semibold hover:underline">
                {post.title}
              </Link>
              <div className="text-navy-500 dark:text-navy-200 mb-2 text-xs">
                by {post.author} ·{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="text-navy-800 dark:text-navy-100 mb-2 line-clamp-2">
                {post.content.slice(0, 100)}...
              </div>
              <div className="mt-auto flex items-center gap-2">
                <LikeButton postId={post.slug} />
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-navy-100 dark:border-navy-800 text-navy-400 dark:text-navy-200 dark:bg-navy-900 w-full border-t bg-white/80 py-6 text-center text-xs backdrop-blur">
        © 2024 jeonb.log. All rights reserved.
      </footer>
    </div>
  )
}

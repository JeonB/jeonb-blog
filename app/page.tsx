import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import LikeButton from '../components/LikeButton'
import { getAllPosts } from '../lib/post'
import ThemeToggle from '../components/ThemeToggle'

export default async function Home() {
  // 클라이언트 컴포넌트에서만 인증 상태 사용
  // "use client"; // (Next.js 13 app 디렉토리에서 상위에서 선언 필요시 추가)
  const { data: session, status } =
    typeof window !== 'undefined'
      ? require('next-auth/react').useSession()
      : { data: null, status: 'loading' }

  const posts = await getAllPosts()

  return (
    <div className="bg-navy-50 dark:bg-navy-900 flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)] text-black dark:text-white">
      {/* 네비게이션 바 */}
      <header className="border-navy-100 dark:border-navy-800 dark:bg-navy-900 sticky top-0 z-10 flex w-full items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <Image src="/next.svg" alt="로고" width={32} height={32} />
          <span className="text-lg font-bold tracking-tight">jeonb.log</span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Posts
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
          {/* 로그인/로그아웃 버튼 */}
          {status === 'loading' ? null : session ? (
            <button
              onClick={() => signOut()}
              className="bg-navy-100 dark:bg-navy-700 hover:bg-navy-200 dark:hover:bg-navy-600 ml-4 rounded px-3 py-1">
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-primary hover:bg-navy-700 ml-4 rounded px-3 py-1 text-white">
              로그인
            </button>
          )}
          <ThemeToggle />
        </nav>
      </header>

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
              <a
                href={`/blog/${post.slug}`}
                className="text-primary dark:text-navy-100 mb-1 text-xl font-semibold hover:underline">
                {post.title}
              </a>
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

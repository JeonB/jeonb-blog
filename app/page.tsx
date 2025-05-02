import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import LikeButton from "../components/LikeButton";
import { getAllPosts } from "../lib/post";
import ThemeToggle from "../components/ThemeToggle";

export default async function Home() {
  // 클라이언트 컴포넌트에서만 인증 상태 사용
  // "use client"; // (Next.js 13 app 디렉토리에서 상위에서 선언 필요시 추가)
  const { data: session, status } = typeof window !== "undefined" ? require("next-auth/react").useSession() : { data: null, status: "loading" };

  const posts = await getAllPosts();

  return (
    <div className="min-h-screen flex flex-col bg-navy-50 dark:bg-navy-900 text-black dark:text-white font-[family-name:var(--font-geist-sans)]">
      {/* 네비게이션 바 */}
      <header className="w-full border-b border-navy-100 dark:border-navy-800 py-4 px-6 flex items-center justify-between bg-white/80 dark:bg-navy-900 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Image src="/next.svg" alt="로고" width={32} height={32} />
          <span className="font-bold text-lg tracking-tight">jeonb.log</span>
        </div>
        <nav className="flex gap-6 text-sm items-center">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Posts</a>
          <a href="#" className="hover:underline">About</a>
          {/* 로그인/로그아웃 버튼 */}
          {status === "loading" ? null : session ? (
            <button onClick={() => signOut()} className="ml-4 px-3 py-1 rounded bg-navy-100 dark:bg-navy-700 hover:bg-navy-200 dark:hover:bg-navy-600">로그아웃</button>
          ) : (
            <button onClick={() => signIn()} className="ml-4 px-3 py-1 rounded bg-primary text-white hover:bg-navy-700">로그인</button>
          )}
          <ThemeToggle />
        </nav>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-primary dark:text-navy-100">최신 포스트</h1>
        <div className="grid gap-6">
          {posts.length === 0 && <div className="text-navy-400">아직 포스트가 없습니다.</div>}
          {posts.map((post) => (
            <article key={post.slug} className="rounded-lg border border-navy-100 dark:border-navy-800 p-6 bg-white dark:bg-navy-800 shadow-sm transition hover:shadow-md flex flex-col gap-2">
              <a href={`/blog/${post.slug}`} className="text-xl font-semibold mb-1 hover:underline text-primary dark:text-navy-100">{post.title}</a>
              <div className="text-xs text-navy-500 dark:text-navy-200 mb-2">
                by {post.author} · {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="text-navy-800 dark:text-navy-100 mb-2 line-clamp-2">{post.content.slice(0, 100)}...</div>
              <div className="flex items-center gap-2 mt-auto">
                <LikeButton postId={post.slug} />
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="w-full py-6 border-t border-navy-100 dark:border-navy-800 text-center text-xs text-navy-400 dark:text-navy-200 bg-white/80 dark:bg-navy-900 backdrop-blur">
        © 2024 jeonb.log. All rights reserved.
      </footer>
    </div>
  );
}

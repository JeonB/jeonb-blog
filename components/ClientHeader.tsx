'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'
import Image from 'next/image'
import Link from 'next/link'

export default function ClientHeader() {
  const { data: session, status } = useSession()

  return (
    <header className="border-navy-100 dark:border-navy-800 dark:bg-navy-900 sticky top-0 z-10 flex w-full items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <Image src="/next.svg" alt="로고" width={32} height={32} />
        <span className="text-lg font-bold tracking-tight">jeonb.log</span>
      </div>
      <nav className="flex items-center gap-6 text-sm">
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        {/* 로그인/로그아웃 버튼 */}
        {status === 'loading' ? null : session ? (
          <button
            onClick={() => signOut()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Sign In
          </button>
        )}
      </nav>
      <ThemeToggle />
    </header>
  )
}

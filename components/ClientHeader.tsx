'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'
import Image from 'next/image'

export default function ClientHeader() {
  const { data: session, status } = useSession()

  return (
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
  )
}

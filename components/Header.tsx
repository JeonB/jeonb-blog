'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const { data: session, status } = useSession()
  return (
    <header className="bg-navy-50 border-navy-100 sticky top-0 z-10 flex w-full items-center justify-between border-b px-6 py-4 text-black backdrop-blur">
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
            className="bg-navy-100 hover:bg-navy-200 ml-4 rounded px-3 py-1">
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

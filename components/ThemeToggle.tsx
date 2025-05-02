'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // 초기 테마 설정 - 클라이언트 사이드에서만 실행
    const isDarkMode = document.documentElement.classList.contains('dark')
    setDark(isDarkMode)
  }, [])

  function toggleTheme() {
    const newDarkValue = !dark
    setDark(newDarkValue)

    if (newDarkValue) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // 마운트되기 전에는 아무것도 렌더링하지 않음 (hydration 불일치 방지)
  if (!isMounted) return null

  return (
    <button
      onClick={toggleTheme}
      aria-label="다크모드 토글"
      suppressHydrationWarning
      className="bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 dark:hover:bg-navy-700 ml-4 rounded-full p-2 transition-colors">
      {dark ? (
        // 달 아이콘
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-navy-700 dark:text-navy-100 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          />
        </svg>
      ) : (
        // 해 아이콘
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-navy-700 dark:text-navy-100 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M12 5a7 7 0 100 14 7 7 0 000-14z"
          />
        </svg>
      )}
    </button>
  )
}

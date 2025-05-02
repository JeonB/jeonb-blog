'use client'
import { useSession, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function LikeButton({ postId }: { postId: string }) {
  const { data: session } = useSession()
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchLike() {
    setError(null)
    try {
      const res = await fetch(
        `/api/likes?postId=${postId}${session?.user?.email ? `&userId=${session.user.email}` : ''}`,
      )
      if (!res.ok) throw new Error('좋아요 정보를 불러오지 못했습니다.')
      const data = await res.json()
      setCount(data.count)
      setLiked(data.liked)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  useEffect(() => {
    fetchLike()
    // eslint-disable-next-line
  }, [postId, session?.user?.email])

  async function handleLike() {
    if (!session) {
      signIn()
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (liked) {
        const res = await fetch('/api/likes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        })
        if (!res.ok) throw new Error('좋아요 취소에 실패했습니다.')
      } else {
        const res = await fetch('/api/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        })
        if (!res.ok) throw new Error('좋아요에 실패했습니다.')
      }
      fetchLike()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-1 select-none ${liked ? 'text-primary' : 'text-navy-400 dark:text-navy-200'} transition-colors`}
        aria-label={liked ? '좋아요 취소' : '좋아요'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={liked ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`h-6 w-6 ${liked ? 'scale-110' : ''} transition-transform`}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75C4.462 3.75 2 6.212 2 9.25c0 5.25 9 11 9 11s9-5.75 9-11c0-3.038-2.462-5.5-5.5-5.5z"
          />
        </svg>
        <span className="text-sm font-medium">{count}</span>
        {loading && <span className="ml-1 animate-pulse text-xs">...</span>}
      </button>
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </div>
  )
}

'use client'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WritePostPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn() // 로그인 페이지로 이동
    }
  }, [status])

  if (status === 'loading') {
    return <div>로딩 중...</div>
  }

  if (!session) {
    return null // signIn() 호출 후라면 아무것도 렌더링하지 않음
  }

  return (
    <div className="mx-auto max-w-xl py-12">
      <h1 className="mb-6 text-2xl font-bold">포스트 작성</h1>
      {/* 포스트 작성 폼은 추후 구현 */}
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="제목"
          className="rounded border px-3 py-2"
        />
        <textarea
          placeholder="내용"
          className="min-h-[120px] rounded border px-3 py-2"
        />
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          작성하기
        </button>
      </form>
    </div>
  )
}

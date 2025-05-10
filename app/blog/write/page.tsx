import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import WriteForm from './WriteForm'

export default async function WritePostPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Write New Post</h1>
      <WriteForm />
    </div>
  )
}

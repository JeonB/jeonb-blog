import LikeButton from '../../../components/LikeButton'
import CommentSection from '../../../components/CommentSection'
import { getPostBySlug } from '../../../lib/post'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) return notFound()
  return (
    <div className="dark:bg-navy-900 mx-auto max-w-2xl rounded-lg bg-white px-4 py-12 text-black shadow-md dark:text-white">
      <h1 className="text-primary dark:text-navy-100 mb-2 text-3xl font-bold">
        {post.title}
      </h1>
      <div className="text-navy-500 dark:text-navy-200 mb-4 text-sm">
        by {post.author} · {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <div className="text-navy-800 dark:text-navy-100 mb-6 whitespace-pre-line">
        {post.content}
      </div>
      <div className="mb-8">
        <LikeButton postId={post.slug} />
      </div>
      <CommentSection postId={post.slug} />
    </div>
  )
}

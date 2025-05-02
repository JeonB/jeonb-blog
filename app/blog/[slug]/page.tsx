import LikeButton from "../../../components/LikeButton";
import CommentSection from "../../../components/CommentSection";
import { getPostBySlug } from "../../../lib/post";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 bg-white dark:bg-navy-900 text-black dark:text-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2 text-primary dark:text-navy-100">{post.title}</h1>
      <div className="text-sm text-navy-500 dark:text-navy-200 mb-4">
        by {post.author} · {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <div className="mb-6 text-navy-800 dark:text-navy-100 whitespace-pre-line">{post.content}</div>
      <div className="mb-8">
        <LikeButton postId={post.slug} />
      </div>
      <CommentSection postId={post.slug} />
    </div>
  );
}
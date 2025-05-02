"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Comment {
  _id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export default function CommentSection({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  async function fetchComments() {
    setFetching(true);
    setError(null);
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (!res.ok) throw new Error("댓글을 불러오지 못했습니다.");
      const data = await res.json();
      setComments(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });
      if (!res.ok) throw new Error("댓글 작성에 실패했습니다.");
      setContent("");
      fetchComments();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("댓글 삭제에 실패했습니다.");
      fetchComments();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10">
      <h3 className="font-semibold mb-3">댓글</h3>
      {fetching && <div className="text-xs text-gray-400">불러오는 중...</div>}
      {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
      <div className="space-y-4 mb-4">
        {comments.length === 0 && !fetching && <div className="text-gray-400">아직 댓글이 없습니다.</div>}
        {comments.map((c) => (
          <div key={c._id} className="border-b pb-2 flex justify-between items-center">
            <div>
              <span className="font-bold text-sm mr-2">{c.userId}</span>
              <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
              <div className="mt-1 text-sm">{c.content}</div>
            </div>
            {session?.user?.email === c.userId && (
              <button onClick={() => handleDelete(c._id)} className="text-xs text-red-500 ml-2" disabled={loading}>
                {loading ? "..." : "삭제"}
              </button>
            )}
          </div>
        ))}
      </div>
      {session ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={content}
            onChange={e => setContent(e.target.value)}
            className="flex-1 border rounded px-2 py-1 bg-white dark:bg-navy-900 text-black dark:text-white border-navy-200 dark:border-navy-700 focus:ring-2 focus:ring-primary"
            placeholder="댓글을 입력하세요"
            disabled={loading}
          />
          <button type="submit" className="bg-primary hover:bg-navy-700 text-white rounded px-3 py-1" disabled={loading || !content.trim()}>
            {loading ? "등록 중..." : "등록"}
          </button>
        </form>
      ) : (
        <div className="text-sm text-gray-500">댓글을 작성하려면 로그인하세요.</div>
      )}
    </section>
  );
}
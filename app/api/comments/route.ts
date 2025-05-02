import { NextRequest, NextResponse } from "next/server";
import { getCommentsByPostId, addComment } from "../../../lib/comment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }
  const comments = await getCommentsByPostId(postId);
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { postId, content } = await req.json();
  if (!postId || !content) {
    return NextResponse.json({ error: "postId and content are required" }, { status: 400 });
  }
  const userId = session.user.email;
  const insertedId = await addComment({ postId, userId, content });
  return NextResponse.json({ insertedId });
}
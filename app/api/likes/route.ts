import { NextRequest, NextResponse } from "next/server";
import { addLike, removeLike, countLikes, hasUserLiked } from "../../../lib/like";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  const userId = searchParams.get("userId");
  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }
  const count = await countLikes(postId);
  let liked = false;
  if (userId) {
    liked = await hasUserLiked(postId, userId);
  }
  return NextResponse.json({ count, liked });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }
  const userId = session.user.email;
  const success = await addLike(postId, userId);
  return NextResponse.json({ success });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }
  const userId = session.user.email;
  const success = await removeLike(postId, userId);
  return NextResponse.json({ success });
}
import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export interface Like {
  _id?: ObjectId;
  postId: string;
  userId: string;
  createdAt: Date;
}

export async function addLike(postId: string, userId: string) {
  const client = await clientPromise;
  const db = client.db();
  // 중복 방지: 이미 있으면 추가하지 않음
  const existing = await db.collection<Like>("likes").findOne({ postId, userId });
  if (existing) return false;
  await db.collection<Like>("likes").insertOne({ postId, userId, createdAt: new Date() });
  return true;
}

export async function removeLike(postId: string, userId: string) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection<Like>("likes").deleteOne({ postId, userId });
  return result.deletedCount === 1;
}

export async function countLikes(postId: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Like>("likes").countDocuments({ postId });
}

export async function hasUserLiked(postId: string, userId: string) {
  const client = await clientPromise;
  const db = client.db();
  const like = await db.collection<Like>("likes").findOne({ postId, userId });
  return !!like;
}
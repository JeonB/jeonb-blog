import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export interface Post {
  _id?: ObjectId;
  slug: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Post>("posts").findOne({ slug });
}

export async function getAllPosts(): Promise<Post[]> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Post>("posts").find({}).sort({ createdAt: -1 }).toArray();
}
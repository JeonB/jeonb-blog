import { ObjectId } from 'mongodb'
import clientPromise from './mongodb'

export interface Comment {
  _id?: ObjectId
  postId: string
  userId: string
  content: string
  createdAt: Date
}

export async function getCommentsByPostId(postId: string) {
  const client = await clientPromise
  const db = client.db()
  return db
    .collection<Comment>('comments')
    .find({ postId })
    .sort({ createdAt: 1 })
    .toArray()
}

export async function addComment(comment: Omit<Comment, '_id' | 'createdAt'>) {
  const client = await clientPromise
  const db = client.db()
  const doc = { ...comment, createdAt: new Date() }
  const result = await db.collection<Comment>('comments').insertOne(doc)
  return result.insertedId
}

export async function deleteComment(commentId: string, userId: string) {
  const client = await clientPromise
  const db = client.db()
  const result = await db
    .collection<Comment>('comments')
    .deleteOne({ _id: new ObjectId(commentId), userId })
  return result.deletedCount === 1
}

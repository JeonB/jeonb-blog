import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  // @ts-expect-error: Node.js global type 확장 (mongo client 캐싱)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    // @ts-expect-error: Node.js global type 확장 (mongo client 캐싱)
    global._mongoClientPromise = client.connect()
  }
  // @ts-expect-error: Node.js global type 확장 (mongo client 캐싱)
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

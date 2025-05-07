import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, tags } = body

    // TODO: 여기에 데이터베이스 저장 로직 구현
    // 예시: await prisma.post.create({ ... })

    return NextResponse.json(
      { message: 'Post created successfully' },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 },
    )
  }
}

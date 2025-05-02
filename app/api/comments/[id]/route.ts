import { NextRequest, NextResponse } from 'next/server'
import { deleteComment } from '../../../../lib/comment'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const commentId = params.id
  const userId = session.user.email
  const success = await deleteComment(commentId, userId)
  if (!success) {
    return NextResponse.json(
      { error: '삭제 권한이 없거나 댓글이 존재하지 않습니다.' },
      { status: 403 },
    )
  }
  return NextResponse.json({ success: true })
}

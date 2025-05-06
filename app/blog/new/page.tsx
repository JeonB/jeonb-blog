'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

// 마크다운 에디터를 클라이언트 사이드에서만 렌더링하도록 설정
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then(mod => mod.default),
  { ssr: false },
)

export default function NewPost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      router.push('/blog')
      router.refresh()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditorChange = (value?: string) => {
    setFormData(prev => ({
      ...prev,
      content: value || '',
    }))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8" data-color-mode="light">
      <h1 className="mb-8 text-3xl font-bold">Write New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="w-full">
            <MDEditor
              value={formData.content}
              onChange={handleEditorChange}
              height={400}
              preview="edit"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="mb-2 block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. javascript, react, nextjs"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50">
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

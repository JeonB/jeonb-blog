'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import ImageEditor from '@/components/ImageEditor'

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
    images: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }
  }

  const uploadImage = async (file: File) => {
    setUploadingImage(true)
    setUploadError(null)

    try {
      validateFile(file)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const { url } = await response.json()
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url],
      }))

      // 마크다운 에디터에 이미지 삽입
      const imageMarkdown = `![${file.name}](${url})`
      setFormData(prev => ({
        ...prev,
        content: prev.content + '\n' + imageMarkdown,
      }))

      // 미리보기 URL 초기화
      setPreviewUrl(null)
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image',
      )
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 미리보기 URL 생성
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)
    setSelectedImage(preview)
    setShowImageEditor(true)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // 미리보기 URL 생성
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)
    setSelectedImage(preview)
    setShowImageEditor(true)
  }, [])

  const handleCropComplete = async (croppedImageUrl: string) => {
    try {
      // Base64 이미지를 Blob으로 변환
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })

      await uploadImage(file)
      setShowImageEditor(false)
      setSelectedImage(null)
    } catch (error) {
      console.error('Error processing cropped image:', error)
      setUploadError('Failed to process cropped image')
    }
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
            htmlFor="image"
            className="mb-2 block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <div
            className={`relative mt-2 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } p-6 transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {previewUrl ? (
              <div className="relative h-full w-full">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto max-h-[200px] max-w-full rounded-lg object-contain"
                />
                {uploadingImage && (
                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                    <p className="text-white">Uploading...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your image here, or click to select
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="mt-2 text-sm text-red-500">{uploadError}</p>
          )}
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

      {showImageEditor && selectedImage && (
        <ImageEditor
          imageUrl={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowImageEditor(false)
            setSelectedImage(null)
            setPreviewUrl(null)
          }}
        />
      )}
    </div>
  )
}

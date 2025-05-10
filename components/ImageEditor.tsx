'use client'

import { useState, useRef } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Image from 'next/image'

interface ImageEditorProps {
  imageUrl: string
  onCropComplete: (croppedImageUrl: string) => void
  onCancel: () => void
}

export default function ImageEditor({
  imageUrl,
  onCropComplete,
  onCancel,
}: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  })
  const imageRef = useRef<HTMLImageElement>(null)

  const handleCropComplete = () => {
    if (!imageRef.current) return

    const canvas = document.createElement('canvas')
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    )

    const croppedImageUrl = canvas.toDataURL('image/jpeg')
    onCropComplete(croppedImageUrl)
  }

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Edit Image</h2>
        <div className="mb-4">
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            aspect={16 / 9}
            className="max-h-[60vh] w-full">
            <div className="relative">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop preview"
                className="max-h-[60vh] w-full object-contain"
              />
            </div>
          </ReactCrop>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none">
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

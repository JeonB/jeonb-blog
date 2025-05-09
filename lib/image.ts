import sharp from 'sharp'

export async function optimizeImage(
  buffer: Buffer,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'jpeg' | 'png' | 'webp'
  } = {},
) {
  const { width = 1200, height, quality = 80, format = 'webp' } = options

  const image = sharp(buffer)

  // 이미지 메타데이터 가져오기
  const metadata = await image.metadata()

  // 원본 이미지가 지정된 크기보다 작으면 리사이징하지 않음
  if (metadata.width && metadata.width <= width) {
    return image.toFormat(format, { quality }).toBuffer()
  }

  // 이미지 리사이징
  return image
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFormat(format, { quality })
    .toBuffer()
}

import { applyWatermarkToImage } from '@/domains/memora/utils/watermark/applyWatermarkToImage'

export const createThumbnail = (file, watermark) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve('')
      return
    }

    const reader = new FileReader()
    reader.onload = async e => {
      try {
        const img = new Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const maxSize = 400
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            let thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8)

            // Apply watermark to thumbnail if provided
            if (watermark) {
              thumbnailDataUrl = await applyWatermarkToImage(thumbnailDataUrl, watermark)
            }

            resolve(thumbnailDataUrl)
          } else {
            resolve(e.target?.result || '')
          }
        }
        img.onerror = reject
        img.src = e.target?.result
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

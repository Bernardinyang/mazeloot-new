import { applyFontStyle } from './applyFontStyle'
import { getWatermarkPosition } from './getWatermarkPosition'

// Apply watermark to image
export const applyWatermarkToImage = async (imageDataUrl, watermark) => {
  // Guard against null watermark
  if (!watermark) {
    throw new Error('Watermark is required')
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Draw the original image
      ctx.drawImage(img, 0, 0)

      // Apply watermark
      ctx.save()
      ctx.globalAlpha = (watermark.opacity || 50) / 100

      if (watermark.type === 'text' && watermark.text) {
        // Text watermark - scale based on smaller dimension to ensure it fits
        const minDimension = Math.min(img.width, img.height)
        // Scale is a percentage (0-100), so we use it to determine size relative to image
        // Max font size should be around 5-10% of the smaller dimension
        const maxFontSize = minDimension * 0.1 // 10% of smaller dimension
        const fontSize = Math.min(Math.max((minDimension * watermark.scale) / 100, 12), maxFontSize)
        const fontFamily = watermark.fontFamily || 'Arial'

        // Apply font style
        if (watermark.fontStyle) {
          applyFontStyle(ctx, watermark.fontStyle, fontSize, fontFamily)
        } else {
          ctx.font = `${fontSize}px ${fontFamily}`
        }

        ctx.fillStyle = watermark.fontColor || '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Apply text transform
        let text = watermark.text
        if (watermark.textTransform === 'uppercase') {
          text = text.toUpperCase()
        } else if (watermark.textTransform === 'lowercase') {
          text = text.toLowerCase()
        } else if (watermark.textTransform === 'capitalize') {
          text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
        }

        // Measure text for positioning
        let metrics = ctx.measureText(text)
        let textWidth = metrics.width
        let actualFontSize = fontSize
        const padding = watermark.padding || 0

        // Ensure text doesn't exceed 80% of canvas width
        const maxTextWidth = canvas.width * 0.8
        if (textWidth > maxTextWidth) {
          // Scale down font size proportionally if text is too wide
          const scaleFactor = maxTextWidth / textWidth
          actualFontSize = fontSize * scaleFactor
          // Reapply font with adjusted size
          if (watermark.fontStyle) {
            applyFontStyle(ctx, watermark.fontStyle, actualFontSize, fontFamily)
          } else {
            ctx.font = `${actualFontSize}px ${fontFamily}`
          }
          // Remeasure with new font size
          metrics = ctx.measureText(text)
          textWidth = metrics.width
        }

        const totalWidth = textWidth + padding * 2
        const totalHeight = actualFontSize * (watermark.lineHeight || 1.2) + padding * 2

        // Draw background if specified
        if (watermark.backgroundColor) {
          const borderRadius = watermark.borderRadius || 0
          const pos = getWatermarkPosition(
            watermark.position,
            canvas.width,
            canvas.height,
            totalWidth,
            totalHeight
          )

          ctx.fillStyle = watermark.backgroundColor
          if (borderRadius > 0) {
            ctx.beginPath()
            // Use roundRect if available, otherwise use arc
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(pos.x, pos.y, totalWidth, totalHeight, borderRadius)
            } else {
              // Fallback
              const x = pos.x
              const y = pos.y
              const w = totalWidth
              const h = totalHeight
              const r = borderRadius
              ctx.moveTo(x + r, y)
              ctx.lineTo(x + w - r, y)
              ctx.quadraticCurveTo(x + w, y, x + w, y + r)
              ctx.lineTo(x + w, y + h - r)
              ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
              ctx.lineTo(x + r, y + h)
              ctx.quadraticCurveTo(x, y + h, x, y + h - r)
              ctx.lineTo(x, y + r)
              ctx.quadraticCurveTo(x, y, x + r, y)
              ctx.closePath()
            }
            ctx.fill()
          } else {
            ctx.fillRect(pos.x, pos.y, totalWidth, totalHeight)
          }
        }

        // Draw border if specified
        if (watermark.borderWidth && watermark.borderWidth > 0) {
          const pos = getWatermarkPosition(
            watermark.position,
            canvas.width,
            canvas.height,
            totalWidth,
            totalHeight
          )
          ctx.strokeStyle = watermark.borderColor || '#000000'
          ctx.lineWidth = watermark.borderWidth
          ctx.setLineDash(
            watermark.borderStyle === 'dashed'
              ? [5, 5]
              : watermark.borderStyle === 'dotted'
                ? [2, 2]
                : []
          )
          const borderRadius = watermark.borderRadius || 0
          if (borderRadius > 0) {
            ctx.beginPath()
            // Use roundRect if available, otherwise use arc
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(pos.x, pos.y, totalWidth, totalHeight, borderRadius)
            } else {
              // Fallback
              const x = pos.x
              const y = pos.y
              const w = totalWidth
              const h = totalHeight
              const r = borderRadius
              ctx.moveTo(x + r, y)
              ctx.lineTo(x + w - r, y)
              ctx.quadraticCurveTo(x + w, y, x + w, y + r)
              ctx.lineTo(x + w, y + h - r)
              ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
              ctx.lineTo(x + r, y + h)
              ctx.quadraticCurveTo(x, y + h, x, y + h - r)
              ctx.lineTo(x, y + r)
              ctx.quadraticCurveTo(x, y, x + r, y)
              ctx.closePath()
            }
            ctx.stroke()
          } else {
            ctx.strokeRect(pos.x, pos.y, totalWidth, totalHeight)
          }
        }

        // Draw text
        ctx.fillStyle = watermark.fontColor || '#FFFFFF'
        const pos = getWatermarkPosition(
          watermark.position,
          canvas.width,
          canvas.height,
          totalWidth,
          totalHeight
        )
        ctx.fillText(text, pos.x + totalWidth / 2, pos.y + totalHeight / 2)
      } else if (watermark.type === 'image' && watermark.imageUrl) {
        // Image watermark - scale based on target image size
        const watermarkImg = new Image()
        watermarkImg.crossOrigin = 'anonymous'
        watermarkImg.onload = () => {
          // Calculate scale based on target image size, not watermark's original size
          const minDimension = Math.min(img.width, img.height)
          // Scale is a percentage (0-100), use it to determine max size relative to image
          // Max watermark size should be around 20-30% of the smaller dimension
          const maxWatermarkSize = minDimension * 0.25 // 25% of smaller dimension
          const scale = watermark.scale / 100

          // Calculate desired size based on scale percentage
          const desiredWidth = watermarkImg.width * scale
          const desiredHeight = watermarkImg.height * scale

          // Ensure watermark doesn't exceed max size while maintaining aspect ratio
          let watermarkWidth = desiredWidth
          let watermarkHeight = desiredHeight

          if (watermarkWidth > maxWatermarkSize || watermarkHeight > maxWatermarkSize) {
            const aspectRatio = watermarkImg.width / watermarkImg.height
            if (watermarkWidth > watermarkHeight) {
              watermarkWidth = maxWatermarkSize
              watermarkHeight = maxWatermarkSize / aspectRatio
            } else {
              watermarkHeight = maxWatermarkSize
              watermarkWidth = maxWatermarkSize * aspectRatio
            }
          }

          const pos = getWatermarkPosition(
            watermark.position,
            canvas.width,
            canvas.height,
            watermarkWidth,
            watermarkHeight
          )

          ctx.drawImage(watermarkImg, pos.x, pos.y, watermarkWidth, watermarkHeight)
          ctx.restore()
          resolve(canvas.toDataURL('image/jpeg', 0.9))
        }
        watermarkImg.onerror = reject
        watermarkImg.src = watermark.imageUrl
        return
      }

      ctx.restore()
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.onerror = reject
    img.src = imageDataUrl
  })
}

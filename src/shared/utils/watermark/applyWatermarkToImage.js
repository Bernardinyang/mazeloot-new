import { applyFontStyle } from './applyFontStyle'
import { getWatermarkPosition } from './getWatermarkPosition'

export const applyWatermarkToImage = async (imageDataUrl, watermark) => {
  if (!watermark) {
    throw new Error('Watermark is required')
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    // Only set crossOrigin if it's a URL, not a data URL
    if (imageDataUrl && !imageDataUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous'
    }
    
    img.onerror = (error) => {
      reject(new Error('Failed to load image. This may be due to CORS restrictions.'))
    }
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      try {
        ctx.drawImage(img, 0, 0)
      } catch (error) {
        reject(new Error('Failed to draw image on canvas. This may be due to CORS restrictions.'))
        return
      }

      ctx.save()
      ctx.globalAlpha = (watermark.opacity || 50) / 100

      if (watermark.type === 'text' && watermark.text) {
        // Enhanced scaling: padding-aware with diagonal fallback for extreme aspect ratios
        const scalePercent = (watermark.scale || 50) / 100 // Convert to 0.0-1.0
        
        // Calculate padding (5% of min dimension, minimum 20px)
        const basePadding = Math.min(img.width, img.height) * 0.05
        const imagePadding = Math.max(20, basePadding)
        
        // Calculate usable dimensions (accounting for padding)
        const usableWidth = Math.max(img.width - (imagePadding * 2), img.width * 0.9)
        const usableHeight = Math.max(img.height - (imagePadding * 2), img.height * 0.9)
        const minDimension = Math.min(usableWidth, usableHeight)
        
        // For extreme aspect ratios (panoramic/tall), use diagonal as fallback
        const aspectRatio = img.width / img.height
        const isExtremeAspectRatio = aspectRatio > 3.0 || aspectRatio < 0.33
        
        let maxFontSize, baseFontSize
        if (isExtremeAspectRatio) {
          // Use diagonal-based scaling for extreme aspect ratios
          const diagonal = Math.sqrt(img.width * img.width + img.height * img.height)
          const baseSize = diagonal * 0.05 // 5% of diagonal
          maxFontSize = baseSize * 2 // Max 10% of diagonal
          baseFontSize = baseSize * scalePercent
        } else {
          // Standard min-dimension approach
          maxFontSize = minDimension * 0.1 // Max 10% of min dimension
          baseFontSize = minDimension * scalePercent * 0.1 // Scale% of max font size
        }
        
        const fontSize = Math.min(Math.max(baseFontSize, 12), maxFontSize) // Min 12px, enforce max
        const fontFamily = watermark.fontFamily || 'Arial'

        if (watermark.fontStyle) {
          applyFontStyle(ctx, watermark.fontStyle, fontSize, fontFamily)
        } else {
          ctx.font = `${fontSize}px ${fontFamily}`
        }

        ctx.fillStyle = watermark.fontColor || '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        let text = watermark.text
        if (watermark.textTransform === 'uppercase') {
          text = text.toUpperCase()
        } else if (watermark.textTransform === 'lowercase') {
          text = text.toLowerCase()
        } else if (watermark.textTransform === 'capitalize') {
          text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
        }

        let metrics = ctx.measureText(text)
        let textWidth = metrics.width
        let actualFontSize = fontSize
        const padding = watermark.padding || 0

        const maxTextWidth = canvas.width * 0.8
        if (textWidth > maxTextWidth) {
          const scaleFactor = maxTextWidth / textWidth
          actualFontSize = fontSize * scaleFactor
          if (watermark.fontStyle) {
            applyFontStyle(ctx, watermark.fontStyle, actualFontSize, fontFamily)
          } else {
            ctx.font = `${actualFontSize}px ${fontFamily}`
          }
          metrics = ctx.measureText(text)
          textWidth = metrics.width
        }

        const totalWidth = textWidth + padding * 2
        const totalHeight = actualFontSize * (watermark.lineHeight || 1.2) + padding * 2

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
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(pos.x, pos.y, totalWidth, totalHeight, borderRadius)
            } else {
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
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(pos.x, pos.y, totalWidth, totalHeight, borderRadius)
            } else {
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
        const watermarkImg = new Image()
        watermarkImg.crossOrigin = 'anonymous'
        watermarkImg.onload = () => {
          // Enhanced scaling: padding-aware with diagonal fallback for extreme aspect ratios
          const scalePercent = (watermark.scale || 100) / 100 // Convert to 0.0-1.0
          
          // Calculate padding (5% of min dimension, minimum 20px)
          const basePadding = Math.min(img.width, img.height) * 0.05
          const imagePadding = Math.max(20, basePadding)
          
          // Calculate usable dimensions (accounting for padding)
          const usableWidth = Math.max(img.width - (imagePadding * 2), img.width * 0.9)
          const usableHeight = Math.max(img.height - (imagePadding * 2), img.height * 0.9)
          const minImageDimension = Math.min(usableWidth, usableHeight)
          
          // For extreme aspect ratios (panoramic/tall), use diagonal as fallback
          const aspectRatio = img.width / img.height
          const isExtremeAspectRatio = aspectRatio > 3.0 || aspectRatio < 0.33
          
          let maxWatermarkSize, targetWatermarkSize
          if (isExtremeAspectRatio) {
            // Use diagonal-based scaling for extreme aspect ratios
            const diagonal = Math.sqrt(img.width * img.width + img.height * img.height)
            const baseSize = diagonal * 0.05 // 5% of diagonal
            maxWatermarkSize = baseSize * 5 // Max 25% of diagonal
            targetWatermarkSize = maxWatermarkSize * scalePercent
          } else {
            // Standard min-dimension approach
            maxWatermarkSize = minImageDimension * 0.25 // Max 25% of min dimension
            targetWatermarkSize = maxWatermarkSize * scalePercent
          }
          
          const watermarkAspectRatio = watermarkImg.width / watermarkImg.height
          
          let watermarkWidth = targetWatermarkSize
          let watermarkHeight = targetWatermarkSize / watermarkAspectRatio
          
          // If watermark is wider than tall, use width as base
          if (watermarkImg.width > watermarkImg.height) {
            watermarkWidth = targetWatermarkSize
            watermarkHeight = targetWatermarkSize / watermarkAspectRatio
          } else {
            watermarkHeight = targetWatermarkSize
            watermarkWidth = targetWatermarkSize * watermarkAspectRatio
          }
          
          // Ensure watermark doesn't exceed image bounds (90% max) and enforce minimum size
          const maxSize = minImageDimension * 0.9
          const minSize = 20 // Minimum 20px for image watermarks
          
          if (watermarkWidth > maxSize || watermarkHeight > maxSize) {
            if (watermarkWidth > watermarkHeight) {
              watermarkWidth = maxSize
              watermarkHeight = maxSize / watermarkAspectRatio
            } else {
              watermarkHeight = maxSize
              watermarkWidth = maxSize * watermarkAspectRatio
            }
          }
          
          // Enforce minimum size
          if (watermarkWidth < minSize || watermarkHeight < minSize) {
            if (watermarkWidth < watermarkHeight) {
              watermarkWidth = minSize
              watermarkHeight = minSize / watermarkAspectRatio
            } else {
              watermarkHeight = minSize
              watermarkWidth = minSize * watermarkAspectRatio
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
          try {
            resolve(canvas.toDataURL('image/jpeg', 0.9))
          } catch (error) {
            // Handle tainted canvas error (CORS issue)
            if (error.name === 'SecurityError' || error.message.includes('tainted')) {
              reject(new Error('Cannot export canvas due to CORS restrictions. Please ensure images are served with proper CORS headers.'))
            } else {
              reject(error)
            }
          }
        }
        watermarkImg.onerror = reject
        watermarkImg.src = watermark.imageUrl
        return
      }

      ctx.restore()
      try {
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      } catch (error) {
        // Handle tainted canvas error (CORS issue)
        if (error.name === 'SecurityError' || error.message.includes('tainted')) {
          reject(new Error('Cannot export canvas due to CORS restrictions. Please ensure images are served with proper CORS headers.'))
        } else {
          reject(error)
        }
      }
    }
    img.onerror = reject
    img.src = imageDataUrl
  })
}

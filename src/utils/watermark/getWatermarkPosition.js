export const getWatermarkPosition = (
  position,
  canvasWidth,
  canvasHeight,
  watermarkWidth,
  watermarkHeight
) => {
  const positions = {
    'top-left': { x: watermarkWidth / 2, y: watermarkHeight / 2 },
    top: { x: canvasWidth / 2, y: watermarkHeight / 2 },
    'top-right': { x: canvasWidth - watermarkWidth / 2, y: watermarkHeight / 2 },
    left: { x: watermarkWidth / 2, y: canvasHeight / 2 },
    center: { x: canvasWidth / 2, y: canvasHeight / 2 },
    right: { x: canvasWidth - watermarkWidth / 2, y: canvasHeight / 2 },
    'bottom-left': { x: watermarkWidth / 2, y: canvasHeight - watermarkHeight / 2 },
    bottom: { x: canvasWidth / 2, y: canvasHeight - watermarkHeight / 2 },
    'bottom-right': { x: canvasWidth - watermarkWidth / 2, y: canvasHeight - watermarkHeight / 2 },
  }

  const pos = positions[position] || positions.center

  // Center the watermark at the position
  return { x: pos.x, y: pos.y }
}

export const applyFontStyle = (ctx, style, fontSize, fontFamily) => {
  const styles = style.split('-')
  const weight = styles.includes('bold') ? 'bold' : 'normal'
  const italic = styles.includes('italic') ? 'italic' : ''
  ctx.font = `${weight} ${italic} ${fontSize}px ${fontFamily}`
}

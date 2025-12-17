export const copyTextToClipboard = text => {
  return navigator.clipboard.writeText(text)
}

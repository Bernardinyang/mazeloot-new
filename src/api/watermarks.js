/**
 * Watermarks API composable
 * Handles all watermark-related API calls
 * Uses localStorage for persistence until backend is ready
 */

import { storage } from '@/utils/storage'
import { generateUUID } from '@/utils/uuid'
import { delay } from '@/utils/delay'

const WATERMARKS_STORAGE_KEY = 'mazeloot_watermarks'

/**
 * Initialize mock data in localStorage if not exists
 */
const initializeMockData = () => {
  const existing = storage.get(WATERMARKS_STORAGE_KEY)
  if (existing && existing.length > 0) {
    return existing
  }

  const now = new Date()
  const recentDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
  const oldDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const mockWatermarks = [
    {
      id: generateUUID(),
      name: 'Company Logo',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=100&fit=crop',
      scale: 50,
      opacity: 80,
      position: 'bottom-right',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
    },
    {
      id: generateUUID(),
      name: 'Copyright Text',
      type: 'text',
      text: '© 2024 My Company',
      fontStyle: 'bold',
      fontColor: '#000000',
      backgroundColor: '#FFFFFF',
      lineHeight: 1.5,
      letterSpacing: 0,
      padding: 8,
      textTransform: 'none',
      borderRadius: 4,
      borderWidth: 0,
      borderColor: '#000000',
      borderStyle: 'none',
      scale: 75,
      opacity: 90,
      position: 'bottom-left',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
    },
    {
      id: generateUUID(),
      name: 'Watermark Logo',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=200&h=100&fit=crop',
      scale: 40,
      opacity: 70,
      position: 'center',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
    },
    {
      id: generateUUID(),
      name: 'Photographer Name',
      type: 'text',
      text: 'John Doe Photography',
      fontFamily: 'Georgia',
      fontStyle: 'italic',
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
      lineHeight: 1.2,
      letterSpacing: 1,
      padding: 10,
      textTransform: 'uppercase',
      borderRadius: 0,
      borderWidth: 0,
      borderColor: '#FFFFFF',
      borderStyle: 'none',
      scale: 60,
      opacity: 85,
      position: 'top-right',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
    },
    {
      id: generateUUID(),
      name: 'Website URL',
      type: 'text',
      text: 'www.example.com',
      fontFamily: 'Verdana',
      fontStyle: 'normal',
      fontColor: '#333333',
      backgroundColor: '#F0F0F0',
      lineHeight: 1.4,
      letterSpacing: 0.5,
      padding: 5,
      textTransform: 'lowercase',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#CCCCCC',
      borderStyle: 'solid',
      scale: 55,
      opacity: 75,
      position: 'bottom-center',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
    },
  ]

  storage.set(WATERMARKS_STORAGE_KEY, mockWatermarks)
  return mockWatermarks
}

/**
 * Get all watermarks from localStorage
 */
const getAllWatermarks = () => {
  const watermarks = storage.get(WATERMARKS_STORAGE_KEY)
  if (!watermarks || watermarks.length === 0) {
    return initializeMockData()
  }
  return watermarks
}

/**
 * Save watermarks to localStorage
 */
const saveWatermarks = watermarks => {
  storage.set(WATERMARKS_STORAGE_KEY, watermarks)
}

export function useWatermarksApi() {
  /**
   * Fetch all watermarks
   */
  const fetchWatermarks = async () => {
    await delay(500)
    return getAllWatermarks()
  }

  /**
   * Fetch single watermark by ID
   */
  const fetchWatermark = async id => {
    await delay(500)

    const watermarks = getAllWatermarks()
    const watermark = watermarks.find(w => w.id === id)

    if (!watermark) {
      throw new Error('Watermark not found')
    }

    return watermark
  }

  /**
   * Create new watermark
   */
  const createWatermark = async data => {
    await delay(1000)

    const watermarks = getAllWatermarks()
    const newWatermark = {
      id: generateUUID(),
      name: data.name,
      type: data.type,
      text: data.text,
      fontFamily: data.fontFamily,
      fontStyle: data.fontStyle,
      fontColor: data.fontColor,
      backgroundColor: data.backgroundColor,
      lineHeight: data.lineHeight,
      letterSpacing: data.letterSpacing,
      padding: data.padding,
      textTransform: data.textTransform,
      borderRadius: data.borderRadius,
      borderWidth: data.borderWidth,
      borderColor: data.borderColor,
      borderStyle: data.borderStyle,
      imageUrl: data.imageUrl,
      scale: data.scale,
      opacity: data.opacity,
      position: data.position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    watermarks.push(newWatermark)
    saveWatermarks(watermarks)

    return newWatermark
  }

  /**
   * Update watermark
   */
  const updateWatermark = async (id, data) => {
    await delay(500)

    const watermarks = getAllWatermarks()
    const index = watermarks.findIndex(w => w.id === id)

    if (index === -1) {
      throw new Error('Watermark not found')
    }

    watermarks[index] = {
      ...watermarks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    saveWatermarks(watermarks)
    return watermarks[index]
  }

  /**
   * Delete watermark
   */
  const deleteWatermark = async id => {
    await delay(500)

    const watermarks = getAllWatermarks()
    const filtered = watermarks.filter(w => w.id !== id)
    saveWatermarks(filtered)
  }

  /**
   * Upload watermark image
   */
  const uploadWatermarkImage = async file => {
    // TODO: Replace with actual API call
    await delay(1000)

    // Mock: create object URL for preview
    return { url: URL.createObjectURL(file) }
  }

  return {
    fetchWatermarks,
    fetchWatermark,
    createWatermark,
    updateWatermark,
    deleteWatermark,
    uploadWatermarkImage,
  }
}

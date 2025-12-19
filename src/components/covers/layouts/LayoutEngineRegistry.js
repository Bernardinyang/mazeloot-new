/**
 * Layout Engine Registry
 * Maps layout types to their corresponding Vue components
 */

import ColumnLayout from './ColumnLayout.vue'
import RowLayout from './RowLayout.vue'
import StackLayout from './StackLayout.vue'

export const LayoutEngines = {
  column: ColumnLayout,
  row: RowLayout,
  stack: StackLayout,
}

/**
 * Get layout engine component by layout type
 * @param {string} layoutType - One of: 'column', 'row', 'stack'
 * @returns {Component} Vue component for the layout engine
 */
export function getLayoutEngine(layoutType) {
  return LayoutEngines[layoutType] || StackLayout // Default fallback to stack
}

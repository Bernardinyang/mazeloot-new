/**
 * AbortController utility
 * Manages request cancellation for component unmounts
 */

export class RequestCanceller {
  private controllers: Map<string, AbortController> = new Map()

  /**
   * Create a new abort controller for a request
   */
  create(key: string): AbortSignal {
    // Cancel any existing request with the same key
    this.cancel(key)

    const controller = new AbortController()
    this.controllers.set(key, controller)
    return controller.signal
  }

  /**
   * Cancel a specific request
   */
  cancel(key: string): void {
    const controller = this.controllers.get(key)
    if (controller) {
      controller.abort()
      this.controllers.delete(key)
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAll(): void {
    this.controllers.forEach(controller => {
      controller.abort()
    })
    this.controllers.clear()
  }

  /**
   * Check if a request is aborted
   */
  isAborted(key: string): boolean {
    const controller = this.controllers.get(key)
    return controller?.signal.aborted ?? false
  }
}

/**
 * Global request canceller instance
 */
export const requestCanceller = new RequestCanceller()

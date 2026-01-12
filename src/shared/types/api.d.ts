export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
}

export interface ApiError {
  message: string
  code?: string
  status: number
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

vi.mock('@/api/auth', () => ({
  useAuthApi: () => ({
    login: vi.fn().mockResolvedValue({
      user: { id: '1', uuid: '1', email: 'john@example.com', name: 'John', first_name: 'John', last_name: 'Doe' },
      token: 'test-token',
    }),
    register: vi.fn().mockResolvedValue({
      user: { id: '1', uuid: '1', email: 'john@example.com', name: 'John Doe', first_name: 'John', last_name: 'Doe' },
      token: 'test-token',
    }),
    logout: vi.fn().mockResolvedValue(undefined),
  }),
}))

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with null user', () => {
    const store = useUserStore()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should initialize from localStorage', () => {
    const user = { id: '1', name: 'John', email: 'john@example.com' }
    const token = 'test-token'

    localStorage.setItem('mazeloot_user', JSON.stringify(user))
    localStorage.setItem('mazeloot_token', token)

    const store = useUserStore()

    expect(store.user).toEqual(user)
    expect(store.token).toBe(token)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should login user', async () => {
    const store = useUserStore()

    await store.login('john@example.com', 'password123')

    expect(store.user).not.toBeNull()
    expect(store.user?.email).toBe('john@example.com')
    expect(store.token).toBeTruthy()
    expect(store.isAuthenticated).toBe(true)
  })

  it('should register user', async () => {
    const store = useUserStore()

    await store.register('John Doe', 'john@example.com', 'password123')

    expect(store.user).not.toBeNull()
    expect(store.user?.name).toBe('John Doe')
    expect(store.user?.email).toBe('john@example.com')
    expect(store.token).toBeTruthy()
  })

  it('should logout user', async () => {
    const store = useUserStore()
    await store.login('john@example.com', 'password123')

    await store.logout()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('user')).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('should update user data', () => {
    const store = useUserStore()
    store.user = { id: '1', name: 'John', email: 'john@example.com' }

    store.updateUser({ name: 'Jane' })

    expect(store.user?.name).toBe('Jane')
    expect(store.user?.email).toBe('john@example.com')
  })

  it('should set loading state during login', async () => {
    const store = useUserStore()

    const loginPromise = store.login('john@example.com', 'password123')

    expect(store.isLoading).toBe(true)

    await loginPromise

    expect(store.isLoading).toBe(false)
  })
})

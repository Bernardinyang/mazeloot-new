import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Login from '@/views/guest/Login.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('Login view', () => {
  it('submits the form and logs in the seeded user', async () => {
    setActivePinia(createPinia())

    const wrapper = mount(Login, {
      global: {
        stubs: [
          'AuthLayout',
          'FormField',
          'Form',
          'Divider',
          'GoogleButton',
          'AuthLink',
          'RouterLink',
          'Button',
          'Label',
        ],
      },
    })

    // Since the Login component uses vee-validate Form to emit submit
    // we call the internal handleLogin directly from the component instance
    const vm = wrapper.vm as any
    const values = { email: 'bernardinyang.bci@gmail.com', password: 'password123', remember: true }

    // call the method
    await vm.handleLogin(values)

    // Check localStorage keys were set
    const storedUser = localStorage.getItem('mazeloot_user') || localStorage.getItem('user')
    const storedToken = localStorage.getItem('mazeloot_token') || localStorage.getItem('token')

    expect(storedUser).toBeTruthy()
    expect(storedToken).toBeTruthy()
  })
})

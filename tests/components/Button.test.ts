import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Button from '@/components/shadcn/button/Button.vue'

describe('Button component', () => {
  it('forwards native attributes and events', async () => {
    const onClick = vi.fn()

    const wrapper = mount(Button, {
      attrs: {
        type: 'submit',
        disabled: 'disabled',
        onClick,
      },
      slots: {
        default: 'Click me',
      },
    })

    // Check that type attribute is present on the rendered element
    expect(wrapper.attributes('type')).toBe('submit')
    expect(wrapper.attributes('disabled')).toBeDefined()

    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})

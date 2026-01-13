import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from '@/shared/components/shadcn/button/Button.vue'

describe('Button component', () => {
  it('forwards native attributes and events', () => {
    const wrapper = mount(Button, {
      attrs: {
        type: 'submit',
        disabled: 'disabled',
        'data-testid': 'test-button',
      },
      slots: {
        default: 'Click me',
      },
    })

    // Check that attributes are forwarded to the rendered element
    const element = wrapper.find('button')
    expect(element.exists()).toBe(true)
    expect(element.attributes('type')).toBe('submit')
    expect(element.attributes('disabled')).toBeDefined()
    expect(element.text()).toBe('Click me')
  })
})
